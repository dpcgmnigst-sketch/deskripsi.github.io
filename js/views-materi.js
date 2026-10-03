/* ==========================================================================
   LinguaSmart — views-materi.js
   Komponen UI bersama + halaman Beranda, Materi, dan Contoh Teks.
   ========================================================================== */
(function () {
  'use strict';

  var U = LS.util, S = LS.store, D = LS.data;

  /* ------------------------------------------------------- komponen UI dasar */

  LS.ui = {
    head: function (eyebrow, judul, deskripsi) {
      return '<div class="page-head">' +
        (eyebrow ? '<div class="eyebrow">' + U.esc(eyebrow) + '</div>' : '') +
        '<h1>' + U.esc(judul) + '</h1>' +
        (deskripsi ? '<p>' + U.esc(deskripsi) + '</p>' : '') +
        '</div>';
    },
    bar: function (persen, cls) {
      return '<div class="progress ' + (cls || '') + '"><span style="width:' +
        U.clamp(Math.round(persen), 0, 100) + '%"></span></div>';
    },
    stat: function (ico, num, lbl) {
      return '<div class="card stat"><div class="ico">' + ico + '</div>' +
        '<div class="num">' + U.esc(num) + '</div><div class="lbl">' + U.esc(lbl) + '</div></div>';
    },
    predikat: function (nilai) {
      if (nilai >= 90) return { t: 'Sangat Baik', cls: 'ok', ico: '🏅' };
      if (nilai >= 80) return { t: 'Baik', cls: 'ok', ico: '👍' };
      if (nilai >= 70) return { t: 'Cukup', cls: '', ico: '🙂' };
      if (nilai >= 60) return { t: 'Perlu Latihan', cls: 'no', ico: '💪' };
      return { t: 'Perlu Bimbingan', cls: 'no', ico: '📌' };
    }
  };

  /* ------------------------------------------------------- render blok materi */

  function renderBlok(b) {
    switch (b.t) {
      case 'p':
        return '<p>' + U.esc(b.text) + '</p>';
      case 'h':
        return '<h3>' + U.esc(b.text) + '</h3>';
      case 'list':
        return '<ul>' + b.items.map(function (it) {
          if (typeof it === 'string') return '<li>' + U.esc(it) + '</li>';
          return '<li><strong>' + U.esc(it.b) + '</strong>' + U.esc(it.t) + '</li>';
        }).join('') + '</ul>';
      case 'table':
        return '<div class="tablewrap"><table class="tbl"><thead><tr>' +
          b.head.map(function (h) { return '<th>' + U.esc(h) + '</th>'; }).join('') +
          '</tr></thead><tbody>' +
          b.rows.map(function (r) {
            return '<tr>' + r.map(function (c) { return '<td>' + U.esc(c) + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody></table></div>';
      case 'callout':
        return '<div class="callout ' + (b.jenis || 'info') + '">' +
          (b.title ? '<strong class="callout-title">' + U.esc(b.title) + '</strong>' : '') +
          U.esc(b.text) + '</div>';
      case 'quote':
        return '<blockquote class="blockquote">' + U.esc(b.text) +
          (b.source ? '<cite>' + U.esc(b.source) + '</cite>' : '') + '</blockquote>';
      case 'steps':
        return '<ol class="steps">' + b.items.map(function (it) {
          return '<li><strong>' + U.esc(it.judul) + '</strong>' + U.esc(it.isi) + '</li>';
        }).join('') + '</ol>';
      case 'compare':
        return '<div class="compare">' + ['kiri', 'kanan'].map(function (k) {
          var c = b[k];
          return '<div><h4>' + U.esc(c.judul) + '</h4><ul>' +
            c.items.map(function (i) { return '<li>' + U.esc(i) + '</li>'; }).join('') +
            '</ul></div>';
        }).join('') + '</div>';
      case 'example':
        return '<div class="callout info"><strong class="callout-title">' +
          U.esc(b.judul) + '</strong><ul>' +
          b.isi.map(function (i) { return '<li>' + U.esc(i) + '</li>'; }).join('') +
          '</ul></div>';
      case 'kv':
        return '<div class="tablewrap"><table class="tbl"><tbody>' +
          b.items.map(function (it) {
            return '<tr><th>' + U.esc(it.k) + '</th><td>' + U.esc(it.v) + '</td></tr>';
          }).join('') + '</tbody></table></div>';
      default:
        return '';
    }
  }

  function teksMateri(m) {
    return m.blok.map(function (b) {
      var isi = '';
      if (b.text) isi += ' ' + b.text;
      if (b.items) isi += ' ' + b.items.map(function (i) {
        return typeof i === 'string' ? i : (i.b || '') + ' ' + (i.t || '');
      }).join(' ');
      if (b.rows) isi += ' ' + b.rows.map(function (r) { return r.join(' '); }).join(' ');
      if (b.isi) isi += ' ' + b.isi.join(' ');
      return isi;
    }).join(' ');
  }

  /* ============================================================== BERANDA */

  LS.views.beranda = function (root) {
    var st = S.stats(), li = st.level;
    var nama = S.get().siswa.nama;
    var sapa = nama ? ('Halo, ' + U.esc(nama) + '!') : 'Selamat datang!';

    var tiles = [
      { ico: '📘', judul: 'Materi', desc: 'Enam bab materi teks deskripsi: pengertian, struktur, kaidah kebahasaan, jenis, langkah menulis, dan cara menyunting.', link: '#/materi', label: 'Baca materi' },
      { ico: '📝', judul: 'Contoh Teks Deskripsi', desc: 'Lima contoh teks lengkap dengan analisis struktur, kaidah kebahasaan, glosarium, dan fakta menarik.', link: '#/contoh', label: 'Lihat contoh' },
      { ico: '🎮', judul: 'Permainan', desc: 'Tiga permainan: Susun Teks, Tebak Objek, dan Berburu Kata Sifat untuk melatih kepekaan berbahasa.', link: '#/permainan', label: 'Mainkan' },
      { ico: '❓', judul: 'Kuis', desc: 'Latihan cepat sepuluh soal dengan pembahasan, atau ujian akhir dua puluh soal dengan batas waktu.', link: '#/kuis', label: 'Kerjakan kuis' },
      { ico: '✍️', judul: 'Tantangan Menulis', desc: 'Tulis teks deskripsimu sendiri, lalu nilai otomatis dengan rubrik dan refleksi diri.', link: '#/tantangan', label: 'Ambil tantangan' },
      { ico: '📊', judul: 'Tantangan & Evaluasi', desc: 'Pantau XP, level, badge, riwayat belajar, dan cetak laporan hasil evaluasimu.', link: '#/evaluasi', label: 'Lihat evaluasi' }
    ];

    var saran = rekomendasiBerikut();

    root.innerHTML =
      '<section class="hero">' +
      '<h1>' + sapa + ' Belajar teks deskripsi jadi lebih hidup.</h1>' +
      '<p>LinguaSmart memandu kamu dari memahami materi, membaca contoh, bermain, mengerjakan kuis, sampai menulis teks deskripsi sendiri — lengkap dengan penilaian otomatis.</p>' +
      '<div class="hero-stats">' +
      '<span>' + li.ico + ' Level ' + li.level + ' · ' + U.esc(li.judul) + '</span>' +
      '<span>⭐ ' + st.xp + ' XP</span>' +
      '<span>🏅 ' + st.badge + '/' + S.BADGES.length + ' badge</span>' +
      '</div>' +
      '<div class="btn-row" style="margin-top:1.1rem">' +
      '<a class="btn" href="#/materi">Mulai dari materi</a>' +
      '<a class="btn ghost" href="' + (saran.link) + '">' + U.esc(saran.label) + '</a>' +
      '</div>' +
      '</section>' +

      '<section class="card">' +
      '<div class="sec-title"><span class="ico">🚀</span>Progres belajarmu</div>' +
      '<p class="muted">' + U.esc(saran.teks) + '</p>' +
      '<div style="margin:.6rem 0 .2rem;display:flex;justify-content:space-between;font-size:.85rem">' +
      '<span>Level ' + li.level + ' — ' + U.esc(li.judul) + '</span>' +
      '<span>' + (li.next ? (li.sisaKeNext + ' XP lagi ke Level ' + li.next.level) : 'Level tertinggi') + '</span>' +
      '</div>' +
      LS.ui.bar(li.persen, 'accent') +
      '<div class="grid cols-4" style="margin-top:1rem">' +
      LS.ui.stat('📘', st.materi + '/6', 'Materi dibaca') +
      LS.ui.stat('📝', st.contoh + '/5', 'Contoh dibaca') +
      LS.ui.stat('🎯', st.kuisTerbaik ? st.kuisTerbaik : '—', 'Skor kuis terbaik') +
      LS.ui.stat('✍️', st.karya, 'Karya tersimpan') +
      '</div>' +
      '</section>' +

      '<section>' +
      '<div class="sec-title"><span class="ico">🧭</span>Menu belajar</div>' +
      '<div class="grid cols-3">' +
      tiles.map(function (t) {
        return '<div class="card tile"><div class="ico">' + t.ico + '</div>' +
          '<h3>' + U.esc(t.judul) + '</h3><p>' + U.esc(t.desc) + '</p>' +
          '<a class="btn btn-sm" href="' + t.link + '">' + U.esc(t.label) + '</a></div>';
      }).join('') +
      '</div>' +
      '</section>' +

      '<section class="grid cols-2">' +
      '<div class="card">' +
      '<div class="sec-title"><span class="ico">🎓</span>Alur belajar yang disarankan</div>' +
      '<ol class="steps">' +
      '<li><strong>Baca materi</strong>Enam bab singkat, masing-masing sekitar lima sampai sepuluh menit.</li>' +
      '<li><strong>Amati contoh teks</strong>Kelima contoh dilengkapi analisis struktur dan kaidah kebahasaan.</li>' +
      '<li><strong>Bermain</strong>Tiga permainan melatih struktur, ketelitian membaca, dan kosakata.</li>' +
      '<li><strong>Kerjakan kuis</strong>Latihan cepat untuk menguji pemahaman, ujian akhir untuk mengukur capaian.</li>' +
      '<li><strong>Tantangan menulis</strong>Tulis teksmu sendiri lalu lihat hasil penilaian rubriknya.</li>' +
      '<li><strong>Evaluasi</strong>Periksa laporan, badge, dan rekomendasi perbaikan.</li>' +
      '</ol>' +
      '</div>' +

      '<div class="card">' +
      '<div class="sec-title"><span class="ico">🙋</span>Identitas siswa</div>' +
      '<p class="muted">Nama dan kelas dipakai pada laporan evaluasi yang dapat dicetak.</p>' +
      '<label class="field"><span>Nama lengkap</span>' +
      '<input type="text" id="inNama" maxlength="40" placeholder="Contoh: Nadia Putri" value="' + U.esc(S.get().siswa.nama) + '"></label>' +
      '<label class="field"><span>Kelas</span>' +
      '<input type="text" id="inKelas" maxlength="20" placeholder="Contoh: VII A" value="' + U.esc(S.get().siswa.kelas) + '"></label>' +
      '<button class="btn btn-primary" id="btnSimpanSiswa" type="button">Simpan identitas</button>' +
      '<p class="muted" style="margin-top:.8rem;font-size:.85rem">Progres otomatis tersimpan di peramban ini' +
      (S.bisaSimpan() ? '.' : ' — peringatan: penyimpanan tidak tersedia, progres tidak akan tersimpan.') + '</p>' +
      '</div>' +
      '</section>';

    var btn = root.querySelector('#btnSimpanSiswa');
    btn.addEventListener('click', function () {
      var nm = root.querySelector('#inNama').value.trim();
      var kl = root.querySelector('#inKelas').value.trim();
      S.setSiswa(nm, kl);
      S.toast('Identitas disimpan', nm ? (nm + (kl ? ' · ' + kl : '')) : 'Nama masih kosong', 'ok');
      if (nm) S.addLog('🙋', 'Mengisi identitas: ' + nm + (kl ? ' (' + kl + ')' : ''));
      LS.views.beranda(root);
    });

    /* -------- fungsi lokal -------- */
    function rekomendasiBerikut() {
      var s = S.stats();
      if (s.materi < 6) return { link: '#/materi', label: 'Lanjut baca materi', teks: 'Selesaikan keenam bab materi untuk membuka pemahaman menyeluruh tentang teks deskripsi.' };
      if (s.contoh < 5) return { link: '#/contoh', label: 'Baca contoh teks', teks: 'Kamu sudah menyelesaikan materi. Sekarang amati bagaimana teori itu dipakai pada contoh teks.' };
      if (s.gameMain < 3) return { link: '#/permainan', label: 'Mainkan permainan', teks: 'Latih kepekaanmu lewat permainan sebelum menghadapi kuis.' };
      if (s.kuisTerbaik < 80) return { link: '#/kuis', label: 'Kerjakan kuis', teks: 'Target berikutnya: skor kuis minimal 80. Manfaatkan pembahasan pada setiap soal.' };
      if (s.karya < 1) return { link: '#/tantangan', label: 'Tulis karyamu', teks: 'Pemahamanmu sudah baik. Saatnya membuktikan dengan menulis teks deskripsi sendiri.' };
      return { link: '#/evaluasi', label: 'Buka evaluasi', teks: 'Semua aktivitas sudah kamu jalani. Periksa laporan dan badge koleksimu!' };
    }
  };

  /* =============================================================== MATERI */

  LS.views.materiDaftar = function (root) {
    var kata = '';
    render(root, kata);

    function render(el, filter) {
      var f = U.norm(filter || '');
      var daftar = D.materi.filter(function (m) {
        if (!f) return true;
        return (U.norm(m.judul) + ' ' + U.norm(m.ringkas) + ' ' + U.norm(teksMateri(m))).indexOf(f) !== -1;
      });

      el.innerHTML = LS.ui.head('Materi', 'Belajar Teks Deskripsi', 'Enam bab materi singkat. Setiap bab yang kamu buka akan ditandai selesai dan memberi XP.') +
        '<section class="card">' +
        '<div class="toolbar">' +
        '<div style="flex:1 1 240px"><input type="search" id="cari" placeholder="Cari materi, misalnya: struktur, majas, kata depan" value="' + U.esc(filter || '') + '"></div>' +
        '<span class="chip">' + S.get().materi.length + ' dari ' + D.materi.length + ' bab selesai</span>' +
        '</div>' +
        LS.ui.bar((S.get().materi.length / D.materi.length) * 100, 'ok') +
        '</section>' +
        '<section class="card">' +
        (daftar.length ? '<div class="materi-list">' + daftar.map(function (m) {
          var sudah = S.sudahBacaMateri(m.id);
          var nomor = D.materi.indexOf(m) + 1;
          return '<div class="materi-item">' +
            '<div class="num">' + nomor + '</div>' +
            '<div style="flex:1">' +
            '<h3><a href="#/materi/' + m.id + '">' + m.ico + ' ' + U.esc(m.judul) + '</a></h3>' +
            '<p>' + U.esc(m.ringkas) + '</p>' +
            '<div class="meta">' +
            '<span class="chip info">± ' + m.menit + ' menit</span>' +
            (sudah ? '<span class="chip done">✔ Sudah dibaca</span>' : '<span class="chip">Belum dibaca</span>') +
            '</div></div>' +
            '<a class="btn btn-sm" href="#/materi/' + m.id + '">' + (sudah ? 'Buka lagi' : 'Baca') + '</a>' +
            '</div>';
        }).join('') + '</div>' : '<p class="muted">Materi dengan kata kunci "' + U.esc(filter) + '" tidak ditemukan.</p>') +
        '</section>' +
        '<section class="card">' +
        '<div class="sec-title"><span class="ico">🧠</span>Ringkasan satu halaman</div>' +
        '<div class="tablewrap"><table class="tbl"><thead><tr><th>Bagian</th><th>Yang harus kamu ingat</th></tr></thead><tbody>' +
        '<tr><td>Pengertian</td><td>Teks yang menggambarkan satu objek khusus secara terperinci agar pembaca seolah mengalaminya.</td></tr>' +
        '<tr><td>Struktur</td><td>Identifikasi → deskripsi bagian → penutup (kesan).</td></tr>' +
        '<tr><td>Kaidah</td><td>Kata sifat, kalimat perincian, pancaindra, majas, kata depan, sinonim–antonim.</td></tr>' +
        '<tr><td>Jenis</td><td>Tempat, orang, benda, hewan, suasana; corak objektif atau subjektif.</td></tr>' +
        '<tr><td>Menulis</td><td>Amati → catat → kerangka → kembangkan → sunting.</td></tr>' +
        '</tbody></table></div>' +
        '</section>';

      var inp = el.querySelector('#cari');
      var t = null;
      inp.addEventListener('input', function () {
        clearTimeout(t);
        var v = inp.value;
        t = setTimeout(function () {
          render(el, v);
          var el2 = el.querySelector('#cari');
          el2.focus();
          el2.setSelectionRange(el2.value.length, el2.value.length);
        }, 220);
      });
    }
  };

  LS.views.materiDetail = function (root, id) {
    var idx = -1;
    D.materi.forEach(function (m, i) { if (m.id === id) idx = i; });
    if (idx < 0) { root.innerHTML = '<div class="card"><p>Materi tidak ditemukan.</p><a class="btn" href="#/materi">Kembali ke daftar materi</a></div>'; return; }

    var m = D.materi[idx];
    var sebelum = D.materi[idx - 1] || null;
    var sesudah = D.materi[idx + 1] || null;
    var baru = !S.sudahBacaMateri(m.id);

    root.innerHTML =
      '<div class="page-head"><div class="eyebrow"><a href="#/materi">Materi</a> · Bab ' + (idx + 1) + ' dari ' + D.materi.length + '</div>' +
      '<h1>' + m.ico + ' ' + U.esc(m.judul) + '</h1>' +
      '<p>' + U.esc(m.ringkas) + '</p></div>' +

      '<section class="card prose">' + m.blok.map(renderBlok).join('') + '</section>' +

      '<section class="card">' +
      '<div class="btn-row">' +
      (sebelum ? '<a class="btn" href="#/materi/' + sebelum.id + '">← ' + U.esc(sebelum.judul) + '</a>' : '') +
      '<span class="spacer" style="margin-left:auto"></span>' +
      (sesudah ? '<a class="btn btn-primary" href="#/materi/' + sesudah.id + '">' + U.esc(sesudah.judul) + ' →</a>'
        : '<a class="btn btn-primary" href="#/contoh">Lanjut ke contoh teks →</a>') +
      '</div>' +
      '<p class="muted" style="margin:.8rem 0 0;font-size:.85rem">' +
      (baru ? 'Bab ini baru dibuka — ditandai selesai (+' + S.XP.materi + ' XP).'
        : 'Bab ini sudah pernah kamu baca.') +
      ' <a href="#/kuis">Uji pemahaman dengan kuis →</a></p>' +
      '</section>';

    if (baru) S.tandaiMateri(m.id);
  };

  /* ========================================================== CONTOH TEKS */

  LS.views.contohDaftar = function (root) {
    var filter = 'Semua';
    render(root, filter);

    function render(el, f) {
      var jenis = [];
      D.contoh.forEach(function (c) { if (jenis.indexOf(c.jenis) === -1) jenis.push(c.jenis); });
      var daftar = D.contoh.filter(function (c) { return f === 'Semua' || c.jenis === f; });

      el.innerHTML = LS.ui.head('Contoh', 'Contoh Teks Deskripsi', 'Lima contoh teks lengkap. Setiap contoh dilengkapi analisis struktur, kaidah kebahasaan, glosarium, dan fakta menarik.') +
        '<section class="card">' +
        '<div class="toolbar">' +
        '<span class="muted">Saring jenis:</span>' +
        ['Semua'].concat(jenis).map(function (j) {
          return '<button type="button" class="btn btn-sm filter-btn' + (j === f ? ' active' : '') + '" data-j="' + U.esc(j) + '">' + U.esc(j) + '</button>';
        }).join('') +
        '<span class="spacer"></span><span class="chip">' + S.get().contoh.length + ' dari ' + D.contoh.length + ' contoh dibaca</span>' +
        '</div>' +
        LS.ui.bar((S.get().contoh.length / D.contoh.length) * 100, 'ok') +
        '</section>' +
        '<section class="grid cols-2">' +
        daftar.map(function (c) {
          var sudah = S.sudahBacaContoh(c.id);
          return '<div class="card tile">' +
            '<div class="ico">' + c.ico + '</div>' +
            '<h3>' + U.esc(c.judul) + '</h3>' +
            '<p>' + c.teks.length + ' paragraf · ' + U.countWords(c.teks.join(' ')) + ' kata</p>' +
            '<div class="btn-row" style="margin-bottom:.6rem">' +
            '<span class="chip info">' + U.esc(c.jenis) + '</span>' +
            '<span class="chip">' + U.esc(c.corak) + '</span>' +
            (sudah ? '<span class="chip done">✔ Dibaca</span>' : '') +
            '</div>' +
            '<a class="btn btn-sm" href="#/contoh/' + c.id + '">Baca dan analisis</a>' +
            '</div>';
        }).join('') +
        '</section>' +
        '<section class="card">' +
        '<div class="sec-title"><span class="ico">👀</span>Cara membaca contoh dengan baik</div>' +
        '<ol class="steps">' +
        '<li><strong>Baca teksnya lebih dulu</strong>Nikmati teksnya tanpa melihat analisis. Bayangkan objeknya di kepalamu.</li>' +
        '<li><strong>Buka analisis struktur</strong>Perhatikan mengapa setiap paragraf berada pada posisi itu.</li>' +
        '<li><strong>Sorot kaidah kebahasaan</strong>Lihat kata sifat, kata pancaindra, dan majas yang dipakai penulis.</li>' +
        '<li><strong>Tirukan polanya</strong>Gunakan pola yang sama untuk objek pilihanmu di menu Tantangan.</li>' +
        '</ol>' +
        '</section>';

      el.querySelectorAll('.filter-btn').forEach(function (b) {
        b.addEventListener('click', function () { render(el, b.getAttribute('data-j')); });
      });
    }
  };

  /* ------------------------------------------------- sorot kaidah di teks */

  function sorot(html, kata, cls) {
    (kata || []).forEach(function (k) {
      if (!k) return;
      var pola = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      html = html.replace(new RegExp('(^|[^\\w-])(' + pola + ')(?![\\w-])', 'gi'),
        '$1<span class="' + cls + '">$2</span>');
    });
    return html;
  }

  LS.views.contohDetail = function (root, id) {
    var c = null;
    D.contoh.forEach(function (x) { if (x.id === id) c = x; });
    if (!c) { root.innerHTML = '<div class="card"><p>Contoh teks tidak ditemukan.</p><a class="btn" href="#/contoh">Kembali ke daftar contoh</a></div>'; return; }

    var mode = '';          // '' | 'struktur' | 'kaidah'
    var baru = !S.sudahBacaContoh(c.id);
    var kata = U.countWords(c.teks.join(' '));

    root.innerHTML =
      '<div class="page-head"><div class="eyebrow"><a href="#/contoh">Contoh Teks</a></div>' +
      '<h1>' + c.ico + ' ' + U.esc(c.judul) + '</h1>' +
      '<p>' + U.esc(c.jenis) + ' · corak ' + U.esc(c.corak) + ' · ' + c.teks.length + ' paragraf · ' + kata + ' kata · ± ' + c.menit + ' menit baca</p></div>' +

      '<section class="card">' +
      '<div class="toolbar no-print">' +
      '<button class="btn btn-sm filter-btn active" data-mode="" type="button">Teks saja</button>' +
      '<button class="btn btn-sm filter-btn" data-mode="struktur" type="button">Tampilkan struktur</button>' +
      '<button class="btn btn-sm filter-btn" data-mode="kaidah" type="button">Sorot kaidah bahasa</button>' +
      '<span class="spacer"></span>' +
      '<button class="btn btn-sm" id="btnCetak" type="button">🖨️ Cetak</button>' +
      '</div>' +
      '<div id="teksBox"></div>' +
      '<div id="legend" class="no-print"></div>' +
      '</section>' +

      '<section class="card">' +
      '<div class="sec-title"><span class="ico">🧱</span>Analisis struktur</div>' +
      '<div class="grid cols-2">' +
      c.struktur.map(function (s) {
        return '<div class="card" style="box-shadow:none">' +
          '<span class="struktur-tag' + (s.label === 'Penutup' ? ' penutup' : (s.label === 'Identifikasi' ? '' : ' bagian')) + '">' + U.esc(s.label) + '</span>' +
          '<p style="margin:.3rem 0 .4rem"><strong>Paragraf ' + (s.paragraf + 1) + '.</strong> ' + U.esc(s.isi) + '</p>' +
          '<p class="muted" style="font-size:.86rem;margin:0">"' + U.esc(c.teks[s.paragraf]) + '"</p>' +
          '</div>';
      }).join('') +
      '</div>' +
      '</section>' +

      '<section class="grid cols-2">' +
      '<div class="card">' +
      '<div class="sec-title"><span class="ico">🔤</span>Kaidah kebahasaan</div>' +
      '<div class="tablewrap"><table class="tbl"><thead><tr><th>Kaidah</th><th>Contoh pada teks</th><th>Keterangan</th></tr></thead><tbody>' +
      c.kaidah.map(function (k) {
        return '<tr><td><strong>' + U.esc(k.nama) + '</strong></td><td>' + U.esc(k.contoh) + '</td><td>' + U.esc(k.ket) + '</td></tr>';
      }).join('') +
      '</tbody></table></div>' +
      '</div>' +

      '<div>' +
      '<div class="card">' +
      '<div class="sec-title"><span class="ico">📖</span>Glosarium</div>' +
      '<ul class="prompt-list">' +
      c.glosarium.map(function (g) {
        return '<li><strong>' + U.esc(g.kata) + '</strong> — ' + U.esc(g.arti) + '</li>';
      }).join('') +
      '</ul>' +
      '</div>' +
      '<div class="card">' +
      '<div class="sec-title"><span class="ico">💡</span>Fakta menarik</div>' +
      '<ul class="prompt-list">' +
      c.fakta.map(function (f) { return '<li>' + U.esc(f) + '</li>'; }).join('') +
      '</ul>' +
      '</div>' +
      '</div>' +
      '</section>' +

      '<section class="card">' +
      '<div class="sec-title"><span class="ico">✍️</span>Sekarang giliranmu</div>' +
      '<p>Tirukan pola teks ini untuk objek pilihanmu sendiri, lalu nilai hasilnya dengan rubrik otomatis.</p>' +
      '<div class="btn-row"><a class="btn btn-primary" href="#/tantangan">Buka tantangan menulis</a>' +
      '<a class="btn" href="#/permainan">Latihan lewat permainan</a>' +
      '<a class="btn" href="#/kuis">Uji dengan kuis</a></div>' +
      '</section>';

    var box = root.querySelector('#teksBox');
    var legend = root.querySelector('#legend');

    function gambar() {
      box.innerHTML = c.teks.map(function (p, i) {
        var label = '';
        if (mode === 'struktur') {
          var st = null;
          c.struktur.forEach(function (s) { if (s.paragraf === i) st = s; });
          if (st) {
            var cls = st.label === 'Penutup' ? ' penutup' : (st.label === 'Identifikasi' ? '' : ' bagian');
            label = '<span class="struktur-tag' + cls + '">' + U.esc(st.label) + '</span><br>';
          }
        }
        var isi = U.esc(p);
        if (mode === 'kaidah') {
          isi = sorot(isi, D.leksikon.indra.lihat, 'mk1');
          isi = sorot(isi, D.leksikon.indra.dengar.concat(D.leksikon.indra.cium, D.leksikon.indra.rasa, D.leksikon.indra.raba), 'mk2');
          isi = sorot(isi, D.leksikon.majas, 'mk3');
        }
        return '<div class="teks-box">' + label + '<p>' + isi + '</p></div>';
      }).join('');

      legend.innerHTML = mode === 'kaidah'
        ? '<p class="muted" style="font-size:.86rem;margin:.4rem 0 0">' +
          '<span class="mk1">kuning</span> = kata penglihatan · ' +
          '<span class="mk2">biru</span> = kata pendengaran/penciuman/pengecapan/perabaan · ' +
          '<span class="mk3">hijau</span> = kata pembanding majas</p>'
        : (mode === 'struktur' ? '<p class="muted" style="font-size:.86rem;margin:.4rem 0 0">Setiap paragraf diberi penanda strukturnya sesuai analisis di bawah.</p>' : '');
    }

    gambar();

    root.querySelectorAll('[data-mode]').forEach(function (b) {
      b.addEventListener('click', function () {
        mode = b.getAttribute('data-mode');
        root.querySelectorAll('[data-mode]').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        gambar();
      });
    });

    root.querySelector('#btnCetak').addEventListener('click', function () { window.print(); });

    if (baru) S.tandaiContoh(c.id);
  };

})();
