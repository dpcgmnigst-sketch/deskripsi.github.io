/* ==========================================================================
   LinguaSmart — views-kuis.js
   Kuis teks deskripsi: mode Latihan (pembahasan langsung) dan mode Ujian
   (batas waktu, pembahasan di akhir, navigasi soal).
   ========================================================================== */
(function () {
  'use strict';

  var U = LS.util, S = LS.store, D = LS.data;

  var MODE = {
    latihan: { nama: 'Latihan Cepat', jumlah: 10, detik: 0, umpanBalik: true,
      desc: 'Sepuluh soal acak. Setiap jawaban langsung diberi pembahasan supaya kamu cepat paham.' },
    ujian: { nama: 'Ujian Akhir', jumlah: 20, detik: 15 * 60, umpanBalik: false,
      desc: 'Dua puluh soal dengan batas waktu 15 menit. Pembahasan dan nilai muncul setelah ujian selesai.' }
  };

  var MATERI_TERKAIT = {
    'Konsep Dasar': ['m1'],
    'Struktur Teks': ['m2'],
    'Kaidah Kebahasaan': ['m3'],
    'Analisis Teks': ['m4', 'm6']
  };

  var modeSekarang = null;   // diisi saat kuis berjalan, dibaca hasil()

  /* ============================================================== INTRO */

  LS.views.kuis = function (root) {
    intro(root);
  };

  function intro(el) {
    var st = S.stats();
    var topikAkurasi = S.akurasiTopik();
    var terlemah = S.topikTerlemah();

    el.innerHTML = LS.ui.head('Kuis', 'Uji Pemahamanmu', 'Pilih mode kuis. Semua soal diacak setiap kali dimainkan, lengkap dengan pembahasan jawaban.') +
      '<section class="grid cols-2">' +
      ['latihan', 'ujian'].map(function (k) {
        var m = MODE[k];
        return '<div class="card tile">' +
          '<div class="ico">' + (k === 'latihan' ? '⚡' : '🎓') + '</div>' +
          '<h3>' + U.esc(m.nama) + '</h3>' +
          '<p>' + U.esc(m.desc) + '</p>' +
          '<ul class="prompt-list" style="margin-bottom:.8rem">' +
          '<li>Jumlah soal: <strong>' + m.jumlah + '</strong> (acak dari ' + D.kuis.length + ' soal)</li>' +
          '<li>Waktu: <strong>' + (m.detik ? U.fmtDurasi(m.detik) : 'tanpa batas') + '</strong></li>' +
          '<li>Pembahasan: <strong>' + (m.umpanBalik ? 'setiap soal' : 'setelah selesai') + '</strong></li>' +
          '<li>Skor kelulusan: <strong>80</strong></li>' +
          '</ul>' +
          '<button class="btn btn-primary" data-mode="' + k + '" type="button">Mulai ' + U.esc(m.nama) + '</button>' +
          '</div>';
      }).join('') +
      '</section>' +

      '<section class="grid cols-2">' +
      '<div class="card"><div class="sec-title"><span class="ico">📊</span>Rekap hasilmu</div>' +
      '<div class="grid cols-2">' +
      LS.ui.stat('📝', st.kuisDiikuti, 'Kuis diikuti') +
      LS.ui.stat('🏆', st.kuisTerbaik || '—', 'Skor terbaik') +
      '</div>' +
      (topikAkurasi.length ? '<div style="margin-top:1rem">' + topikAkurasi.map(function (t) {
        var cls = t.persen >= 80 ? 'baik' : (t.persen >= 60 ? '' : 'remedial');
        return '<div class="bar-row ' + cls + '"><span>' + U.esc(t.nama) + '</span>' +
          '<span class="bar"><span style="width:' + t.persen + '%"></span></span>' +
          '<span>' + t.persen + '%</span></div>';
      }).join('') + '</div>' : '<p class="muted">Belum ada data. Kerjakan kuis pertamamu untuk melihat analisis per topik.</p>') +
      '</div>' +

      '<div class="card"><div class="sec-title"><span class="ico">🎯</span>Saran belajar</div>' +
      (terlemah
        ? '<p>Topik terlemahmu saat ini: <strong>' + U.esc(terlemah.nama) + '</strong> (' + terlemah.persen + '% benar). Baca ulang materi terkait sebelum mencoba lagi.</p>' +
          '<div class="btn-row">' + (MATERI_TERKAIT[terlemah.nama] || []).map(function (mid) {
            var m = null;
            D.materi.forEach(function (x) { if (x.id === mid) m = x; });
            return m ? '<a class="btn btn-sm" href="#/materi/' + m.id + '">📘 ' + U.esc(m.judul) + '</a>' : '';
          }).join('') + '</div>'
        : '<p class="muted">Kerjakan satu kuis dulu, lalu halaman ini akan menampilkan topik yang perlu kamu perkuat.</p>') +
      '<div class="sec-title" style="margin-top:1.2rem"><span class="ico">📜</span>Riwayat terakhir</div>' +
      (S.get().kuis.riwayat.length
        ? '<div class="tablewrap"><table class="tbl"><thead><tr><th>Tanggal</th><th>Mode</th><th>Benar</th><th>Skor</th><th>Predikat</th></tr></thead><tbody>' +
          S.get().kuis.riwayat.slice(0, 8).map(function (r) {
            var p = LS.ui.predikat(r.skor);
            return '<tr><td>' + U.fmtTanggal(r.tanggal) + '</td><td>' + U.esc(r.mode) + '</td>' +
              '<td>' + r.benar + '/' + r.total + '</td><td><strong>' + r.skor + '</strong></td>' +
              '<td>' + p.ico + ' ' + U.esc(p.t) + '</td></tr>';
          }).join('') + '</tbody></table></div>'
        : '<p class="muted">Belum ada riwayat kuis.</p>') +
      '</div>' +
      '</section>';

    el.querySelectorAll('[data-mode]').forEach(function (b) {
      b.addEventListener('click', function () { mulai(el, b.getAttribute('data-mode')); });
    });
  }

  /* ============================================================== KUIS */

  function mulai(el, mode) {
    var cfg = MODE[mode];
    var soal = U.shuffle(D.kuis).slice(0, cfg.jumlah);
    var opsiAcak = soal.map(function (s) {
      return U.shuffle(s.opsi.map(function (_, i) { return i; }));
    });
    var jawaban = soal.map(function () { return -1; });
    var idx = 0, benar = 0, sisa = cfg.detik, timer = null, berakhir = false;

    LS.onCleanup(function () { if (timer) clearInterval(timer); });

    el.innerHTML = LS.ui.head('Kuis · ' + cfg.nama, mode === 'ujian' ? 'Ujian Akhir' : 'Latihan Cepat', cfg.desc) +
      '<section class="card quiz-shell">' +
      '<div class="hud">' +
      '<span class="hud-item">Soal <span id="no">1</span>/' + soal.length + '</span>' +
      (cfg.umpanBalik ? '<span class="hud-item">✅ Benar: <span id="hbenar">0</span></span>' : '<span class="hud-item">📋 Terjawab: <span id="hjawab">0</span>/' + soal.length + '</span>') +
      (cfg.detik ? '<span class="hud-item spacer">⏳ <span id="waktu">' + U.fmtDurasi(sisa) + '</span></span>' : '<span class="spacer"></span>') +
      '</div>' +
      LS.ui.bar(0, '') +
      '<div id="isi" style="margin-top:1rem"></div>' +
      '<div id="navUjian" style="margin-top:1rem"></div>' +
      '</section>';

    var isi = el.querySelector('#isi');
    var navUjian = el.querySelector('#navUjian');
    var bar = el.querySelector('.progress').firstChild;

    if (cfg.detik) {
      timer = setInterval(function () {
        sisa--;
        var w = el.querySelector('#waktu');
        if (!w) return;
        w.textContent = U.fmtDurasi(Math.max(0, sisa));
        if (sisa <= 0) { clearInterval(timer); timer = null; selesai(true); }
      }, 1000);
    }

    function gambar() {
      var s = soal[idx];
      el.querySelector('#no').textContent = idx + 1;
      bar.style.width = ((idx) / soal.length * 100) + '%';

      var opsi = opsiAcak[idx].map(function (origI, k) {
        return { teks: s.opsi[origI], i: origI, k: k };
      });
      var sudah = jawaban[idx] !== -1;

      isi.innerHTML = '<div class="q-head">' +
        '<span class="chip info">' + U.esc(s.topik) + '</span>' +
        '<span class="spacer"></span>' +
        (sudah && cfg.umpanBalik ? '<span class="chip ' + (jawaban[idx] === s.jawab ? 'ok' : 'err') + '">' +
          (jawaban[idx] === s.jawab ? '✔ Benar' : '✘ Salah') + '</span>' : '') +
        '</div>' +
        '<p class="q-text">' + U.esc(s.soal) + '</p>' +
        '<div class="opts">' + opsi.map(function (o) {
          var cls = '';
          if (cfg.umpanBalik && sudah) {
            if (o.i === s.jawab) cls = ' correct';
            else if (o.i === jawaban[idx]) cls = ' wrong';
          } else if (sudah && o.i === jawaban[idx]) {
            cls = ' correct';
          }
          return '<button class="opt' + cls + '" type="button" data-i="' + o.i + '"' +
            ((cfg.umpanBalik && sudah) ? ' disabled' : '') + '>' +
            '<span class="key">' + String.fromCharCode(65 + o.k) + '</span><span>' + U.esc(o.teks) + '</span></button>';
        }).join('') + '</div>' +
        (cfg.umpanBalik && sudah
          ? '<div class="feedback ' + (jawaban[idx] === s.jawab ? 'ok' : 'no') + '">' +
            '<strong>' + (jawaban[idx] === s.jawab ? '✅ Jawabanmu benar.' : '❌ Jawabanmu belum tepat. Jawaban benar: ' + U.esc(s.opsi[s.jawab]) + '.') + '</strong>' +
            '<p style="margin:.35rem 0 0">' + U.esc(s.bahasan) + '</p></div>'
          : '') +
        '<div class="btn-row" style="margin-top:1rem">' +
        (idx > 0 ? '<button class="btn" id="prev" type="button">← Sebelumnya</button>' : '') +
        '<span class="spacer" style="margin-left:auto"></span>' +
        '<button class="btn btn-primary" id="next" type="button"' + (cfg.umpanBalik ? (sudah ? '' : ' disabled') : '') + '>' +
        (idx === soal.length - 1 ? (mode === 'ujian' ? 'Selesai & nilai' : 'Lihat hasil') : 'Soal berikutnya →') +
        '</button></div>';

      isi.querySelectorAll('.opt').forEach(function (b) {
        b.addEventListener('click', function () {
          var i = parseInt(b.getAttribute('data-i'), 10);
          if (cfg.umpanBalik && jawaban[idx] !== -1) return;
          jawaban[idx] = i;
          if (cfg.umpanBalik) {
            if (i === s.jawab) benar++;
            el.querySelector('#hbenar').textContent = benar;
          }
          perbaruiNavigasi();
          gambar();
        });
      });

      var next = isi.querySelector('#next');
      next.addEventListener('click', function () {
        if (idx === soal.length - 1) selesai(false);
        else { idx++; gambar(); }
      });

      var prev = isi.querySelector('#prev');
      if (prev) prev.addEventListener('click', function () { idx--; gambar(); });

      if (cfg.umpanBalik && sudah) next.focus();
      perbaruiNavigasi();
    }

    function perbaruiNavigasi() {
      var terjawab = jawaban.filter(function (j) { return j !== -1; }).length;
      var hj = el.querySelector('#hjawab');
      if (hj) hj.textContent = terjawab;

      if (mode !== 'ujian') { navUjian.innerHTML = ''; return; }
      navUjian.innerHTML = '<p class="muted" style="font-size:.85rem;margin-bottom:.4rem">Navigasi soal — klik untuk berpindah. Soal bertanda ✓ sudah dijawab.</p>' +
        '<div class="btn-row">' + soal.map(function (_, i) {
          return '<button class="btn btn-sm' + (i === idx ? ' btn-primary' : '') + '" data-nav="' + i + '" type="button">' +
            (i + 1) + (jawaban[i] !== -1 ? ' ✓' : '') + '</button>';
        }).join('') + '</div>' +
        '<div class="btn-row" style="margin-top:.8rem"><button class="btn btn-accent" id="selesaiUjian" type="button">Selesai & nilai sekarang</button></div>';

      navUjian.querySelectorAll('[data-nav]').forEach(function (b) {
        b.addEventListener('click', function () { idx = parseInt(b.getAttribute('data-nav'), 10); gambar(); });
      });
      var su = navUjian.querySelector('#selesaiUjian');
      if (su) su.addEventListener('click', function () {
        var belum = jawaban.filter(function (j) { return j === -1; }).length;
        if (belum > 0) {
          LS.modal.open({
            title: 'Masih ada ' + belum + ' soal belum dijawab',
            html: '<p>Soal yang tidak dijawab dihitung salah. Yakin ingin menyelesaikan ujian sekarang?</p>',
            buttons: [
              { label: 'Kembali mengerjakan', cls: '' },
              { label: 'Ya, nilai sekarang', cls: 'btn-primary', onClick: function () { selesai(false); } }
            ]
          });
        } else selesai(false);
      });
    }

    /* ---------------- hasil ---------------- */
    function selesai(waktuHabis) {
      if (berakhir) return;
      berakhir = true;
      if (timer) { clearInterval(timer); timer = null; }

      var benarAkhir = 0;
      var topik = {};
      soal.forEach(function (s, i) {
        var t = topik[s.topik] || { benar: 0, total: 0 };
        t.total++;
        var tepat = jawaban[i] === s.jawab;
        if (tepat) { benarAkhir++; t.benar++; }
        topik[s.topik] = t;
      });

      var skor = Math.round((benarAkhir / soal.length) * 100);
      var p = LS.ui.predikat(skor);
      var xp = S.XP.perJawabanBenar * benarAkhir + S.XP.kuisSelesai + (skor >= 80 ? 20 : 0);

      S.catatKuis({ mode: cfg.nama, benar: benarAkhir, total: soal.length, skor: skor, nilai: skor, topik: topik });
      S.addXp(xp, 'Kuis ' + cfg.nama + ' — skor ' + skor);

      var materiSaran = [];
      Object.keys(topik).forEach(function (t) {
        var persen = Math.round((topik[t].benar / topik[t].total) * 100);
        if (persen < 80) (MATERI_TERKAIT[t] || []).forEach(function (mid) {
          if (materiSaran.indexOf(mid) === -1) materiSaran.push(mid);
        });
      });

      el.innerHTML = LS.ui.head('Kuis · ' + cfg.nama, 'Hasil ' + cfg.nama, waktuHabis ? 'Waktu habis — jawabanmu tetap dinilai.' : 'Berikut hasil dan pembahasan lengkapnya.') +
        '<section class="card center">' +
        '<div class="result-hero"><div class="big ' + p.cls + '">' + skor + '</div>' +
        '<div class="predikat">' + p.ico + ' ' + U.esc(p.t) + '</div>' +
        '<p class="muted" style="margin:.5rem 0 0">Benar ' + benarAkhir + ' dari ' + soal.length + ' soal · +' + xp + ' XP' +
        (skor >= 80 ? ' · <strong>lulus</strong>' : ' · belum lulus (minimal 80)') + '</p></div>' +
        '<div class="btn-row center-row" style="margin-top:1rem">' +
        '<button class="btn btn-primary" id="ulang" type="button">Ulangi ' + U.esc(cfg.nama) + '</button>' +
        '<button class="btn" id="ganti" type="button">Pilih mode lain</button>' +
        '<a class="btn" href="#/evaluasi">Lihat evaluasi</a>' +
        '</div>' +
        '</section>' +

        '<section class="grid cols-2">' +
        '<div class="card"><div class="sec-title"><span class="ico">📊</span>Analisis per topik</div>' +
        Object.keys(topik).map(function (t) {
          var persen = Math.round((topik[t].benar / topik[t].total) * 100);
          var cls = persen >= 80 ? 'baik' : (persen >= 60 ? '' : 'remedial');
          return '<div class="bar-row ' + cls + '"><span>' + U.esc(t) + '</span>' +
            '<span class="bar"><span style="width:' + persen + '%"></span></span>' +
            '<span>' + persen + '%</span></div>';
        }).join('') +
        '</div>' +
        '<div class="card"><div class="sec-title"><span class="ico">🎯</span>Tindak lanjut</div>' +
        (materiSaran.length
          ? '<p>Topik berikut masih perlu diperkuat. Baca ulang materinya, lalu kerjakan kuis lagi.</p><div class="btn-row">' +
            materiSaran.map(function (mid) {
              var m = null;
              D.materi.forEach(function (x) { if (x.id === mid) m = x; });
              return m ? '<a class="btn btn-sm" href="#/materi/' + m.id + '">📘 ' + U.esc(m.judul) + '</a>' : '';
            }).join('') + '</div>'
          : '<p>Semua topik sudah kamu kuasai dengan baik (≥ 80%). Pertahankan dengan mencoba mode Ujian Akhir atau lanjut ke tantangan menulis.</p>' +
            '<div class="btn-row"><a class="btn btn-sm btn-primary" href="#/tantangan">✍️ Tantangan menulis</a>' +
            '<a class="btn btn-sm" href="#/permainan">🎮 Permainan</a></div>') +
        '</div>' +
        '</section>' +

        '<section class="card"><div class="sec-title"><span class="ico">📝</span>Pembahasan semua soal</div>' +
        '<ul class="review-list">' + soal.map(function (s, i) {
          var ok = jawaban[i] === s.jawab;
          var pilih = jawaban[i] >= 0 ? U.esc(s.opsi[jawaban[i]]) : '<em>tidak dijawab</em>';
          return '<li class="' + (ok ? 'ok' : 'no') + '">' +
            '<div class="q">' + (i + 1) + '. ' + U.esc(s.soal) + ' <span class="chip info">' + U.esc(s.topik) + '</span></div>' +
            '<div class="ans">Jawabanmu: <span class="' + (ok ? 'baik' : 'buruk') + '">' + pilih + '</span>' +
            (ok ? '' : ' · Jawaban benar: <span class="baik">' + U.esc(s.opsi[s.jawab]) + '</span>') + '</div>' +
            '<div class="bahas">💡 ' + U.esc(s.bahasan) + '</div>' +
            '</li>';
        }).join('') + '</ul></section>';

      el.querySelector('#ulang').addEventListener('click', function () { mulai(el, mode); });
      el.querySelector('#ganti').addEventListener('click', function () { intro(el); });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    gambar();
  }

})();
