/* ==========================================================================
   LinguaSmart — views-games.js
   Permainan: Susun Teks, Tebak Objek, Berburu Kata Sifat.
   ========================================================================== */
(function () {
  'use strict';

  var U = LS.util, S = LS.store, D = LS.data;

  /* ==================================================== DAFTAR PERMAINAN */

  var DAFTAR = [
    { id: 'susun', ico: '🧩', judul: 'Susun Teks', link: '#/permainan/susun',
      desc: 'Paragraf diacak. Susun kembali sesuai struktur: identifikasi, deskripsi bagian, lalu penutup.' },
    { id: 'tebak', ico: '🔍', judul: 'Tebak Objek', link: '#/permainan/tebak',
      desc: 'Baca kutipan deskripsi, lalu tebak objek apa yang sedang digambarkan. Ada batas waktu tiap soal!' },
    { id: 'sifat', ico: '🎯', judul: 'Berburu Kata Sifat', link: '#/permainan/sifat',
      desc: 'Klik semua kata sifat sebelum waktu habis. Hati-hati, ada kata benda dan kata kerja yang menyamar.' }
  ];

  LS.views.permainanDaftar = function (root) {
    var info = S.stats();
    root.innerHTML = LS.ui.head('Permainan', 'Belajar sambil bermain', 'Tiga permainan singkat untuk melatih struktur teks, ketelitian membaca, dan kekayaan kosakata. Setiap permainan memberi XP.') +
      '<section class="grid cols-3 game-grid">' +
      DAFTAR.map(function (g) {
        var gi = S.gameInfo(g.id);
        return '<div class="card">' +
          '<div class="ico" style="font-size:1.8rem">' + g.ico + '</div>' +
          '<h3>' + U.esc(g.judul) + '</h3>' +
          '<p class="muted">' + U.esc(g.desc) + '</p>' +
          '<div class="btn-row" style="margin-bottom:.7rem">' +
          '<span class="chip' + (gi.terbaik >= 80 ? ' ok' : '') + '">Skor terbaik: ' + (gi.main ? gi.terbaik : '—') + '</span>' +
          '<span class="chip info">' + gi.main + '× dimainkan</span>' +
          '</div>' +
          '<a class="btn btn-primary btn-sm" href="' + g.link + '">Mainkan</a>' +
          '</div>';
      }).join('') +
      '</section>' +
      '<section class="grid cols-2">' +
      '<div class="card"><div class="sec-title"><span class="ico">📈</span>Ringkasan bermain</div>' +
      '<div class="grid cols-2">' +
      LS.ui.stat('🎮', info.gameMain, 'Total permainan') +
      LS.ui.stat('🏆', info.gameTerbaik || '—', 'Skor terbaik') +
      '</div></div>' +
      '<div class="card"><div class="sec-title"><span class="ico">💡</span>Tips bermain</div>' +
      '<ul class="prompt-list">' +
      '<li>Untuk Susun Teks: cari kalimat yang menyebutkan nama dan lokasi objek — itu identifikasi.</li>' +
      '<li>Untuk Tebak Objek: perhatikan kata kunci pancaindra, misalnya "mendengung" atau "berkilau".</li>' +
      '<li>Untuk Berburu Kata Sifat: kata sifat biasanya bisa didahului kata "sangat".</li>' +
      '</ul></div>' +
      '</section>';
  };

  function hasilCard(judul, skor, catatan, tombolHtml) {
    var p = LS.ui.predikat(skor);
    return '<section class="card center">' +
      '<h2>' + U.esc(judul) + '</h2>' +
      '<div class="result-hero"><div class="big ' + p.cls + '">' + skor + '</div>' +
      '<div class="predikat">' + p.ico + ' ' + U.esc(p.t) + '</div>' +
      '<p class="muted" style="margin:.5rem 0 0">' + U.esc(catatan) + '</p></div>' +
      '<div class="btn-row center-row" style="margin-top:1rem">' + tombolHtml + '</div>' +
      '</section>';
  }

  /* ========================================================= 1. SUSUN TEKS */

  LS.views.permainanSusun = function (root) {
    pilih(root);

    function pilih(el) {
      el.innerHTML = LS.ui.head('Permainan · Susun Teks', 'Susun Paragraf Menjadi Teks Utuh', 'Pilih salah satu paket. Paragraf akan diacak dan kamu harus menyusunnya sesuai struktur teks deskripsi.') +
        '<section class="card">' +
        '<div class="sec-title"><span class="ico">📋</span>Cara bermain</div>' +
        '<ol class="steps">' +
        '<li><strong>Klik dua paragraf untuk menukar posisinya</strong>Kamu juga bisa memakai tombol ↑ dan ↓ pada tiap paragraf.</li>' +
        '<li><strong>Tekan "Periksa susunan"</strong>Setiap paragraf akan dinilai benar atau salah posisinya.</li>' +
        '<li><strong>Kejar skor 100</strong>Susunan benar semua berarti kamu sudah memahami struktur teks deskripsi.</li>' +
        '</ol></section>' +
        '<section class="grid cols-3">' +
        D.susun.map(function (pk) {
          var gi = S.gameInfo('susun');
          return '<div class="card tile"><div class="ico">🧩</div>' +
            '<h3>' + U.esc(pk.judul) + '</h3>' +
            '<p>' + pk.paragraf.length + ' paragraf · ' + U.countWords(pk.paragraf.map(function (p) { return p.teks; }).join(' ')) + ' kata</p>' +
            '<button class="btn btn-primary btn-sm" data-pk="' + pk.id + '" type="button">Mainkan paket ini</button>' +
            '</div>';
        }).join('') +
        '</section>' +
        (S.gameInfo('susun').main ? '<section class="card"><p class="muted">Skor terbaikmu pada permainan ini: <strong>' + S.gameInfo('susun').terbaik + '</strong> dari ' + S.gameInfo('susun').main + ' kali bermain.</p></section>' : '');

      el.querySelectorAll('[data-pk]').forEach(function (b) {
        b.addEventListener('click', function () { main(el, b.getAttribute('data-pk')); });
      });
    }

    function main(el, pkId) {
      var paket = null;
      D.susun.forEach(function (p) { if (p.id === pkId) paket = p; });
      var total = paket.paragraf.length;
      var urutan = U.shuffle(paket.paragraf.map(function (_, i) { return i; }));
      var terpilih = -1;
      var percobaan = 0;
      var nilai = false;

      el.innerHTML = LS.ui.head('Permainan · Susun Teks', paket.judul, paket.petunjuk) +
        '<section class="card">' +
        '<div class="hud"><span class="hud-item">🧩 ' + total + ' paragraf</span>' +
        '<span class="hud-item">🔁 Percobaan: <span id="coba">0</span></span>' +
        '<span class="spacer"></span>' +
        '<button class="btn btn-sm" id="acak" type="button">Acak ulang</button>' +
        '<button class="btn btn-sm" id="batal" type="button">Ganti paket</button></div>' +
        '<p class="muted" style="font-size:.88rem">Klik satu paragraf, lalu klik paragraf lain untuk menukar posisinya.</p>' +
        '<ul class="puzzle-list" id="daftar"></ul>' +
        '<div class="feedback" id="fb" hidden></div>' +
        '<div class="btn-row" style="margin-top:1rem">' +
        '<button class="btn btn-primary" id="periksa" type="button">Periksa susunan</button>' +
        '<button class="btn" id="kunci" type="button" hidden>Lihat kunci</button>' +
        '</div></section>';

      var daftar = el.querySelector('#daftar');
      var fb = el.querySelector('#fb');

      function gambar() {
        daftar.innerHTML = urutan.map(function (idx, pos) {
          return '<li class="puzzle-item' + (terpilih === pos ? ' sel' : '') + '" data-pos="' + pos + '">' +
            '<span class="urutan">' + (pos + 1) + '</span>' +
            '<p>' + U.esc(paket.paragraf[idx].teks) + '</p>' +
            '<span class="btn-row" style="flex-direction:column;gap:.2rem">' +
            '<button class="btn btn-sm" data-naik="' + pos + '" type="button" aria-label="Naikkan paragraf">↑</button>' +
            '<button class="btn btn-sm" data-turun="' + pos + '" type="button" aria-label="Turunkan paragraf">↓</button>' +
            '</span></li>';
        }).join('');

        daftar.querySelectorAll('.puzzle-item').forEach(function (li) {
          li.addEventListener('click', function (ev) {
            if (ev.target.closest('button')) return;
            var pos = parseInt(li.getAttribute('data-pos'), 10);
            if (terpilih === -1) { terpilih = pos; }
            else if (terpilih === pos) { terpilih = -1; }
            else {
              var t = urutan[terpilih]; urutan[terpilih] = urutan[pos]; urutan[pos] = t;
              terpilih = -1;
            }
            nilai = false; fb.hidden = true;
            gambar();
          });
        });
        daftar.querySelectorAll('[data-naik]').forEach(function (b) {
          b.addEventListener('click', function () { geser(parseInt(b.getAttribute('data-naik'), 10), -1); });
        });
        daftar.querySelectorAll('[data-turun]').forEach(function (b) {
          b.addEventListener('click', function () { geser(parseInt(b.getAttribute('data-turun'), 10), 1); });
        });
      }

      function geser(pos, arah) {
        var tujuan = pos + arah;
        if (tujuan < 0 || tujuan >= urutan.length) return;
        var t = urutan[pos]; urutan[pos] = urutan[tujuan]; urutan[tujuan] = t;
        terpilih = -1; nilai = false; fb.hidden = true;
        gambar();
      }

      gambar();

      el.querySelector('#acak').addEventListener('click', function () {
        urutan = U.shuffle(urutan); terpilih = -1; nilai = false; fb.hidden = true; gambar();
      });
      el.querySelector('#batal').addEventListener('click', function () { pilih(el); });

      el.querySelector('#periksa').addEventListener('click', function () {
        if (nilai) return;
        nilai = true; percobaan++;
        el.querySelector('#coba').textContent = percobaan;

        var benar = 0;
        urutan.forEach(function (idx, pos) { if (idx === pos) benar++; });

        daftar.querySelectorAll('.puzzle-item').forEach(function (li) {
          var pos = parseInt(li.getAttribute('data-pos'), 10);
          var ok = urutan[pos] === pos;
          li.style.borderColor = ok ? 'var(--ok)' : 'var(--err)';
          li.style.background = ok ? 'var(--ok-soft)' : 'var(--err-soft)';
        });

        var skor = Math.round((benar / total) * 100);
        fb.hidden = false;
        fb.className = 'feedback ' + (skor === 100 ? 'ok' : 'no');
        fb.innerHTML = '<strong>' + benar + ' dari ' + total + ' paragraf sudah pada posisi tepat (skor ' + skor + ').</strong>' +
          (skor === 100
            ? '<p style="margin:.4rem 0 0">Susunanmu sempurna! Urutan struktur: ' +
              paket.paragraf.map(function (p) { return p.label; }).join(' → ') + '.</p>'
            : '<p style="margin:.4rem 0 0">Ingat urutan struktur: <strong>Identifikasi → Deskripsi bagian → Penutup</strong>. ' +
              'Kalimat yang menyebut nama dan lokasi objek biasanya menjadi paragraf pertama.</p>');

        el.querySelector('#kunci').hidden = false;

        if (skor === 100) {
          S.catatGame('susun', 100);
          S.toast('Susunan sempurna!', 'Skor 100 untuk paket ' + paket.judul, 'ok');
        } else {
          S.catatGame('susun', skor);
        }
      });

      el.querySelector('#kunci').addEventListener('click', function () {
        this.disabled = true;
        urutan = paket.paragraf.map(function (_, i) { return i; });
        terpilih = -1; gambar();
        var benar = 0;
        urutan.forEach(function (idx, pos) { if (idx === pos) benar++; });
        daftar.querySelectorAll('.puzzle-item').forEach(function (li, i) {
          li.style.borderColor = 'var(--ok)';
          li.style.background = 'var(--ok-soft)';
          var tag = document.createElement('div');
          tag.className = 'struktur-tag';
          tag.textContent = paket.paragraf[i].label;
          li.insertBefore(tag, li.firstChild.nextSibling);
        });
        fb.hidden = false;
        fb.className = 'feedback ok';
        fb.innerHTML = '<strong>Kunci susunan:</strong> ' + paket.paragraf.map(function (p, i) {
          return (i + 1) + '. ' + U.esc(p.label);
        }).join(' · ') + '. Bacalah sekali lagi, lalu coba tanpa melihat kunci.';
      });
    }
  };

  /* ========================================================= 2. TEBAK OBJEK */

  LS.views.permainanTebak = function (root) {
    intro(root);

    function intro(el) {
      var gi = S.gameInfo('tebak');
      el.innerHTML = LS.ui.head('Permainan · Tebak Objek', 'Objek Apa yang Sedang Digambarkan?', 'Delapan kutipan deskripsi menantimu. Pilih objek yang paling tepat sebelum waktu 25 detik habis.') +
        '<section class="card">' +
        '<div class="sec-title"><span class="ico">🎯</span>Aturan</div>' +
        '<ul class="prompt-list">' +
        '<li>Setiap soal punya waktu 25 detik. Waktu habis berarti jawaban dianggap salah.</li>' +
        '<li>Setelah menjawab, kamu akan melihat pembahasan kata kuncinya.</li>' +
        '<li>Skor dihitung dari jumlah jawaban benar: 8 soal benar = skor 100.</li>' +
        '</ul>' +
        '<div class="btn-row" style="margin-top:1rem">' +
        '<button class="btn btn-primary btn-lg" id="mulai" type="button">Mulai bermain</button>' +
        (gi.main ? '<span class="chip">Skor terbaikmu: ' + gi.terbaik + '</span>' : '') +
        '</div></section>';
      el.querySelector('#mulai').addEventListener('click', function () { main(el); });
    }

    function main(el) {
      var soal = U.shuffle(D.tebak).slice(0, 8);
      var i = 0, benar = 0, sisa = 25, timer = null, jawabTerpilih = -1;

      LS.onCleanup(function () { if (timer) clearInterval(timer); });

      el.innerHTML = LS.ui.head('Permainan · Tebak Objek', 'Soal', 'Tebak objek dari kutipan deskripsi berikut.') +
        '<section class="card quiz-shell">' +
        '<div class="hud"><span class="hud-item">Soal <span id="no">1</span>/' + soal.length + '</span>' +
        '<span class="hud-item">✅ Benar: <span id="benar">0</span></span>' +
        '<span class="hud-item spacer">⏳ <span id="waktu">25</span>s</span></div>' +
        '<div class="timer-bar" id="tbar"><span style="width:100%"></span></div>' +
        '<div id="isi"></div>' +
        '</section>';

      var isi = el.querySelector('#isi');
      var tbar = el.querySelector('#tbar').firstChild;

      function tampil() {
        jawabTerpilih = -1;
        var s = soal[i];
        el.querySelector('#no').textContent = i + 1;
        el.querySelector('#benar').textContent = benar;
        var opsi = U.shuffle(s.opsi.map(function (o) { return { t: o, benar: o === s.jawab }; }));
        isi.innerHTML = '<div class="clue">"' + U.esc(s.kutipan) + '"</div>' +
          '<p class="q-text">Objek apa yang digambarkan pada kutipan tersebut?</p>' +
          '<div class="opts">' + opsi.map(function (o, k) {
            return '<button class="opt" type="button" data-k="' + k + '" data-benar="' + (o.benar ? '1' : '0') + '">' +
              '<span class="key">' + String.fromCharCode(65 + k) + '</span><span>' + U.esc(o.t) + '</span></button>';
          }).join('') + '</div>' +
          '<div class="feedback" id="fb" hidden></div>' +
          '<div class="btn-row" style="margin-top:.9rem"><button class="btn btn-primary" id="lanjut" type="button" hidden>Soal berikutnya →</button></div>';

        var fb = isi.querySelector('#fb');
        var lanjut = isi.querySelector('#lanjut');

        isi.querySelectorAll('.opt').forEach(function (b) {
          b.addEventListener('click', function () {
            if (jawabTerpilih !== -1) return;
            jawabTerpilih = parseInt(b.getAttribute('data-k'), 10);
            if (timer) { clearInterval(timer); timer = null; }
            var tepat = b.getAttribute('data-benar') === '1';
            if (tepat) benar++;
            isi.querySelectorAll('.opt').forEach(function (x) {
              x.disabled = true;
              if (x.getAttribute('data-benar') === '1') x.classList.add('correct');
            });
            if (!tepat) b.classList.add('wrong');
            el.querySelector('#benar').textContent = benar;
            fb.hidden = false;
            fb.className = 'feedback ' + (tepat ? 'ok' : 'no');
            fb.innerHTML = '<strong>' + (tepat ? '✅ Tepat!' : '❌ Belum tepat.') + '</strong> Jawaban: <strong>' + U.esc(s.jawab) + '</strong>.' +
              '<p style="margin:.35rem 0 0">' + U.esc(s.bahasan) + '</p>';
            lanjut.hidden = false;
            lanjut.focus();
          });
        });

        lanjut.addEventListener('click', function () {
          i++;
          if (i < soal.length) { mulaiWaktu(); tampil(); }
          else selesai();
        });

        mulaiWaktu();
      }

      function mulaiWaktu() {
        sisa = 25;
        el.querySelector('#waktu').textContent = sisa;
        tbar.style.width = '100%';
        el.querySelector('#tbar').classList.remove('low');
        if (timer) clearInterval(timer);
        timer = setInterval(function () {
          sisa--;
          var w = el.querySelector('#waktu');
          if (!w) return;
          w.textContent = Math.max(0, sisa);
          tbar.style.width = (sisa / 25 * 100) + '%';
          if (sisa <= 8) el.querySelector('#tbar').classList.add('low');
          if (sisa <= 0) {
            clearInterval(timer); timer = null;
            waktuHabis();
          }
        }, 1000);
      }

      function waktuHabis() {
        if (jawabTerpilih !== -1) return;
        jawabTerpilih = -2;
        var s = soal[i];
        isi.querySelectorAll('.opt').forEach(function (x) {
          x.disabled = true;
          if (x.getAttribute('data-benar') === '1') x.classList.add('correct');
        });
        var fb = isi.querySelector('#fb');
        fb.hidden = false;
        fb.className = 'feedback no';
        fb.innerHTML = '<strong>⏳ Waktu habis.</strong> Jawaban: <strong>' + U.esc(s.jawab) + '</strong>.' +
          '<p style="margin:.35rem 0 0">' + U.esc(s.bahasan) + '</p>';
        var lanjut = isi.querySelector('#lanjut');
        lanjut.hidden = false; lanjut.focus();
      }

      function selesai() {
        if (timer) { clearInterval(timer); timer = null; }
        var skor = Math.round((benar / soal.length) * 100);
        var catatan = 'Kamu menjawab benar ' + benar + ' dari ' + soal.length + ' soal.';
        S.catatGame('tebak', skor);
        el.innerHTML = LS.ui.head('Permainan · Tebak Objek', 'Hasil', 'Ringkasan permainan Tebak Objek.') +
          hasilCard('Hasil Tebak Objek', skor, catatan,
            '<button class="btn btn-primary" id="ulang" type="button">Main lagi</button>' +
            '<a class="btn" href="#/permainan">Daftar permainan</a>' +
            '<a class="btn" href="#/kuis">Lanjut ke kuis</a>');
        el.querySelector('#ulang').addEventListener('click', function () { main(el); });
      }

      tampil();
    }
  };

  /* ================================================= 3. BERBURU KATA SIFAT */

  LS.views.permainanSifat = function (root) {
    pilih(root);

    function pilih(el) {
      var gi = S.gameInfo('sifat');
      el.innerHTML = LS.ui.head('Permainan · Berburu Kata Sifat', 'Pilih Tingkat Kesulitan', 'Klik semua kata sifat yang muncul di papan sebelum waktu habis. Ada kata benda dan kata kerja yang menyamar sebagai kata sifat!') +
        '<section class="grid cols-3">' +
        D.sifat.level.map(function (lv) {
          var jml = lv.kata.filter(function (k) { return k.s; }).length;
          return '<div class="card tile"><div class="ico">🎯</div>' +
            '<h3>' + U.esc(lv.nama) + '</h3>' +
            '<p>' + lv.kata.length + ' kata di papan · ' + jml + ' di antaranya kata sifat</p>' +
            '<p class="muted" style="font-size:.85rem">Waktu ' + D.sifat.detik + ' detik · nilai: benar +1, salah −0,5</p>' +
            '<button class="btn btn-primary btn-sm" data-lv="' + lv.id + '" type="button">Mulai</button></div>';
        }).join('') +
        '</section>' +
        '<section class="card"><div class="sec-title"><span class="ico">🔎</span>Ciri kata sifat</div>' +
        '<ul class="prompt-list">' +
        '<li>Bisa didahului kata "sangat" atau "paling" — misalnya <em>sangat jernih</em>, <em>paling rimbun</em>.</li>' +
        '<li>Menjawab pertanyaan "bagaimana keadaan objek itu?".</li>' +
        '<li>Kata benda menjawab "apa/benda apa" (meja, sungai), kata kerja menjawab "sedang melakukan apa" (berlari, menari).</li>' +
        '</ul>' +
        (gi.main ? '<p class="muted" style="margin-top:.6rem">Skor terbaikmu: <strong>' + gi.terbaik + '</strong></p>' : '') +
        '</section>';

      el.querySelectorAll('[data-lv]').forEach(function (b) {
        b.addEventListener('click', function () { main(el, b.getAttribute('data-lv')); });
      });
    }

    function main(el, lvId) {
      var lv = null;
      D.sifat.level.forEach(function (x) { if (x.id === lvId) lv = x; });
      var kata = U.shuffle(lv.kata);
      var totalSifat = lv.kata.filter(function (k) { return k.s; }).length;
      var benar = 0, salah = 0, sisa = D.sifat.detik, timer = null, berakhir = false;

      LS.onCleanup(function () { if (timer) clearInterval(timer); });

      el.innerHTML = LS.ui.head('Permainan · Berburu Kata Sifat', lv.nama, 'Klik semua kata sifat. Jangan terkecoh kata benda atau kata kerja.') +
        '<section class="card">' +
        '<div class="hud"><span class="hud-item">🎯 Sifat ditemukan: <span id="hbenar">0</span>/' + totalSifat + '</span>' +
        '<span class="hud-item">❌ Salah klik: <span id="hsalah">0</span></span>' +
        '<span class="hud-item spacer">⏳ <span id="hwaktu">' + sisa + '</span>s</span></div>' +
        '<div class="timer-bar" id="tbar"><span style="width:100%"></span></div>' +
        '<div class="wordgrid" id="papan"></div>' +
        '<div class="feedback" id="fb" hidden></div>' +
        '<div class="btn-row" style="margin-top:1rem"><button class="btn" id="stop" type="button">Sudahi dan lihat hasil</button></div>' +
        '</section>';

      var papan = el.querySelector('#papan');
      var fb = el.querySelector('#fb');
      var tbar = el.querySelector('#tbar').firstChild;

      papan.innerHTML = kata.map(function (k, i) {
        return '<button class="word-btn" type="button" data-i="' + i + '">' + U.esc(k.w) + '</button>';
      }).join('');

      papan.querySelectorAll('.word-btn').forEach(function (b) {
        b.addEventListener('click', function () {
          if (berakhir) return;
          var i = parseInt(b.getAttribute('data-i'), 10);
          var k = kata[i];
          b.disabled = true;
          if (k.s) {
            benar++;
            b.classList.add('picked');
            b.textContent = '✔ ' + k.w;
          } else {
            salah++;
            b.classList.add('wrong');
            b.textContent = '✘ ' + k.w;
          }
          el.querySelector('#hbenar').textContent = benar;
          el.querySelector('#hsalah').textContent = salah;
          fb.hidden = false;
          fb.className = 'feedback ' + (k.s ? 'ok' : 'no');
          fb.innerHTML = k.s
            ? '<strong>Benar.</strong> "' + U.esc(k.w) + '" adalah kata sifat.'
            : '<strong>Bukan kata sifat.</strong> "' + U.esc(k.w) + '" bukan kata sifat, melainkan kata ' +
              (['berlari', 'menulis', 'menari', 'berjalan', 'menggema'].indexOf(k.w) !== -1 ? 'kerja' : 'benda') + '.';
          if (benar === totalSifat) selesai('Semua kata sifat berhasil kamu temukan!');
        });
      });

      timer = setInterval(function () {
        sisa--;
        var w = el.querySelector('#hwaktu');
        if (!w) return;
        w.textContent = Math.max(0, sisa);
        tbar.style.width = (sisa / D.sifat.detik * 100) + '%';
        if (sisa <= 15) el.querySelector('#tbar').classList.add('low');
        if (sisa <= 0) selesai('Waktu habis.');
      }, 1000);

      el.querySelector('#stop').addEventListener('click', function () { selesai('Permainan dihentikan.'); });

      function selesai(pesan) {
        if (berakhir) return;
        berakhir = true;
        if (timer) { clearInterval(timer); timer = null; }

        // tandai kata sifat yang terlewat
        papan.querySelectorAll('.word-btn').forEach(function (b) {
          var k = kata[parseInt(b.getAttribute('data-i'), 10)];
          if (k.s && !b.classList.contains('picked')) {
            b.classList.add('missed');
            b.textContent = '○ ' + k.w;
            b.disabled = true;
          }
        });

        var nilai = Math.max(0, Math.min(100, Math.round(((benar - salah * 0.5) / totalSifat) * 100)));
        S.catatGame('sifat', nilai);
        var catatan = pesan + ' Benar ' + benar + '/' + totalSifat + ', salah klik ' + salah + '. Lingkaran kuning adalah kata sifat yang terlewat.';

        var ringkas = hasilCard('Hasil Berburu Kata Sifat', nilai, catatan,
          '<button class="btn btn-primary" id="ulang" type="button">Main lagi</button>' +
          '<button class="btn" id="gantilv" type="button">Ganti level</button>' +
          '<a class="btn" href="#/permainan">Daftar permainan</a>');

        var lewat = kata.filter(function (k) { return k.s; }).map(function (k) { return k.w; });
        var el2 = document.createElement('div');
        el2.innerHTML = ringkas;
        el.appendChild(el2);
        var ulang = el2.querySelector('#ulang');
        ulang.addEventListener('click', function () { main(el, lvId); });
        el2.querySelector('#gantilv').addEventListener('click', function () { pilih(el); });
      }
    }
  };

})();
