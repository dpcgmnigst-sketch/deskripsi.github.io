/* Pemeriksaan statis LinguaSmart:
   - kelengkapan fungsi view yang dipanggil router
   - keberadaan setiap method store/util/data yang dipanggil
   - keberadaan id, kelas CSS, dan atribut data-* yang dipakai selector
   - kesahihan setiap tautan "#/rute" pada konten dan kode              */
const fs = require('fs');
const path = require('path');

const APP = path.join(__dirname, '..');
const JS = path.join(APP, 'js');

/* --- stub peramban minimal agar berkas dapat dimuat di Node --- */
const mem = {};
global.window = {
  localStorage: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } },
  addEventListener() {}, matchMedia: () => ({ matches: false }), location: { hash: '' }, scrollTo() {}, print() {}
};
global.document = {
  getElementById: () => null,
  createElement: () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} }, addEventListener() {}, appendChild() {}, setAttribute() {}, querySelector: () => null, querySelectorAll: () => [] }),
  addEventListener() {}, documentElement: { setAttribute() {}, getAttribute: () => 'light' }, querySelectorAll: () => [], body: { appendChild() {}, removeChild() {} }
};
global.LS = {};
global.window.LS = global.LS;

const gagal = [];
let jumlahCek = 0;
function cek(nama, syarat, info) {
  jumlahCek++;
  if (!syarat) gagal.push(nama + (info ? ' → ' + info : ''));
}

const berkasJs = fs.readdirSync(JS).filter(f => f.endsWith('.js')).sort();
const berkasView = berkasJs.filter(f => f.indexOf('views-') === 0);

/* urutan pemuatan: store -> data -> views */
['store.js', 'data.js'].concat(berkasView).forEach(f => {
  const kode = fs.readFileSync(path.join(JS, f), 'utf8');
  try { eval(kode); } catch (e) { gagal.push('GAGAL memuat ' + f + ': ' + e.message); }
});

const U = LS.util, S = LS.store, D = LS.data;

/* ---------------------------------------------------------- 1. fungsi view */
const VIEW_WAJIB = ['beranda', 'materiDaftar', 'materiDetail', 'contohDaftar', 'contohDetail',
  'permainanDaftar', 'permainanSusun', 'permainanTebak', 'permainanSifat', 'kuis',
  'tantangan', 'karyaDaftar', 'karyaDetail', 'evaluasi'];
VIEW_WAJIB.forEach(v => cek('LS.views.' + v + ' tersedia', typeof LS.views[v] === 'function'));

/* ------------------------------------------------- 2. rute pada index.html */
const htmlIndex = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
const RUTE = ['beranda', 'materi', 'contoh', 'permainan', 'kuis', 'tantangan', 'karya', 'evaluasi'];
const idGlobal = new Set([...htmlIndex.matchAll(/id="([A-Za-z0-9_-]+)"/g)].map(m => m[1]));
cek('index.html memuat semua berkas js', berkasJs.every(f => htmlIndex.indexOf('js/' + f) !== -1),
  berkasJs.filter(f => htmlIndex.indexOf('js/' + f) === -1).join(','));

/* ------------------------------------ 3. selector CSS & kelas dari stylesheet */
const css = fs.readFileSync(path.join(APP, 'css', 'style.css'), 'utf8');
const kelasCss = new Set([...css.matchAll(/\.([A-Za-z][A-Za-z0-9_-]*)/g)].map(m => m[1]));

function kelasDariKode(src) {
  const set = new Set();
  [...src.matchAll(/class="([^"]*)"/g)].forEach(m => m[1].split(/\s+/).forEach(k => k && set.add(k)));
  [...src.matchAll(/classList\.(?:add|remove|toggle|contains)\(\s*'([A-Za-z0-9_-]+)'/g)].forEach(m => set.add(m[1]));
  return set;
}
const kelasKode = new Set();
berkasJs.forEach(f => kelasDariKode(fs.readFileSync(path.join(JS, f), 'utf8')).forEach(k => kelasKode.add(k)));
kelasDariKode(htmlIndex).forEach(k => kelasKode.add(k));

/* ------------------------------------------- 4. periksa setiap berkas sumber */
const laporan = [];
berkasJs.forEach(f => {
  const src = fs.readFileSync(path.join(JS, f), 'utf8');
  const tag = f.replace('.js', '');

  /* method store */
  new Set([...src.matchAll(/\bS\.([A-Za-z_][A-Za-z0-9_]*)/g)].map(m => m[1])).forEach(n => {
    const ada = (n in S) || ['XP', 'BADGES', 'LEVELS', 'keys', 'util'].indexOf(n) !== -1;
    cek(tag + ': S.' + n + ' ada', ada);
  });
  new Set([...src.matchAll(/\bS\.XP\.([A-Za-z_][A-Za-z0-9_]*)/g)].map(m => m[1])).forEach(n => {
    cek(tag + ': S.XP.' + n + ' ada', n in S.XP);
  });

  /* util */
  new Set([...src.matchAll(/\bU\.([A-Za-z_][A-Za-z0-9_]*)/g)].map(m => m[1])).forEach(n => {
    cek(tag + ': U.' + n + ' ada', typeof U[n] === 'function');
  });

  /* data */
  new Set([...src.matchAll(/\bD\.([A-Za-z_][A-Za-z0-9_]*)/g)].map(m => m[1])).forEach(n => {
    cek(tag + ': D.' + n + ' ada', n in D);
  });

  /* LS.ui & LS.rubrik */
  new Set([...src.matchAll(/LS\.ui\.([A-Za-z_][A-Za-z0-9_]*)/g)].map(m => m[1])).forEach(n => {
    cek(tag + ': LS.ui.' + n + ' ada', typeof LS.ui[n] === 'function');
  });
  new Set([...src.matchAll(/LS\.rubrik\.([A-Za-z_][A-Za-z0-9_]*)/g)].map(m => m[1])).forEach(n => {
    cek(tag + ': LS.rubrik.' + n + ' ada', typeof (LS.rubrik || {})[n] === 'function');
  });

  /* id yang dirujuk selector */
  const idDibuat = new Set([...src.matchAll(/id="([A-Za-z0-9_-]+)"/g)].map(m => m[1]));
  const idDirujuk = new Set([
    ...[...src.matchAll(/getElementById\(\s*'([^']+)'\s*\)/g)].map(m => m[1]),
    ...[...src.matchAll(/querySelector(?:All)?\(\s*'#([A-Za-z0-9_-]+)/g)].map(m => m[1]),
    ...[...src.matchAll(/'#([A-Za-z0-9_-]+)'/g)].map(m => m[1])
  ]);
  idDirujuk.forEach(id => {
    cek(tag + ': id "#' + id + '" ada di dokumen', idDibuat.has(id) || idGlobal.has(id));
  });

  /* kelas yang dirujuk selector */
  const kelasDirujuk = new Set([
    ...[...src.matchAll(/querySelector(?:All)?\(\s*'?\.([A-Za-z0-9_-]+)/g)].map(m => m[1]),
    ...[...src.matchAll(/closest\(\s*'\.([A-Za-z0-9_-]+)/g)].map(m => m[1])
  ]);
  kelasDirujuk.forEach(k => {
    cek(tag + ': kelas ".' + k + '" dikenal', kelasCss.has(k) || kelasKode.has(k));
  });

  /* atribut data-* yang dirujuk selector */
  new Set([...src.matchAll(/querySelector(?:All)?\(\s*'\[data-([a-z-]+)\]/g)].map(m => m[1])).forEach(a => {
    cek(tag + ': atribut "data-' + a + '" dipasang di kode',
      new RegExp('data-' + a + '=').test(src) || new RegExp('data-' + a + '=').test(htmlIndex));
  });

  /* rute tautan */
  new Set([...src.matchAll(/#\/([a-z-]+)/g)].map(m => m[1])).forEach(r => {
    cek(tag + ': rute "#' + '/' + r + '" dikenal', RUTE.indexOf(r) !== -1);
  });

  laporan.push(tag + ': ' + src.split('\n').length + ' baris');
});

/* --------------------------------------- 5. rute pada index.html juga sahih */
new Set([...htmlIndex.matchAll(/#\/([a-z-]+)/g)].map(m => m[1])).forEach(r => {
  cek('index.html: rute "#' + '/' + r + '" dikenal', RUTE.indexOf(r) !== -1);
});

/* ----------------------------------------------------- 6. XML/HTML seimbang */
const pasangan = [['<section', '</section>'], ['<div', '</div>'], ['<table', '</table>']];
const jsGabung = berkasJs.map(f => fs.readFileSync(path.join(JS, f), 'utf8')).join('\n');
pasangan.forEach(([buka, tutup]) => {
  const jb = (jsGabung.match(new RegExp(buka.replace('<', '<'), 'g')) || []).length;
  const jt = (jsGabung.match(new RegExp(tutup, 'g')) || []).length;
  cek('jumlah ' + buka + ' seimbang dengan ' + tutup, jb === jt, jb + ' vs ' + jt);
});

/* --------------------------------------------------------------- ringkasan */
console.log('Pemeriksaan statis LinguaSmart');
console.log(laporan.join('\n'));
console.log('\nTotal pemeriksaan: ' + jumlahCek);
if (gagal.length) {
  console.log('GAGAL ' + gagal.length + ' butir:');
  gagal.forEach(g => console.log(' - ' + g));
  process.exit(1);
}
console.log('Semua pemeriksaan statis LULUS.');
