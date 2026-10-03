/* Skrip uji LinguaSmart — dijalankan dengan Node, tanpa peramban. */
const fs = require('fs');
const path = require('path');

const APP = path.join(__dirname, '..');
const mem = {};

global.window = {
  localStorage: {
    getItem: k => (k in mem ? mem[k] : null),
    setItem: (k, v) => { mem[k] = String(v); },
    removeItem: k => { delete mem[k]; }
  },
  addEventListener() {}, matchMedia: () => ({ matches: false }),
  location: { hash: '' }, scrollTo() {}, print() {}
};
global.document = {
  getElementById: () => null,
  createElement: () => ({
    style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {}, appendChild() {}, setAttribute() {}, insertBefore() {},
    querySelector: () => null, querySelectorAll: () => []
  }),
  addEventListener() {},
  documentElement: { setAttribute() {}, getAttribute: () => 'light' },
  querySelectorAll: () => [],
  body: { appendChild() {}, removeChild() {} }
};
global.LS = {};
global.window.LS = global.LS;

function load(f) {
  const code = fs.readFileSync(path.join(APP, 'js', f), 'utf8');
  try { eval(code); } catch (e) { gagal.push('GAGAL memuat ' + f + ': ' + e.message); }
}

const gagal = [];
function cek(nama, syarat, info) {
  if (syarat) console.log('  ok   ' + nama + (info ? '  (' + info + ')' : ''));
  else { gagal.push(nama + (info ? ' → ' + info : '')); console.log('  GAGAL ' + nama + (info ? '  (' + info + ')' : '')); }
}

load('store.js');
load('data.js');
load('views-tantangan.js');

const U = LS.util, S = LS.store, D = LS.data;

console.log('\n== 1. Integritas data materi ==');
cek('6 bab materi', D.materi.length === 6, 'jumlah=' + D.materi.length);
D.materi.forEach(m => {
  cek('materi ' + m.id + ' punya blok', Array.isArray(m.blok) && m.blok.length > 3);
  cek('materi ' + m.id + ' punya judul/ringkas/menit', !!(m.judul && m.ringkas && m.menit));
});
const tipeBlok = ['p', 'h', 'list', 'table', 'callout', 'quote', 'steps', 'compare', 'example', 'kv'];
let blokAsing = [];
D.materi.forEach(m => m.blok.forEach(b => { if (tipeBlok.indexOf(b.t) === -1) blokAsing.push(m.id + ':' + b.t); }));
cek('semua tipe blok dikenal', blokAsing.length === 0, blokAsing.join(','));

console.log('\n== 2. Integritas contoh teks ==');
cek('5 contoh teks', D.contoh.length === 5, 'jumlah=' + D.contoh.length);
D.contoh.forEach(c => {
  cek(c.id + ': paragraf >= 3', c.teks.length >= 3, c.teks.length + ' paragraf');
  cek(c.id + ': referensi struktur valid', c.struktur.every(s => s.paragraf >= 0 && s.paragraf < c.teks.length));
  cek(c.id + ': ada identifikasi & penutup', c.struktur.some(s => s.label === 'Identifikasi') && c.struktur.some(s => s.label === 'Penutup'));
  cek(c.id + ': kaidah/glosarium/fakta lengkap',
    c.kaidah.length >= 3 && c.glosarium.length >= 3 && c.fakta.length >= 2);
  const kata = U.countWords(c.teks.join(' '));
  cek(c.id + ': panjang 120-260 kata', kata >= 120 && kata <= 260, kata + ' kata');
});

console.log('\n== 3. Integritas bank soal ==');
cek('>= 20 soal', D.kuis.length >= 20, D.kuis.length + ' soal');
const topikSah = ['Konsep Dasar', 'Struktur Teks', 'Kaidah Kebahasaan', 'Analisis Teks'];
const soalSet = new Set();
let soalBermasalah = 0;
D.kuis.forEach(q => {
  const ok = q.opsi.length === 4 && q.jawab >= 0 && q.jawab < 4 &&
    topikSah.indexOf(q.topik) !== -1 && q.bahasan && q.soal;
  if (!ok) { soalBermasalah++; console.log('    soal bermasalah: ' + q.id); }
  soalSet.add(q.soal);
});
cek('semua soal valid (4 opsi, kunci, topik, pembahasan)', soalBermasalah === 0);
cek('tidak ada soal kembar', soalSet.size === D.kuis.length, soalSet.size + '/' + D.kuis.length);
const sebaran = {};
D.kuis.forEach(q => { sebaran[q.topik] = (sebaran[q.topik] || 0) + 1; });
cek('setiap topik terwakili >= 3 soal', topikSah.every(t => (sebaran[t] || 0) >= 3), JSON.stringify(sebaran));
const kunci = { 0: 0, 1: 0, 2: 0, 3: 0 };
D.kuis.forEach(q => kunci[q.jawab]++);
cek('sebaran kunci jawaban tidak menumpuk', Object.values(kunci).every(v => v >= 2), JSON.stringify(kunci));

console.log('\n== 4. Integritas data permainan ==');
cek('3 paket susun', D.susun.length === 3);
D.susun.forEach(p => {
  cek('susun ' + p.id + ': mulai identifikasi, tutup penutup',
    p.paragraf[0].label === 'Identifikasi' && p.paragraf[p.paragraf.length - 1].label === 'Penutup',
    p.paragraf.map(x => x.label).join(' > '));
  cek('susun ' + p.id + ': minimal 3 paragraf', p.paragraf.length >= 3);
});
cek('8 soal tebak objek', D.tebak.length === 8);
D.tebak.forEach(t => {
  const unik = new Set(t.opsi);
  cek('tebak ' + t.id + ': jawaban ada di opsi & 4 pilihan unik',
    t.opsi.indexOf(t.jawab) !== -1 && unik.size === 4 && t.bahasan);
});
cek('3 level kata sifat', D.sifat.level.length === 3);
D.sifat.level.forEach(lv => {
  const sifat = lv.kata.filter(k => k.s).length;
  cek('level ' + lv.id + ': >= 5 kata sifat dan >= 3 pengecoh',
    sifat >= 5 && (lv.kata.length - sifat) >= 3, sifat + ' sifat dari ' + lv.kata.length + ' kata');
});
cek('tema tantangan 6 buah, tiap tema lengkap',
  D.tema.length === 6 && D.tema.every(t => t.targetKata >= 100 && t.indra.length === 5 && t.pemandu.length >= 5));
cek('refleksi 5 aspek dan 6 daftar periksa', D.refleksiAspek.length === 5 && D.refleksiChecklist.length === 6);

console.log('\n== 5. Logika level, XP, dan badge ==');
cek('level awal dari 0 XP', S.levelInfo(0).level === 1 && S.levelInfo(0).judul === 'Pemula Deskripsi');
cek('naik level di 150 XP', S.levelInfo(149).level === 1 && S.levelInfo(150).level === 2);
cek('level maksimum 6', S.levelInfo(5000).level === 6 && S.levelInfo(5000).persen === 100);
cek('sisa XP ke level berikutnya', S.levelInfo(100).sisaKeNext === 50, 'sisa=' + S.levelInfo(100).sisaKeNext);

S.addXp(200, 'uji');
cek('XP tersimpan setelah addXp', S.get().xp === 200 && S.levelInfo().level === 2);

S.catatKuis({ mode: 'Ujian Akhir', benar: 17, total: 20, skor: 85, nilai: 85, topik: { 'Struktur Teks': { benar: 5, total: 6 }, 'Kaidah Kebahasaan': { benar: 3, total: 8 } } });
cek('riwayat kuis tersimpan', S.get().kuis.riwayat.length === 1);
cek('skor kuis terbaik dihitung', S.skorKuisTerbaik() === 85);
const tl = S.topikTerlemah();
cek('topik terlemah terdeteksi', tl && tl.nama === 'Kaidah Kebahasaan' && tl.persen === 38, JSON.stringify(tl));
cek('badge juara kuis terbuka', S.badgeDimiliki('juara-kuis'));

S.catatGame('susun', 100);
S.catatGame('tebak', 88);
S.catatGame('sifat', 75);
cek('skor terbaik permainan tercatat', S.gameInfo('susun').terbaik === 100 && S.gameInfo('susun').main === 1);
cek('badge ahli struktur terbuka', S.badgeDimiliki('ahli-struktur'));
cek('badge penjelajah permainan terbuka', S.badgeDimiliki('penjelajah-game'));

D.materi.forEach(m => S.tandaiMateri(m.id));
D.contoh.forEach(c => S.tandaiContoh(c.id));
cek('badge pembaca & penjelajah teks terbuka', S.badgeDimiliki('pembaca') && S.badgeDimiliki('penjelajah-teks'));

S.simpanKarya({ id: 'k1', judul: 'Uji', temaId: 'w1', temaJudul: 'Ruang Kelasku', jenis: 'Tempat', teks: { identifikasi: 'a', bagian: 'b', penutup: 'c' }, skorAuto: 80, refleksi: 90, nilai: 83, rincian: [], tanggal: new Date().toISOString() });
cek('karya tersimpan & badge penulis', S.get().karya.length === 1 && S.badgeDimiliki('penulis'));
cek('rata-rata karya', S.rataKarya() === 83, 'rata=' + S.rataKarya());
S.hapusKarya('k1');
cek('karya terhapus', S.get().karya.length === 0);

const st = S.stats();
cek('ringkasan statistik konsisten', st.materi === 6 && st.contoh === 5 && st.kuisTerbaik === 85, JSON.stringify({ m: st.materi, c: st.contoh, k: st.kuisTerbaik, xp: st.xp }));

console.log('\n== 6. Mesin rubrik penilaian ==');
const tema = D.tema[0];
const contohBaik = {
  identifikasi: 'Kelas VII A adalah ruang belajar kami yang terletak di lantai dua sekolah. Ruangan itu berukuran sekitar delapan meter persegi dan bercat putih bersih.',
  bagian: 'Di dalam kelas, tiga puluh meja kayu tersusun rapi menghadap papan tulis hijau. Jendela besar di sisi timur membiarkan cahaya keemasan pagi masuk menerpa dinding. Ketika pelajaran dimulai, suara guru yang lembut bercampur gesekan kursi terdengar jelas. Aroma kapur tulis dan wangi bunga meja menyeruak, sedangkan permukaan meja terasa sejuk di telapak tangan. Suasananya nyaman, tenang, dan selalu membuatku betah belajar seperti berada di rumah sendiri.',
  penutup: 'Bagiku, kelas ini adalah tempat paling menyenangkan untuk menimba ilmu setiap hari.'
};
const rb = LS.rubrik.hitung(contohBaik, tema);
cek('tulisan baik mendapat skor otomatis tinggi', rb.total >= 85, 'total=' + rb.total);
cek('struktur lengkap diberi nilai penuh', rb.rincian[0].skor === 30, JSON.stringify(rb.rincian[0]));
cek('kata sifat terdeteksi >= 8', rb.sifat.length >= 8, rb.sifat.join(','));
cek('pancaindra terdeteksi >= 3', Object.keys(rb.indra).length >= 3, Object.keys(rb.indra).join(','));
cek('majas terdeteksi', rb.majas === true);
cek('kalimat perincian terdeteksi', rb.perincian === true);

const rbKosong = LS.rubrik.hitung({ identifikasi: '', bagian: '', penutup: '' }, tema);
cek('tulisan kosong bernilai 0', rbKosong.total === 0 && rbKosong.totalKata === 0);

const rbPendek = LS.rubrik.hitung({ identifikasi: 'Ada kelas.', bagian: 'Bagus.', penutup: 'Selesai.' }, tema);
cek('tulisan terlalu pendek bernilai rendah', rbPendek.total < 25, 'total=' + rbPendek.total);

cek('nilai akhir = 70% otomatis + 30% refleksi', LS.rubrik.nilaiAkhir(80, 100) === 86, 'hasil=' + LS.rubrik.nilaiAkhir(80, 100));
cek('refleksi 5 aspek bernilai 5 = 100', LS.rubrik.refleksiKePersen({ r1: 5, r2: 5, r3: 5, r4: 5, r5: 5 }) === 100);
cek('refleksi kosong = 0', LS.rubrik.refleksiKePersen({}) === 0);

cek('ejaan: "di tepi" benar', LS.rubrik.periksaEjaan({ identifikasi: 'Ia duduk di tepi pantai.', bagian: 'Airnya biru.', penutup: 'Indah sekali.' }).diBenar === true);
cek('ejaan: "ditepi" terdeteksi salah', LS.rubrik.periksaEjaan({ identifikasi: 'Ia duduk ditepi pantai.', bagian: 'Airnya biru.', penutup: 'Indah sekali.' }).diBenar === false);
cek('ejaan: huruf kapital awal terdeteksi', LS.rubrik.periksaEjaan({ identifikasi: 'kelas itu bersih.', bagian: 'x', penutup: 'y' }).kapital === false);

console.log('\n== 7. Persistensi localStorage ==');
S.simpan();
const mentah = mem['linguasmart.v1'];
cek('data tersimpan sebagai JSON', typeof mentah === 'string' && JSON.parse(mentah).xp === S.get().xp);
const salinan = JSON.parse(mentah);
S.reset();
cek('reset mengosongkan progres', S.get().xp === 0 && S.get().karya.length === 0 && S.get().badge.length === 0);
cek('importData memulihkan cadangan', S.importData(salinan) === true && S.get().xp === salinan.xp);

console.log('\n================ RINGKASAN ================');
if (gagal.length) {
  console.log('GAGAL ' + gagal.length + ' pemeriksaan:');
  gagal.forEach(g => console.log(' - ' + g));
  process.exit(1);
} else {
  console.log('Semua pemeriksaan LULUS.');
}
