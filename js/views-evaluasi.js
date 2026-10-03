/* ==========================================================================
   LinguaSmart — views-evaluasi.js
   Dasbor evaluasi: capaian, level, badge, analisis topik, riwayat aktivitas,
   rekomendasi tindak lanjut, cetak laporan, ekspor data, dan reset.
   ========================================================================== */
(function () {
  'use strict';

  var U = LS.util, S = LS.store, D = LS.data;

  LS.views.evaluasi = function (root) {
    var st = S.stats(), li = st.level;
    var siswa = S.get().siswa;
    var topik = S.akurasiTopik();
    var terlemah = S.topikTerlemah();
    var karya = S.get().karya;
    var log = S.get().log;

    /* ---------------- rekomendasi ---------------- */
    var saran = [];
    if (st.materi < 6) saran.push({ ico: '📘', teks: 'Selesaikan ' + (6 - st.materi) + ' bab materi yang belum dibaca.', link: '#/materi', label: 'Buka materi' });
    if (st.contoh < 5) saran.push({ ico: '📝', teks: 'Baca ' + (5 - st.contoh) + ' contoh teks lagi dan perhatikan analisis strukturnya.', link: '#/contoh', label: 'Buka contoh' });
    if (st.gameMain < 3) saran.push({ ico: '🎮', teks: 'Coba ketiga permainan untuk melatih kepekaan kosakata.', link: '#/permainan', label: 'Bermain' });
    if (!st.kuisDiikuti) saran.push({ ico: '❓', teks: 'Kerjakan kuis pertama untuk mengetahui tingkat penguasaanmu.', link: '#/kuis', label: 'Kerjakan kuis' });
    else if (st.kuisTerbaik < 80) saran.push({ ico: '🎯', teks: 'Skor terbaikmu ' + st.kuisTerbaik + '. Ulangi kuis sampai mencapai 80.', link: '#/kuis', label: 'Ulangi kuis' });
    if (terlemah && terlemah.persen < 80) saran.push({ ico: '🔎', teks: 'Perkuat topik "' + terlemah.nama + '" (' + terlemah.persen + '% benar).', link: '#/materi', label: 'Baca ulang' });
    if (!st.karya) saran.push({ ico: '✍️', teks: 'Tulis satu teks deskripsi dan simpan sebagai karya.', link: '#/tantangan', label: 'Menulis' });
    else if (st.karya < 3) saran.push({ ico: '📚', teks: 'Tambah karya lagi. Saat ini ' + st.karya + ' karya dengan rata-rata nilai ' + st.karyaRata + '.', link: '#/tantangan', label: 'Menulis lagi' });
    if (!saran.length) saran.push({ ico: '🌟', teks: 'Semua indikator sudah baik. Pertahankan dengan mencoba ujian akhir tanpa melihat materi.', link: '#/kuis', label: 'Ujian akhir' });

    root.innerHTML = '<div class="no-print">' +
      LS.ui.head('Evaluasi', 'Laporan Capaian Belajar',
      'Halaman ini merangkum seluruh aktivitasmu: materi yang dibaca, permainan, kuis, dan karya tulis.') +

      '<section class="card">' +
      '<div class="score-ring">' +
      '<div class="gauge" style="--pct:' + li.persen + '"><span>' + li.level + '</span></div>' +
      '<div style="flex:1 1 240px">' +
      '<div style="font-weight:700">' + li.ico + ' Level ' + li.level + ' — ' + U.esc(li.judul) + '</div>' +
      '<div class="muted" style="font-size:.88rem">' + st.xp + ' XP · ' + st.badge + ' dari ' + S.BADGES.length + ' badge' +
      (li.next ? ' · ' + li.sisaKeNext + ' XP lagi ke Level ' + li.next.level : ' · level tertinggi') + '</div>' +
      '<div style="margin-top:.5rem">' + LS.ui.bar(li.persen, 'accent') + '</div>' +
      '</div>' +
      '<div class="btn-row" style="flex-direction:column">' +
      '<button class="btn btn-primary btn-sm" id="cetak" type="button">🖨️ Cetak laporan</button>' +
      '<button class="btn btn-sm" id="ekspor" type="button">💾 Unduh data (JSON)</button>' +
      '<button class="btn btn-sm btn-danger" id="reset" type="button">♻️ Reset progres</button>' +
      '</div>' +
      '</div>' +
      '</section>' +

      '<section class="grid cols-4">' +
      LS.ui.stat('📘', st.materi + '/6', 'Materi dibaca') +
      LS.ui.stat('📝', st.contoh + '/5', 'Contoh dibaca') +
      LS.ui.stat('🎮', st.gameMain, 'Permainan dimainkan') +
      LS.ui.stat('❓', st.kuisDiikuti, 'Kuis dikerjakan') +
      LS.ui.stat('🏆', st.kuisTerbaik || '—', 'Skor kuis terbaik') +
      LS.ui.stat('✍️', st.karya, 'Karya tulis') +
      LS.ui.stat('📈', st.karyaRata || '—', 'Rata-rata nilai karya') +
      LS.ui.stat('🏅', st.badge, 'Badge diraih') +
      '</section>' +

      '<section class="grid cols-2">' +
      '<div class="card"><div class="sec-title"><span class="ico">📊</span>Penguasaan per topik kuis</div>' +
      (topik.length ? topik.map(function (t) {
        var cls = t.persen >= 80 ? 'baik' : (t.persen >= 60 ? '' : 'remedial');
        return '<div class="bar-row ' + cls + '"><span>' + U.esc(t.nama) + '</span>' +
          '<span class="bar"><span style="width:' + t.persen + '%"></span></span>' +
          '<span>' + t.persen + '% <span class="muted">(' + t.total + ' soal)</span></span></div>';
      }).join('') +
      '<p class="radar-note">Hijau = sudah baik (≥ 80%), kuning = perlu latihan (60–79%), jingga = perlu bimbingan (&lt; 60%).</p>'
        : '<p class="muted">Belum ada data kuis. Kerjakan kuis untuk melihat analisis per topik.</p>') +
      '</div>' +

      '<div class="card"><div class="sec-title"><span class="ico">🏆</span>Skor terbaik tiap permainan</div>' +
      ['susun', 'tebak', 'sifat'].map(function (id) {
        var g = S.gameInfo(id);
        var nama = { susun: '🧩 Susun Teks', tebak: '🔍 Tebak Objek', sifat: '🎯 Berburu Kata Sifat' }[id];
        var persen = g.main ? g.terbaik : 0;
        return '<div class="bar-row ' + (persen >= 80 ? 'baik' : (persen >= 60 ? '' : 'remedial')) + '">' +
          '<span>' + nama + '</span><span class="bar"><span style="width:' + persen + '%"></span></span>' +
          '<span>' + (g.main ? g.terbaik : '—') + '</span></div>';
      }).join('') +
      '<div class="sec-title" style="margin-top:1rem"><span class="ico">✍️</span>Nilai karya tulis</div>' +
      (karya.length ? karya.slice(0, 6).map(function (k) {
        return '<div class="bar-row ' + (k.nilai >= 80 ? 'baik' : (k.nilai >= 60 ? '' : 'remedial')) + '">' +
          '<span>' + U.esc(k.judul) + '</span><span class="bar"><span style="width:' + k.nilai + '%"></span></span>' +
          '<span>' + k.nilai + '</span></div>';
      }).join('') : '<p class="muted">Belum ada karya tulis.</p>') +
      '</div>' +
      '</section>' +

      '<section class="card">' +
      '<div class="sec-title"><span class="ico">🏅</span>Koleksi badge</div>' +
      '<div class="badge-grid">' +
      S.BADGES.map(function (b) {
        var punya = S.badgeDimiliki(b.id);
        return '<div class="badge-card' + (punya ? ' on' : '') + '">' +
          '<div class="b-ico">' + (punya ? b.ico : '🔒') + '</div>' +
          '<div class="b-name">' + U.esc(b.nama) + '</div>' +
          '<div class="b-desc">' + U.esc(b.desc) + '</div>' +
          '<div class="muted" style="font-size:.72rem;margin-top:.3rem">' + (punya ? 'Sudah diraih' : 'Belum diraih') + '</div>' +
          '</div>';
      }).join('') +
      '</div>' +
      '</section>' +

      '<section class="grid cols-2">' +
      '<div class="card"><div class="sec-title"><span class="ico">🎯</span>Rekomendasi tindak lanjut</div>' +
      '<ul class="prompt-list">' +
      saran.map(function (s) {
        return '<li>' + s.ico + ' ' + U.esc(s.teks) + ' <a href="' + s.link + '">' + U.esc(s.label) + ' →</a></li>';
      }).join('') +
      '</ul></div>' +

      '<div class="card"><div class="sec-title"><span class="ico">🕒</span>Riwayat aktivitas</div>' +
      (log.length
        ? '<ul class="log-list">' + log.slice(0, 25).map(function (l) {
            return '<li><span>' + l.ikon + '</span><span>' + U.esc(l.teks) + '</span>' +
              '<span class="t">' + U.fmtTanggal(l.tanggal) + ' ' + U.fmtWaktu(l.tanggal) + '</span></li>';
          }).join('') + '</ul>'
        : '<p class="muted">Belum ada aktivitas tercatat.</p>') +
      '</div>' +
      '</section>' +

      '<section class="card no-print">' +
      '<div class="sec-title"><span class="ico">🧾</span>Kesimpulan evaluasi</div>' +
      '<p>' + kesimpulan(st, topik) + '</p>' +
      '</section>' +
      '</div>' +

      '<section class="card print-only" id="areaCetak"></section>';

    /* ---------------- aksi ---------------- */
    root.querySelector('#cetak').addEventListener('click', function () {
      root.querySelector('#areaCetak').innerHTML = laporanEvaluasi(st, li, topik, karya);
      window.print();
    });

    root.querySelector('#ekspor').addEventListener('click', function () {
      var data = JSON.stringify(S.get(), null, 2);
      var ok = U.unduh('linguasmart-progres.json', data, 'application/json');
      S.toast(ok ? 'Data diunduh' : 'Gagal mengunduh', ok ? 'Berkas linguasmart-progres.json tersimpan.' : 'Peramban menolak unduhan.', ok ? 'ok' : 'err');
    });

    root.querySelector('#reset').addEventListener('click', function () {
      LS.modal.open({
        title: 'Reset seluruh progres?',
        html: '<p>Tindakan ini menghapus XP, badge, riwayat kuis, skor permainan, dan <strong>semua karya tulis</strong> yang tersimpan di peramban ini.</p>' +
          '<p class="muted">Disarankan mengunduh data (JSON) terlebih dahulu sebagai cadangan.</p>',
        buttons: [
          { label: 'Batal', cls: '' },
          { label: 'Ya, reset semua', cls: 'btn-danger', onClick: function () {
            S.reset();
            S.toast('Progres direset', 'Semua data belajar dikosongkan.', 'ok');
            LS.views.evaluasi(root);
          } }
        ]
      });
    });
  };

  /* --------------------------------------------------------- kesimpulan teks */

  function kesimpulan(st, topik) {
    var bagian = [];
    bagian.push('Kamu telah membaca <strong>' + st.materi + ' dari 6</strong> bab materi dan <strong>' + st.contoh + ' dari 5</strong> contoh teks.');
    if (st.kuisDiikuti) {
      bagian.push('Kuis sudah dikerjakan <strong>' + st.kuisDiikuti + ' kali</strong> dengan skor terbaik <strong>' + st.kuisTerbaik + '</strong>.');
    } else bagian.push('Kuis belum pernah dikerjakan.');
    if (st.karya) bagian.push('Kamu telah menyimpan <strong>' + st.karya + ' karya</strong> dengan rata-rata nilai <strong>' + st.karyaRata + '</strong>.');
    else bagian.push('Belum ada karya tulis yang disimpan.');

    var lemah = topik.filter(function (t) { return t.persen < 80; });
    if (lemah.length) {
      bagian.push('Topik yang masih perlu diperkuat: <strong>' + lemah.map(function (t) { return U.esc(t.nama) + ' (' + t.persen + '%)'; }).join(', ') + '</strong>.');
    } else if (topik.length) {
      bagian.push('Seluruh topik kuis sudah dikuasai dengan baik.');
    }
    bagian.push('Total perolehan: <strong>' + st.xp + ' XP</strong>, level <strong>' + st.level.level + ' (' + U.esc(st.level.judul) + ')</strong>, dan <strong>' + st.badge + ' badge</strong>.');
    return bagian.join(' ');
  }

  /* --------------------------------------------------------- laporan cetak */

  function laporanEvaluasi(st, li, topik, karya) {
    var siswa = S.get().siswa;
    return '<h2 style="text-align:center">LAPORAN EVALUASI BELAJAR</h2>' +
      '<p style="text-align:center;margin-top:-.5rem"><strong>LinguaSmart — Pembelajaran Teks Deskripsi (SMP/MTs Kelas VII)</strong></p>' +
      '<div class="tablewrap"><table class="tbl"><tbody>' +
      '<tr><th>Nama siswa</th><td>' + U.esc(siswa.nama || '................................') + '</td>' +
      '<th>Kelas</th><td>' + U.esc(siswa.kelas || '................') + '</td></tr>' +
      '<tr><th>Tanggal cetak</th><td>' + U.fmtTanggal(new Date().toISOString()) + '</td>' +
      '<th>Level / gelar</th><td>' + li.level + ' — ' + U.esc(li.judul) + '</td></tr>' +
      '</tbody></table></div>' +

      '<h3>A. Capaian aktivitas</h3>' +
      '<div class="tablewrap"><table class="tbl"><thead><tr><th>Komponen</th><th>Capaian</th><th>Keterangan</th></tr></thead><tbody>' +
      '<tr><td>Materi dibaca</td><td>' + st.materi + ' / 6 bab</td><td>' + (st.materi >= 6 ? 'Tuntas' : 'Belum tuntas') + '</td></tr>' +
      '<tr><td>Contoh teks dibaca</td><td>' + st.contoh + ' / 5 teks</td><td>' + (st.contoh >= 5 ? 'Tuntas' : 'Belum tuntas') + '</td></tr>' +
      '<tr><td>Permainan dimainkan</td><td>' + st.gameMain + ' kali</td><td>Skor terbaik ' + (st.gameTerbaik || '-') + '</td></tr>' +
      '<tr><td>Kuis dikerjakan</td><td>' + st.kuisDiikuti + ' kali</td><td>Skor terbaik ' + (st.kuisTerbaik || '-') + (st.kuisTerbaik >= 80 ? ' (lulus)' : '') + '</td></tr>' +
      '<tr><td>Karya tulis</td><td>' + st.karya + ' karya</td><td>Rata-rata nilai ' + (st.karyaRata || '-') + '</td></tr>' +
      '<tr><td>XP / Badge</td><td>' + st.xp + ' XP / ' + st.badge + ' badge</td><td>' + U.esc(li.judul) + '</td></tr>' +
      '</tbody></table></div>' +

      '<h3>B. Penguasaan per topik</h3>' +
      (topik.length
        ? '<div class="tablewrap"><table class="tbl"><thead><tr><th>Topik</th><th>Ketuntasan</th><th>Status</th></tr></thead><tbody>' +
          topik.map(function (t) {
            return '<tr><td>' + U.esc(t.nama) + '</td><td>' + t.persen + '% (' + t.total + ' soal)</td>' +
              '<td>' + (t.persen >= 80 ? 'Tuntas' : (t.persen >= 60 ? 'Perlu latihan' : 'Perlu bimbingan')) + '</td></tr>';
          }).join('') + '</tbody></table></div>'
        : '<p>Belum ada data kuis.</p>') +

      '<h3>C. Daftar karya tulis</h3>' +
      (karya.length
        ? '<div class="tablewrap"><table class="tbl"><thead><tr><th>No</th><th>Judul</th><th>Tema</th><th>Nilai</th><th>Predikat</th></tr></thead><tbody>' +
          karya.map(function (k, i) {
            var p = LS.ui.predikat(k.nilai);
            return '<tr><td>' + (i + 1) + '</td><td>' + U.esc(k.judul) + '</td><td>' + U.esc(k.temaJudul) + '</td>' +
              '<td>' + k.nilai + '</td><td>' + U.esc(p.t) + '</td></tr>';
          }).join('') + '</tbody></table></div>'
        : '<p>Belum ada karya tulis yang disimpan.</p>') +

      '<h3>D. Catatan dan tindak lanjut</h3>' +
      '<p>' + kesimpulan(st, topik).replace(/<strong>/g, '').replace(/<\/strong>/g, '') + '</p>' +
      '<p>Catatan guru: ....................................................................................................................................</p>' +
      '<p style="margin-top:2rem">Paraf guru: ............................&nbsp;&nbsp;&nbsp;&nbsp;Paraf orang tua: ............................</p>';
  }

})();
