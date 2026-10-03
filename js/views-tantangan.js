/* ==========================================================================
   LinguaSmart — views-tantangan.js
   Tantangan menulis teks deskripsi + rubrik penilaian otomatis,
   refleksi diri, penyimpanan karya, daftar karya, dan cetak laporan.
   ========================================================================== */
(function () {
  'use strict';

  var U = LS.util, S = LS.store, D = LS.data;

  /* ------------------------------------------------------- mesin penilaian */

  var LEK = D.leksikon;

  function cari(kata, daftar) {
    var n = U.norm(kata);
    if (!n) return false;
    return daftar.some(function (d) { return d === n; });
  }

  function hitungKataSifat(teks) {
    var w = U.words(teks), ditemukan = [];
    w.forEach(function (k) {
      if (LEK.sifat.indexOf(k) !== -1 && ditemukan.indexOf(k) === -1) ditemukan.push(k);
    });
    return ditemukan;
  }

  function hitungIndra(teks) {
    var w = U.words(teks), hasil = {};
    Object.keys(LEK.indra).forEach(function (indra) {
      var ada = w.some(function (k) { return LEK.indra[indra].indexOf(k) !== -1; });
      if (ada) hasil[indra] = true;
    });
    return hasil;
  }

  function adaMajas(teks) {
    var w = U.words(teks);
    return w.some(function (k) { return LEK.majas.indexOf(k) !== -1; });
  }

  function adaPerincian(teks) {
    if (/\d/.test(teks)) return true;
    var w = U.words(teks);
    return w.some(function (k) { return LEK.perincian.indexOf(k) !== -1; });
  }

  function periksaEjaan(teks) {
    var bagian = [teks.identifikasi, teks.bagian, teks.penutup].filter(function (t) { return U.norm(t); });
    if (!bagian.length) return { kapital: false, tanda: false, diBenar: true };
    var kapital = bagian.every(function (t) { return /^[^a-z]/.test(t.replace(/^\s+/, '')) || /^["'“]?[A-Z]/.test(t.replace(/^\s+/, '')); });
    var tanda = bagian.every(function (t) { return /[.!?"'”]\s*$/.test(t.replace(/\s+$/, '')); });
    var gabung = bagian.join(' ');
    var diSalah = /\bdi(tepi|sekolah|rumah|pantai|pasar|jalan|kota|desa|kampung|atas|bawah|dalam|luar|depan|belakang|sana|sini|situ|halaman|kantin|kelas)\b/i.test(gabung);
    return { kapital: kapital, tanda: tanda, diBenar: !diSalah };
  }

  /**
   * Menghitung rubrik otomatis (skor maksimal 100).
   * @param {{identifikasi:string, bagian:string, penutup:string}} teks
   * @param {object} tema
   */
  function hitungRubrik(teks, tema) {
    var gabung = [teks.identifikasi, teks.bagian, teks.penutup].join('\n');
    var totalKata = U.countWords(gabung);
    var kIdent = U.countWords(teks.identifikasi);
    var kBagian = U.countWords(teks.bagian);
    var kPenutup = U.countWords(teks.penutup);

    /* 1. kelengkapan struktur — 30 */
    function porsi(n, target) { return Math.max(0, Math.min(1, n / target)); }
    var struktur = porsi(kIdent, 15) * 10 + porsi(kBagian, 45) * 10 + porsi(kPenutup, 12) * 10;

    /* 2. kuantitas kata — 20 */
    var kuantitas = porsi(totalKata, tema.targetKata) * 20;

    /* 3. kekayaan kata sifat — 20 (maksimal pada 8 kata sifat berbeda) */
    var sifat = hitungKataSifat(gabung);
    var kekayaan = porsi(sifat.length, 8) * 20;

    /* 4. pancaindra — 15 */
    var indra = hitungIndra(gabung);
    var jmlIndra = Object.keys(indra).length;
    var skorIndra = jmlIndra >= 3 ? 15 : (jmlIndra === 2 ? 10 : (jmlIndra === 1 ? 5 : 0));

    /* 5. gaya bahasa & kerapian — 15 */
    var majas = adaMajas(gabung);
    var perincian = adaPerincian(gabung);
    var ejaan = periksaEjaan(teks);
    var gaya = (majas ? 7 : 0) + (perincian ? 4 : 0) +
      ((ejaan.kapital ? 2 : 0) + (ejaan.tanda && ejaan.diBenar ? 2 : 0));

    var rincian = [
      { nama: 'Kelengkapan struktur', skor: Math.round(struktur), maks: 30,
        catatan: 'Identifikasi ' + kIdent + ' kata (min. 15) · deskripsi bagian ' + kBagian + ' kata (min. 45) · penutup ' + kPenutup + ' kata (min. 12).' },
      { nama: 'Kuantitas tulisan', skor: Math.round(kuantitas), maks: 20,
        catatan: totalKata + ' kata dari target ' + tema.targetKata + ' kata.' },
      { nama: 'Kekayaan kata sifat', skor: Math.round(kekayaan), maks: 20,
        catatan: sifat.length + ' kata sifat berbeda ditemukan' + (sifat.length ? ': ' + sifat.slice(0, 12).join(', ') : '.') },
      { nama: 'Penggunaan pancaindra', skor: skorIndra, maks: 15,
        catatan: jmlIndra + ' dari 5 indra terdeteksi' + (jmlIndra ? ' (' + Object.keys(indra).join(', ') + ').' : '.') },
      { nama: 'Gaya bahasa & kerapian', skor: Math.round(gaya), maks: 15,
        catatan: (majas ? 'majas ✔' : 'majas ✘') + ' · ' + (perincian ? 'kalimat perincian ✔' : 'kalimat perincian ✘') +
          ' · ' + (ejaan.kapital ? 'huruf kapital ✔' : 'huruf kapital ✘') +
          ' · ' + (ejaan.tanda ? 'tanda baca ✔' : 'tanda baca ✘') +
          ' · ' + (ejaan.diBenar ? 'penulisan "di" ✔' : 'penulisan "di" ✘') }
    ];

    var total = Math.max(0, Math.min(100, Math.round(
      rincian.reduce(function (a, r) { return a + r.skor; }, 0)
    )));

    return {
      total: total, rincian: rincian, totalKata: totalKata,
      sifat: sifat, indra: indra, majas: majas, perincian: perincian, ejaan: ejaan
    };
  }

  function nilaiAkhir(skorAuto, refleksi) {
    if (!refleksi) return skorAuto;
    return Math.round(skorAuto * 0.7 + refleksi * 0.3);
  }

  function refleksiKePersen(nilai) {
    var t = 0, n = 0;
    Object.keys(nilai).forEach(function (k) { t += nilai[k]; n++; });
    if (!n) return 0;
    return Math.round((t / (n * 5)) * 100);
  }

  /* ====================================================== FORM TANTANGAN */

  LS.views.tantangan = function (root) {
    var draf = S.get().draf || {};
    var temaAktif = null;
    D.tema.forEach(function (t) { if (t.id === draf.temaId) temaAktif = t; });
    if (!temaAktif) temaAktif = D.tema[0];

    var refleksi = draf.refleksi || { r1: 0, r2: 0, r3: 0, r4: 0, r5: 0 };
    var checklist = draf.checklist || {};

    root.innerHTML = '<div class="no-print">' +
      LS.ui.head('Tantangan', 'Tantangan Menulis Teks Deskripsi',
      'Pilih tema, tulis teksmu, lalu nilai sendiri dengan rubrik otomatis. Simpan karyamu bila sudah selesai dan cetak laporannya bila perlu.') +
      '<section class="card">' +
      '<div class="toolbar"><span class="muted">Pilih tema:</span>' +
      D.tema.map(function (t) {
        return '<button class="btn btn-sm filter-btn' + (t.id === temaAktif.id ? ' active' : '') + '" data-tema="' + t.id + '" type="button">' +
          t.ico + ' ' + U.esc(t.judul) + '</button>';
      }).join('') +
      '</div>' +
      '<div id="infoTema"></div>' +
      '</section>' +

      '<section class="writer-grid">' +
      '<div>' +
      '<div class="card">' +
      '<label class="field"><span>Judul teksmu</span>' +
      '<input type="text" id="inJudul" maxlength="80" placeholder="' + U.esc(temaAktif.contohJudul) + '" value="' + U.esc(draf.judul || '') + '"></label>' +

      '<label class="field"><span>1. Identifikasi — nama objek, lokasi, gambaran umum</span>' +
      '<textarea id="inIdent" rows="4" placeholder="Contoh: Pantai Kuta adalah salah satu pantai terkenal di Bali. Pantai ini terletak di ...">' + U.esc(draf.identifikasi || '') + '</textarea></label>' +

      '<label class="field"><span>2. Deskripsi bagian — rincian bentuk, warna, ukuran, suasana</span>' +
      '<textarea id="inBagian" rows="8" placeholder="Rinci objek dengan pancaindra: apa yang terlihat, terdengar, tercium, terasa ...">' + U.esc(draf.bagian || '') + '</textarea></label>' +

      '<label class="field"><span>3. Penutup — kesan atau perasaanmu terhadap objek</span>' +
      '<textarea id="inPenutup" rows="3" placeholder="Contoh: Sungguh, tempat itu selalu membuat hatiku tenang.">' + U.esc(draf.penutup || '') + '</textarea></label>' +

      '<div class="btn-row">' +
      '<button class="btn btn-primary" id="btnSimpan" type="button">💾 Simpan karya</button>' +
      '<button class="btn" id="btnCetak" type="button">🖨️ Cetak laporan</button>' +
      '<button class="btn btn-danger" id="btnReset" type="button">Kosongkan</button>' +
      '<a class="btn" href="#/karya">📚 Karyaku</a>' +
      '</div>' +
      '<p class="muted" style="font-size:.82rem;margin-top:.6rem">Draf tersimpan otomatis di peramban ini. Menyimpan karya pertama memberi +' + S.XP.karyaSimpan + ' XP.</p>' +
      '</div>' +

      '<div class="card">' +
      '<div class="sec-title"><span class="ico">🧭</span>Pertanyaan pemandu</div>' +
      '<ul class="prompt-list" id="pemandu"></ul>' +
      '</div>' +
      '</div>' +

      '<div>' +
      '<div class="card" id="panelSkor">' +
      '<div class="sec-title"><span class="ico">📊</span>Penilaian otomatis</div>' +
      '<div class="score-ring">' +
      '<div class="gauge" id="gauge" style="--pct:0"><span id="gaugeNum">0</span></div>' +
      '<div><div style="font-weight:700" id="predikat">Belum ada tulisan</div>' +
      '<div class="muted" style="font-size:.85rem" id="ringkasSkor">Mulai menulis untuk melihat penilaian.</div></div>' +
      '</div>' +
      '<div id="rubrik" style="margin-top:1rem"></div>' +
      '</div>' +

      '<div class="card">' +
      '<div class="sec-title"><span class="ico">✅</span>Pemeriksaan mandiri</div>' +
      '<ul class="check-list" id="cekOtomatis"></ul>' +
      '</div>' +

      '<div class="card">' +
      '<div class="sec-title"><span class="ico">⭐</span>Refleksi diri (bobot 30%)</div>' +
      '<div id="bintangBox"></div>' +
      '<div class="sec-title" style="margin-top:1rem"><span class="ico">☑️</span>Daftar periksa</div>' +
      '<div id="checklistBox"></div>' +
      '</div>' +
      '</div>' +
      '</section>' +

      '</div>' +
      '<section class="card print-only" id="areaCetak"></section>';

    var elJudul = root.querySelector('#inJudul');
    var elIdent = root.querySelector('#inIdent');
    var elBagian = root.querySelector('#inBagian');
    var elPenutup = root.querySelector('#inPenutup');
    var gauge = root.querySelector('#gauge');
    var gaugeNum = root.querySelector('#gaugeNum');
    var rubrikBox = root.querySelector('#rubrik');
    var cekBox = root.querySelector('#cekOtomatis');
    var bintangBox = root.querySelector('#bintangBox');
    var checklistBox = root.querySelector('#checklistBox');
    var infoTema = root.querySelector('#infoTema');
    var panelSkor = root.querySelector('#panelSkor');
    var areaCetak = root.querySelector('#areaCetak');

    function teks() {
      return { identifikasi: elIdent.value, bagian: elBagian.value, penutup: elPenutup.value };
    }

    function gambarTema() {
      infoTema.innerHTML = '<div class="compare" style="margin-top:.2rem">' +
        '<div><h4>' + temaAktif.ico + ' ' + U.esc(temaAktif.judul) + '</h4>' +
        '<p style="margin:0 0 .4rem">' + U.esc(temaAktif.petunjuk) + '</p>' +
        '<p class="muted" style="font-size:.85rem;margin:0">Jenis: ' + U.esc(temaAktif.jenis) +
        ' · target minimal ' + temaAktif.targetKata + ' kata · contoh judul: <em>' + U.esc(temaAktif.contohJudul) + '</em></p></div>' +
        '<div><h4>Rangsangan pancaindra</h4><ul style="margin:0;padding-left:1.1rem">' +
        temaAktif.indra.map(function (i) {
          return '<li>' + i.ico + ' <strong>' + U.esc(i.nama) + '</strong> — ' + U.esc(i.contoh) + '</li>';
        }).join('') + '</ul></div></div>';
      root.querySelector('#pemandu').innerHTML = temaAktif.pemandu.map(function (p) {
        return '<li>' + U.esc(p) + '</li>';
      }).join('');
      elJudul.placeholder = temaAktif.contohJudul;
    }

    function gambarBintang() {
      bintangBox.innerHTML = D.refleksiAspek.map(function (a) {
        var nilai = refleksi[a.id] || 0;
        return '<div class="rubric-row"><div><div style="font-size:.9rem">' + U.esc(a.teks) + '</div>' +
          '<div class="stars" data-aspek="' + a.id + '">' +
          [1, 2, 3, 4, 5].map(function (n) {
            return '<button type="button" class="' + (n <= nilai ? 'on' : '') + '" data-nilai="' + n + '" aria-label="' + n + ' dari 5">★</button>';
          }).join('') + '</div></div>' +
          '<div class="val">' + (nilai ? nilai + '/5' : '—') + '</div></div>';
      }).join('');

      bintangBox.querySelectorAll('.stars').forEach(function (grup) {
        grup.querySelectorAll('button').forEach(function (b) {
          b.addEventListener('click', function () {
            refleksi[grup.getAttribute('data-aspek')] = parseInt(b.getAttribute('data-nilai'), 10);
            simpanDraf();
            gambarBintang();
            perbarui();
          });
        });
      });
    }

    function gambarChecklist() {
      checklistBox.innerHTML = D.refleksiChecklist.map(function (t, i) {
        var id = 'c' + i;
        return '<label class="field" style="display:flex;gap:.5rem;align-items:flex-start;margin-bottom:.3rem">' +
          '<input type="checkbox" data-cek="' + id + '"' + (checklist[id] ? ' checked' : '') + ' style="width:auto;margin-top:.3rem">' +
          '<span style="font-weight:400;font-size:.9rem">' + U.esc(t) + '</span></label>';
      }).join('');
      checklistBox.querySelectorAll('[data-cek]').forEach(function (cb) {
        cb.addEventListener('change', function () {
          checklist[cb.getAttribute('data-cek')] = cb.checked;
          simpanDraf();
        });
      });
    }

    function simpanDraf() {
      S.get().draf = {
        judul: elJudul.value, identifikasi: elIdent.value, bagian: elBagian.value,
        penutup: elPenutup.value, temaId: temaAktif.id, refleksi: refleksi, checklist: checklist,
        karyaId: draf.karyaId || null
      };
      S.simpan();
    }

    function perbarui() {
      var t = teks();
      var rb = hitungRubrik(t, temaAktif);
      var refPersen = refleksiKePersen(refleksi);
      var nilai = nilaiAkhir(rb.total, refPersen);
      var p = LS.ui.predikat(nilai);

      gauge.style.setProperty('--pct', rb.total);
      gaugeNum.textContent = rb.total;
      root.querySelector('#predikat').innerHTML = (rb.totalKata ? p.ico + ' ' + U.esc(p.t) : 'Belum ada tulisan');
      root.querySelector('#ringkasSkor').innerHTML = rb.totalKata
        ? (rb.totalKata + ' kata · skor otomatis ' + rb.total + '/100 · refleksi ' + refPersen + '/100 · <strong>nilai akhir ' + nilai + '</strong>')
        : 'Mulai menulis untuk melihat penilaian.';

      rubrikBox.innerHTML = rb.rincian.map(function (r) {
        var persen = Math.round((r.skor / r.maks) * 100);
        return '<div class="rubric-row"><div><div style="font-size:.88rem">' + U.esc(r.nama) + '</div>' +
          '<div class="bar"><span style="width:' + persen + '%"></span></div>' +
          '<div class="muted" style="font-size:.78rem">' + U.esc(r.catatan) + '</div></div>' +
          '<div class="val">' + r.skor + '/' + r.maks + '</div></div>';
      }).join('');

      var cek = [
        { ok: U.countWords(t.identifikasi) >= 15, t: 'Identifikasi memuat minimal 15 kata (nama, lokasi, gambaran umum).' },
        { ok: U.countWords(t.bagian) >= 45, t: 'Deskripsi bagian memuat minimal 45 kata perincian.' },
        { ok: U.countWords(t.penutup) >= 12, t: 'Penutup memuat kesan atau perasaanmu.' },
        { ok: rb.totalKata >= temaAktif.targetKata, t: 'Panjang tulisan mencapai target ' + temaAktif.targetKata + ' kata.' },
        { ok: rb.sifat.length >= 8, t: 'Memakai minimal 8 kata sifat berbeda.' },
        { ok: Object.keys(rb.indra).length >= 3, t: 'Melibatkan minimal 3 pancaindra.' },
        { ok: rb.majas, t: 'Menggunakan majas atau perumpamaan.' },
        { ok: rb.perincian, t: 'Ada kalimat perincian (angka, ukuran, atau jumlah).' },
        { ok: rb.ejaan.kapital, t: 'Setiap paragraf dimulai dengan huruf kapital.' },
        { ok: rb.ejaan.tanda && rb.ejaan.diBenar, t: 'Tanda baca akhir kalimat dan penulisan "di" sudah benar.' }
      ];
      cekBox.innerHTML = cek.map(function (c) {
        return '<li><span class="mark ' + (c.ok ? 'ok' : 'no') + '">' + (c.ok ? '✔' : '○') + '</span><span>' + U.esc(c.t) + '</span></li>';
      }).join('');
    }

    function hasilSekarang() {
      var t = teks();
      var rb = hitungRubrik(t, temaAktif);
      var refPersen = refleksiKePersen(refleksi);
      return {
        teks: t, rubrik: rb, refleksi: refPersen,
        nilai: nilaiAkhir(rb.total, refPersen)
      };
    }

    /* ---------------- aksi ---------------- */
    var waktu = null;
    function onInput() {
      clearTimeout(waktu);
      waktu = setTimeout(function () { simpanDraf(); perbarui(); }, 250);
    }
    [elJudul, elIdent, elBagian, elPenutup].forEach(function (el) { el.addEventListener('input', onInput); });

    root.querySelectorAll('[data-tema]').forEach(function (b) {
      b.addEventListener('click', function () {
        D.tema.forEach(function (t) { if (t.id === b.getAttribute('data-tema')) temaAktif = t; });
        root.querySelectorAll('[data-tema]').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        draf.temaId = temaAktif.id;
        simpanDraf();
        gambarTema();
        perbarui();
      });
    });

    root.querySelector('#btnSimpan').addEventListener('click', function () {
      var h = hasilSekarang();
      var judul = elJudul.value.trim() || temaAktif.contohJudul;
      if (h.rubrik.totalKata < 30) {
        S.toast('Tulisan terlalu pendek', 'Tulis minimal 30 kata sebelum menyimpan karya.', 'err');
        return;
      }
      var idLama = draf.karyaId;
      var karyaLama = idLama ? S.karyaById(idLama) : null;
      var karya = {
        id: idLama || U.uid(),
        judul: judul, temaId: temaAktif.id, temaJudul: temaAktif.judul, jenis: temaAktif.jenis,
        teks: h.teks, skorAuto: h.rubrik.total, refleksi: h.refleksi, nilai: h.nilai,
        rincian: h.rubrik.rincian, sifat: h.rubrik.sifat, indra: Object.keys(h.rubrik.indra),
        checklist: checklist,
        siswa: { nama: S.get().siswa.nama, kelas: S.get().siswa.kelas },
        tanggal: new Date().toISOString()
      };
      S.simpanKarya(karya);
      draf.karyaId = karya.id;
      simpanDraf();

      if (karyaLama) {
        S.toast('Karya diperbarui', judul + ' · nilai akhir ' + karya.nilai, 'ok');
      } else {
        S.addXp(S.XP.karyaSimpan, 'Menyimpan karya: ' + judul);
        S.addLog('✍️', 'Menulis karya "' + judul + '" dengan nilai ' + karya.nilai);
      }
      if (h.refleksi > 0 && (!karyaLama || !karyaLama.refleksi)) S.addXp(S.XP.refleksi, 'Mengisi refleksi diri');
      S.toast('Karya tersimpan', 'Buka menu Karyaku untuk melihat dan mencetak.', 'ok');
      areaCetak.innerHTML = laporanKarya(karya);
    });

    root.querySelector('#btnCetak').addEventListener('click', function () {
      var h = hasilSekarang();
      areaCetak.innerHTML = laporanKarya({
        judul: elJudul.value.trim() || temaAktif.contohJudul,
        temaJudul: temaAktif.judul, jenis: temaAktif.jenis, teks: h.teks,
        skorAuto: h.rubrik.total, refleksi: h.refleksi, nilai: h.nilai,
        rincian: h.rubrik.rincian, tanggal: new Date().toISOString(),
        siswa: { nama: S.get().siswa.nama, kelas: S.get().siswa.kelas }
      });
      window.print();
    });

    root.querySelector('#btnReset').addEventListener('click', function () {
      LS.modal.open({
        title: 'Kosongkan tulisan?',
        html: '<p>Seluruh isi kotak tulisan dan draf yang tersimpan akan dihapus. Karya yang sudah disimpan di menu Karyaku tetap aman.</p>',
        buttons: [
          { label: 'Batal', cls: '' },
          { label: 'Ya, kosongkan', cls: 'btn-danger', onClick: function () {
            elJudul.value = ''; elIdent.value = ''; elBagian.value = ''; elPenutup.value = '';
            refleksi = { r1: 0, r2: 0, r3: 0, r4: 0, r5: 0 };
            checklist = {};
            draf = {};
            S.get().draf = null;
            S.simpan();
            gambarBintang(); gambarChecklist(); perbarui();
            S.toast('Dikosongkan', 'Kamu bisa mulai menulis tema baru.', 'ok');
          } }
        ]
      });
    });

    gambarTema();
    gambarBintang();
    gambarChecklist();
    perbarui();
  };

  /* ========================================================= LAPORAN CETAK */

  function laporanKarya(k) {
    var p = LS.ui.predikat(k.nilai);
    return '<h2 style="text-align:center">LAPORAN HASIL TANTANGAN MENULIS</h2>' +
      '<p style="text-align:center;margin-top:-.5rem"><strong>LinguaSmart — Teks Deskripsi (Kelas VII)</strong></p>' +
      '<div class="tablewrap"><table class="tbl"><tbody>' +
      '<tr><th>Nama</th><td>' + U.esc((k.siswa && k.siswa.nama) || '................................') + '</td>' +
      '<th>Kelas</th><td>' + U.esc((k.siswa && k.siswa.kelas) || '................') + '</td></tr>' +
      '<tr><th>Tanggal</th><td>' + U.fmtTanggal(k.tanggal) + '</td>' +
      '<th>Tema</th><td>' + U.esc(k.temaJudul || '-') + ' (' + U.esc(k.jenis || '-') + ')</td></tr>' +
      '<tr><th>Skor otomatis</th><td>' + k.skorAuto + '/100</td>' +
      '<th>Refleksi diri</th><td>' + k.refleksi + '/100</td></tr>' +
      '<tr><th>Nilai akhir</th><td colspan="3"><strong>' + k.nilai + ' — ' + U.esc(p.t) + '</strong></td></tr>' +
      '</tbody></table></div>' +
      '<h3>Karya: ' + U.esc(k.judul) + '</h3>' +
      '<div class="teks-box"><p>' + U.esc(k.teks.identifikasi) + '</p>' +
      '<p>' + U.esc(k.teks.bagian) + '</p>' +
      '<p>' + U.esc(k.teks.penutup) + '</p></div>' +
      '<h3>Rincian penilaian rubrik</h3>' +
      '<div class="tablewrap"><table class="tbl"><thead><tr><th>Aspek</th><th>Skor</th><th>Keterangan</th></tr></thead><tbody>' +
      (k.rincian || []).map(function (r) {
        return '<tr><td>' + U.esc(r.nama) + '</td><td>' + r.skor + '/' + r.maks + '</td><td>' + U.esc(r.catatan) + '</td></tr>';
      }).join('') +
      '</tbody></table></div>' +
      '<p style="margin-top:1.5rem">Catatan guru: ................................................................................................</p>' +
      '<p>Paraf guru: ............................&nbsp;&nbsp;&nbsp;&nbsp;Paraf orang tua: ............................</p>';
  }

  /* ========================================================== DAFTAR KARYA */

  LS.views.karyaDaftar = function (root) {
    var karya = S.get().karya;

    root.innerHTML = LS.ui.head('Karyaku', 'Kumpulan Teks Deskripsimu', 'Semua karya yang kamu simpan tersimpan di peramban ini. Kamu dapat membukanya kembali, memperbarui, atau mencetaknya.') +
      '<section class="card">' +
      '<div class="toolbar">' +
      '<span class="chip">' + karya.length + ' karya tersimpan</span>' +
      (karya.length ? '<span class="chip ok">Rata-rata nilai: ' + S.rataKarya() + '</span>' : '') +
      '<span class="spacer"></span>' +
      '<a class="btn btn-primary btn-sm" href="#/tantangan">+ Tulis karya baru</a>' +
      '</div>' +
      (karya.length
        ? karya.map(function (k) {
            var p = LS.ui.predikat(k.nilai);
            return '<div class="card" style="box-shadow:none">' +
              '<div class="karya-item">' +
              '<div><h4>' + U.esc(k.judul) + '</h4>' +
              '<div class="meta">' + U.esc(k.temaJudul) + ' · ' + U.esc(k.jenis) + ' · ' + U.fmtTanggal(k.tanggal) +
              ' · ' + U.countWords([k.teks.identifikasi, k.teks.bagian, k.teks.penutup].join(' ')) + ' kata</div></div>' +
              '<div style="text-align:right"><div class="chip ' + (k.nilai >= 80 ? 'ok' : 'accent') + '">' + p.ico + ' Nilai ' + k.nilai + '</div>' +
              '<div class="muted" style="font-size:.78rem;margin-top:.2rem">otomatis ' + k.skorAuto + ' · refleksi ' + k.refleksi + '</div></div>' +
              '</div>' +
              '<div class="btn-row" style="margin-top:.7rem">' +
              '<a class="btn btn-sm" href="#/karya/' + k.id + '">Baca lengkap</a>' +
              '<button class="btn btn-sm" data-edit="' + k.id + '" type="button">Lanjutkan menulis</button>' +
              '<button class="btn btn-sm btn-danger" data-hapus="' + k.id + '" type="button">Hapus</button>' +
              '</div></div>';
          }).join('')
        : '<p class="muted">Belum ada karya. Mulai dari menu Tantangan, pilih tema, lalu tulis teks deskripsimu.</p>') +
      '</section>';

    root.querySelectorAll('[data-edit]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = S.karyaById(b.getAttribute('data-edit'));
        if (!k) return;
        S.get().draf = {
          judul: k.judul, identifikasi: k.teks.identifikasi, bagian: k.teks.bagian,
          penutup: k.teks.penutup, temaId: k.temaId, refleksi: {}, checklist: {}, karyaId: k.id
        };
        S.simpan();
        location.hash = '#/tantangan';
      });
    });

    root.querySelectorAll('[data-hapus]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-hapus');
        var k = S.karyaById(id);
        LS.modal.open({
          title: 'Hapus karya ini?',
          html: '<p>Karya <strong>' + U.esc(k ? k.judul : '') + '</strong> akan dihapus permanen dari peramban ini.</p>',
          buttons: [
            { label: 'Batal', cls: '' },
            { label: 'Hapus', cls: 'btn-danger', onClick: function () {
              S.hapusKarya(id);
              if (S.get().draf && S.get().draf.karyaId === id) { S.get().draf = null; S.simpan(); }
              S.toast('Karya dihapus', '', 'ok');
              LS.views.karyaDaftar(root);
            } }
          ]
        });
      });
    });
  };

  /* ========================================================== DETAIL KARYA */

  LS.views.karyaDetail = function (root, id) {
    var k = S.karyaById(id);
    if (!k) {
      root.innerHTML = '<div class="card"><p>Karya tidak ditemukan.</p><a class="btn" href="#/karya">Kembali ke daftar karya</a></div>';
      return;
    }
    var p = LS.ui.predikat(k.nilai);

    root.innerHTML = '<div class="no-print">' +
      LS.ui.head('Karyaku', k.judul, k.temaJudul + ' · ' + k.jenis + ' · disimpan ' + U.fmtTanggal(k.tanggal)) +
      '<section class="card">' +
      '<div class="score-ring">' +
      '<div class="gauge" style="--pct:' + k.skorAuto + '"><span>' + k.skorAuto + '</span></div>' +
      '<div><div style="font-weight:700">' + p.ico + ' ' + U.esc(p.t) + ' · nilai akhir ' + k.nilai + '</div>' +
      '<div class="muted" style="font-size:.85rem">Skor otomatis ' + k.skorAuto + '/100 · refleksi diri ' + k.refleksi + '/100<br>' +
      U.countWords([k.teks.identifikasi, k.teks.bagian, k.teks.penutup].join(' ')) + ' kata · ' +
      (k.sifat ? k.sifat.length : 0) + ' kata sifat · ' + (k.indra ? k.indra.length : 0) + ' pancaindra terdeteksi</div></div>' +
      '</div>' +
      '</section>' +

      '<section class="card">' +
      '<div class="sec-title"><span class="ico">📄</span>Isi teks</div>' +
      '<div class="teks-box">' +
      '<span class="struktur-tag">Identifikasi</span><p>' + U.esc(k.teks.identifikasi) + '</p>' +
      '<span class="struktur-tag bagian">Deskripsi bagian</span><p>' + U.esc(k.teks.bagian) + '</p>' +
      '<span class="struktur-tag penutup">Penutup</span><p>' + U.esc(k.teks.penutup) + '</p>' +
      '</div>' +
      (k.sifat && k.sifat.length ? '<p class="muted" style="font-size:.88rem">Kata sifat terdeteksi: ' +
        k.sifat.map(function (s) { return '<span class="chip">' + U.esc(s) + '</span>'; }).join(' ') + '</p>' : '') +
      '</section>' +

      '<section class="card">' +
      '<div class="sec-title"><span class="ico">📊</span>Rincian rubrik</div>' +
      (k.rincian || []).map(function (r) {
        var persen = Math.round((r.skor / r.maks) * 100);
        return '<div class="rubric-row"><div><div style="font-size:.88rem">' + U.esc(r.nama) + '</div>' +
          '<div class="bar"><span style="width:' + persen + '%"></span></div>' +
          '<div class="muted" style="font-size:.78rem">' + U.esc(r.catatan) + '</div></div>' +
          '<div class="val">' + r.skor + '/' + r.maks + '</div></div>';
      }).join('') +
      '</section>' +

      '<section class="card no-print"><div class="btn-row">' +
      '<button class="btn btn-primary" id="cetak" type="button">🖨️ Cetak laporan</button>' +
      '<button class="btn" id="lanjut" type="button">✏️ Lanjutkan menulis</button>' +
      '<a class="btn" href="#/karya">← Kembali ke Karyaku</a>' +
      '</div></section>' +
      '</div>' +
      '<section class="card print-only" id="areaCetak"></section>';

    var area = root.querySelector('#areaCetak');
    root.querySelector('#cetak').addEventListener('click', function () {
      k.siswa = k.siswa || { nama: S.get().siswa.nama, kelas: S.get().siswa.kelas };
      area.innerHTML = laporanKarya(k);
      window.print();
    });
    root.querySelector('#lanjut').addEventListener('click', function () {
      S.get().draf = {
        judul: k.judul, identifikasi: k.teks.identifikasi, bagian: k.teks.bagian,
        penutup: k.teks.penutup, temaId: k.temaId, refleksi: {}, checklist: {}, karyaId: k.id
      };
      S.simpan();
      location.hash = '#/tantangan';
    });
  };

  /* API rubrik — dipakai halaman ini sekaligus dapat diuji terpisah */
  LS.rubrik = {
    hitung: hitungRubrik,
    nilaiAkhir: nilaiAkhir,
    refleksiKePersen: refleksiKePersen,
    hitungKataSifat: hitungKataSifat,
    hitungIndra: hitungIndra,
    periksaEjaan: periksaEjaan
  };

})();
