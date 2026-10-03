/* ==========================================================================
   LinguaSmart — store.js
   Penyimpanan progres (localStorage), XP, level, badge, log aktivitas,
   serta utilitas umum (toast, modal, helper).
   ========================================================================== */
window.LS = window.LS || {};

(function () {
  'use strict';

  var KEY = 'linguasmart.v1';

  /* ---------------------------------------------------------------- utils */

  var util = {
    esc: function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    /** Tandai (warnai) potongan teks tertentu di dalam teks yang sudah di-escape. */
    mark: function (teks, daftar, kelas) {
      var out = util.esc(teks);
      (daftar || []).forEach(function (k) {
        if (!k) return;
        var pola = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        out = out.replace(new RegExp('(^|[^\\w-])(' + pola + ')(?![\\w-])', 'gi'),
          '$1<span class="' + (kelas || 'hl') + '">$2</span>');
      });
      return out;
    },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    },
    sample: function (arr, n) { return util.shuffle(arr).slice(0, n); },
    clamp: function (v, min, max) { return Math.max(min, Math.min(max, v)); },
    /** Buang tanda baca & jadikan huruf kecil. */
    norm: function (s) {
      return String(s || '').toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    },
    words: function (s) {
      var n = util.norm(s);
      return n ? n.split(' ') : [];
    },
    countWords: function (s) { return util.words(s).length; },
    fmtTanggal: function (iso) {
      if (!iso) return '-';
      var d = new Date(iso);
      if (isNaN(d.getTime())) return '-';
      var bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
    },
    fmtWaktu: function (iso) {
      if (!iso) return '-';
      var d = new Date(iso);
      if (isNaN(d.getTime())) return '-';
      var p = function (n) { return (n < 10 ? '0' : '') + n; };
      return p(d.getHours()) + ':' + p(d.getMinutes());
    },
    fmtDurasi: function (detik) {
      var m = Math.floor(detik / 60), s = detik % 60;
      return (m > 0 ? m + ' m ' : '') + s + ' s';
    },
    uid: function () {
      return 'k' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
    },
    unduh: function (namaFile, isi, tipe) {
      try {
        var blob = new Blob([isi], { type: (tipe || 'text/plain') + ';charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = namaFile;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
        return true;
      } catch (e) { return false; }
    }
  };

  /* ------------------------------------------------------------- level & XP */

  var LEVELS = [
    { level: 1, min: 0, judul: 'Pemula Deskripsi', ico: '🌱' },
    { level: 2, min: 150, judul: 'Pengamat Objek', ico: '🔍' },
    { level: 3, min: 350, judul: 'Perangkai Kalimat', ico: '🧵' },
    { level: 4, min: 600, judul: 'Penulis Muda', ico: '✍️' },
    { level: 5, min: 900, judul: 'Maestro Deskripsi', ico: '🎖️' },
    { level: 6, min: 1300, judul: 'Ahli Bahasa', ico: '👑' }
  ];

  var XP = {
    materi: 10,
    contoh: 8,
    gameMain: 10,
    karyaSimpan: 40,
    refleksi: 15,
    kuisSelesai: 15,
    perJawabanBenar: 5
  };

  /* -------------------------------------------------------------- default state */

  function stateBaru() {
    return {
      versi: 1,
      siswa: { nama: '', kelas: '' },
      xp: 0,
      badge: [],
      materi: [],
      contoh: [],
      game: {},                          // id -> { main: n, terbaik: 0 }
      kuis: { riwayat: [], topik: {} },  // riwayat: [{tanggal, mode, benar, total, skor, nilai}]
      karya: [],                         // [{id, judul, tema, teks:{...}, skor, nilai, tanggal}]
      log: []
    };
  }

  var state = stateBaru();
  var bisaSimpan = true;

  function muat() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      var dasar = stateBaru();
      // gabungkan agar tetap aman bila struktur berubah
      Object.keys(dasar).forEach(function (k) {
        if (data[k] === undefined) data[k] = dasar[k];
      });
      if (!data.kuis || typeof data.kuis !== 'object') data.kuis = dasar.kuis;
      if (!Array.isArray(data.kuis.riwayat)) data.kuis.riwayat = [];
      if (!data.kuis.topik) data.kuis.topik = {};
      ['badge', 'materi', 'contoh', 'karya', 'log'].forEach(function (k) {
        if (!Array.isArray(data[k])) data[k] = dasar[k];
      });
      if (!data.game || typeof data.game !== 'object') data.game = {};
      state = data;
    } catch (e) {
      bisaSimpan = false;
      console.warn('LinguaSmart: gagal memuat progres.', e);
    }
  }

  function simpan() {
    if (!bisaSimpan) return false;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      bisaSimpan = false;
      console.warn('LinguaSmart: gagal menyimpan progres.', e);
      return false;
    }
  }

  /* ------------------------------------------------------------------ toast */

  function toast(judul, pesan, tipe) {
    var box = document.getElementById('toasts');
    if (!box) return;
    var el = document.createElement('div');
    el.className = 'toast ' + (tipe || '');
    el.innerHTML = '<strong>' + util.esc(judul) + '</strong>' +
      (pesan ? '<span>' + util.esc(pesan) + '</span>' : '');
    box.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transition = 'opacity .3s';
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
    }, 3400);
  }

  /* ------------------------------------------------------------------ modal */

  var modal = {
    open: function (opsi) {
      var root = document.getElementById('modalRoot');
      if (!root) return;
      var o = opsi || {};
      var html = '<div class="modal" role="dialog" aria-modal="true">' +
        '<h3>' + util.esc(o.title || '') + '</h3>' +
        '<div class="modal-body">' + (o.html || '') + '</div>' +
        '<div class="btn-row"></div></div>';
      root.innerHTML = html;
      root.hidden = false;
      var row = root.querySelector('.btn-row');
      (o.buttons || [{ label: 'Tutup', cls: 'btn-primary' }]).forEach(function (b) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn ' + (b.cls || '');
        btn.textContent = b.label;
        btn.addEventListener('click', function () {
          var lanjut = true;
          if (typeof b.onClick === 'function') lanjut = b.onClick(root) !== false;
          if (lanjut) modal.close();
        });
        row.appendChild(btn);
      });
      var first = root.querySelector('.modal button, .modal input, .modal textarea');
      if (first) first.focus();
      root.onclick = function (ev) { if (ev.target === root) modal.close(); };
      document.addEventListener('keydown', escTutup);
      return root;
    },
    close: function () {
      var root = document.getElementById('modalRoot');
      if (!root) return;
      root.hidden = true;
      root.innerHTML = '';
      document.removeEventListener('keydown', escTutup);
    }
  };

  function escTutup(ev) { if (ev.key === 'Escape') modal.close(); }

  /* ------------------------------------------------------------------ badge */

  var BADGES = [
    { id: 'pembaca', nama: 'Pembaca Teliti', ico: '📖', desc: 'Membaca 6 bab materi.',
      cek: function (s) { return s.materi.length >= 6; } },
    { id: 'penjelajah-teks', nama: 'Penjelajah Teks', ico: '🔎', desc: 'Membaca 5 contoh teks deskripsi.',
      cek: function (s) { return s.contoh.length >= 5; } },
    { id: 'juara-kuis', nama: 'Juara Kuis', ico: '🏆', desc: 'Mendapat skor kuis minimal 80.',
      cek: function (s) { return s.kuis.riwayat.some(function (r) { return r.skor >= 80; }); } },
    { id: 'sempurna', nama: 'Nilai Sempurna', ico: '💯', desc: 'Menjawab semua soal kuis dengan benar.',
      cek: function (s) { return s.kuis.riwayat.some(function (r) { return r.skor === 100; }); } },
    { id: 'ahli-struktur', nama: 'Ahli Struktur', ico: '🧩', desc: 'Menyusun teks dengan skor sempurna.',
      cek: function (s) { return (s.game.susun && s.game.susun.terbaik >= 100); } },
    { id: 'jago-game', nama: 'Jagoan Permainan', ico: '🕹️', desc: 'Skor permainan minimal 90.',
      cek: function (s) {
        return Object.keys(s.game).some(function (k) { return s.game[k].terbaik >= 90; });
      } },
    { id: 'penjelajah-game', nama: 'Penjelajah Permainan', ico: '🎮', desc: 'Memainkan ketiga permainan.',
      cek: function (s) { return ['susun', 'tebak', 'sifat'].every(function (k) { return s.game[k]; }); } },
    { id: 'penulis', nama: 'Penulis Muda', ico: '✍️', desc: 'Menyimpan satu karya tulis.',
      cek: function (s) { return s.karya.length >= 1; } },
    { id: 'produktif', nama: 'Penulis Produktif', ico: '📚', desc: 'Menyimpan tiga karya tulis.',
      cek: function (s) { return s.karya.length >= 3; } },
    { id: 'kolektor', nama: 'Kolektor XP', ico: '💎', desc: 'Mengumpulkan 500 XP.',
      cek: function (s) { return s.xp >= 500; } },
    { id: 'bintang', nama: 'Bintang LinguaSmart', ico: '⭐', desc: 'Mencapai level 5.',
      cek: function (s) { return store.levelInfo(s.xp).level >= 5; } },
    { id: 'tuntas', nama: 'Tuntas Belajar', ico: '🎓', desc: 'Membaca semua materi dan skor kuis ≥ 80.',
      cek: function (s) {
        return s.materi.length >= 6 && s.kuis.riwayat.some(function (r) { return r.skor >= 80; });
      } }
  ];

  /* ------------------------------------------------------------------ store */

  var store = {
    util: util,
    LEVELS: LEVELS,
    XP: XP,
    BADGES: BADGES,
    toast: toast,
    modal: modal,

    get: function () { return state; },
    keys: { KEY: KEY },
    bisaSimpan: function () { return bisaSimpan; },

    simpan: simpan,

    reset: function () {
      state = stateBaru();
      simpan();
    },

    importData: function (obj) {
      if (!obj || typeof obj !== 'object') return false;
      var dasar = stateBaru();
      Object.keys(dasar).forEach(function (k) { if (obj[k] === undefined) obj[k] = dasar[k]; });
      state = obj;
      simpan();
      return true;
    },

    setSiswa: function (nama, kelas) {
      state.siswa.nama = nama || '';
      state.siswa.kelas = kelas || '';
      simpan();
    },

    /* --- XP & level --- */
    levelInfo: function (xp) {
      var nilai = (xp == null ? state.xp : xp);
      var idx = 0;
      for (var i = 0; i < LEVELS.length; i++) if (nilai >= LEVELS[i].min) idx = i;
      var now = LEVELS[idx];
      var next = LEVELS[idx + 1] || null;
      var persen = next
        ? Math.round(((nilai - now.min) / (next.min - now.min)) * 100)
        : 100;
      return {
        level: now.level, judul: now.judul, ico: now.ico, min: now.min,
        next: next, persen: util.clamp(persen, 0, 100),
        sisaKeNext: next ? Math.max(0, next.min - nilai) : 0
      };
    },

    addXp: function (jumlah, alasan) {
      jumlah = Math.max(0, Math.round(jumlah || 0));
      if (!jumlah) return;
      var sebelum = store.levelInfo(state.xp).level;
      state.xp += jumlah;
      var sesudah = store.levelInfo(state.xp);
      if (alasan) store.addLog('⭐', '+' + jumlah + ' XP · ' + alasan);
      if (sesudah.level > sebelum) {
        toast(sesudah.ico + ' Naik ke Level ' + sesudah.level + '!', 'Gelar baru: ' + sesudah.judul, 'xp');
        store.addLog('🎉', 'Naik ke Level ' + sesudah.level + ' — ' + sesudah.judul);
      } else {
        toast('+' + jumlah + ' XP', alasan || '', 'xp');
      }
      simpan();
      store.cekBadge();
      if (window.LS.refreshXp) window.LS.refreshXp();
    },

    addLog: function (ikon, teks) {
      state.log.unshift({ ikon: ikon, teks: teks, tanggal: new Date().toISOString() });
      if (state.log.length > 60) state.log.length = 60;
      simpan();
    },

    /* --- penanda bacaan --- */
    tandaiMateri: function (id) {
      if (state.materi.indexOf(id) === -1) {
        state.materi.push(id);
        simpan();
        store.addXp(XP.materi, 'Membaca materi');
        return true;
      }
      return false;
    },
    tandaiContoh: function (id) {
      if (state.contoh.indexOf(id) === -1) {
        state.contoh.push(id);
        simpan();
        store.addXp(XP.contoh, 'Membaca contoh teks');
        return true;
      }
      return false;
    },
    sudahBacaMateri: function (id) { return state.materi.indexOf(id) !== -1; },
    sudahBacaContoh: function (id) { return state.contoh.indexOf(id) !== -1; },

    /* --- permainan --- */
    catatGame: function (id, skor, dapatXp) {
      var g = state.game[id] || { main: 0, terbaik: 0 };
      g.main += 1;
      g.terbaik = Math.max(g.terbaik, Math.round(skor));
      g.terakhir = Math.round(skor);
      state.game[id] = g;
      simpan();
      if (dapatXp !== false) store.addXp(XP.gameMain + Math.round(skor / 2), 'Bermain ' + id);
      store.cekBadge();
      return g;
    },
    gameInfo: function (id) { return state.game[id] || { main: 0, terbaik: 0, terakhir: 0 }; },

    /* --- kuis --- */
    catatKuis: function (hasil) {
      var r = {
        tanggal: new Date().toISOString(),
        mode: hasil.mode,
        benar: hasil.benar,
        total: hasil.total,
        skor: hasil.skor,
        nilai: hasil.nilai
      };
      state.kuis.riwayat.unshift(r);
      if (state.kuis.riwayat.length > 40) state.kuis.riwayat.length = 40;
      Object.keys(hasil.topik || {}).forEach(function (t) {
        var src = hasil.topik[t];
        var dst = state.kuis.topik[t] || { benar: 0, total: 0 };
        dst.benar += src.benar; dst.total += src.total;
        state.kuis.topik[t] = dst;
      });
      simpan();
      store.cekBadge();
      return r;
    },
    skorKuisTerbaik: function () {
      return state.kuis.riwayat.reduce(function (m, r) { return Math.max(m, r.skor); }, 0);
    },
    /** topik terlemah -> {nama, persen} atau null */
    topikTerlemah: function () {
      var hasil = null;
      Object.keys(state.kuis.topik).forEach(function (t) {
        var d = state.kuis.topik[t];
        if (!d.total) return;
        var p = Math.round((d.benar / d.total) * 100);
        if (!hasil || p < hasil.persen) hasil = { nama: t, persen: p, total: d.total };
      });
      return hasil;
    },
    akurasiTopik: function () {
      return Object.keys(state.kuis.topik).map(function (t) {
        var d = state.kuis.topik[t];
        return { nama: t, persen: d.total ? Math.round((d.benar / d.total) * 100) : 0, total: d.total };
      }).sort(function (a, b) { return a.persen - b.persen; });
    },

    /* --- karya tulis --- */
    simpanKarya: function (karya) {
      var i = -1;
      state.karya.forEach(function (k, idx) { if (k.id === karya.id) i = idx; });
      if (i >= 0) state.karya[i] = karya;
      else state.karya.unshift(karya);
      simpan();
      store.cekBadge();
      return karya;
    },
    hapusKarya: function (id) {
      state.karya = state.karya.filter(function (k) { return k.id !== id; });
      simpan();
    },
    karyaById: function (id) {
      var hasil = null;
      state.karya.forEach(function (k) { if (k.id === id) hasil = k; });
      return hasil;
    },
    rataKarya: function () {
      if (!state.karya.length) return 0;
      var t = state.karya.reduce(function (a, k) { return a + (k.nilai || 0); }, 0);
      return Math.round(t / state.karya.length);
    },

    /* --- badge --- */
    cekBadge: function () {
      var baru = [];
      BADGES.forEach(function (b) {
        if (state.badge.indexOf(b.id) !== -1) return;
        var dapat = false;
        try { dapat = !!b.cek(state); } catch (e) { dapat = false; }
        if (dapat) {
          state.badge.push(b.id);
          baru.push(b);
        }
      });
      if (baru.length) {
        simpan();
        baru.forEach(function (b) {
          toast(b.ico + ' Badge baru: ' + b.nama, b.desc, 'ok');
          store.addLog('🏅', 'Mendapat badge ' + b.nama);
        });
      }
      return baru;
    },
    badgeDimiliki: function (id) { return state.badge.indexOf(id) !== -1; },

    /* --- ringkasan --- */
    stats: function () {
      var li = store.levelInfo(state.xp);
      return {
        xp: state.xp,
        level: li,
        badge: state.badge.length,
        materi: state.materi.length,
        contoh: state.contoh.length,
        gameMain: Object.keys(state.game).reduce(function (a, k) { return a + state.game[k].main; }, 0),
        gameTerbaik: Object.keys(state.game).reduce(function (a, k) { return Math.max(a, state.game[k].terbaik); }, 0),
        kuisDiikuti: state.kuis.riwayat.length,
        kuisTerbaik: store.skorKuisTerbaik(),
        karya: state.karya.length,
        karyaRata: store.rataKarya()
      };
    }
  };

  /* -------------------------------------------------- util view (cleanup) */

  var cleanups = [];
  LS.onCleanup = function (fn) { cleanups.push(fn); };
  LS.runCleanup = function () {
    cleanups.forEach(function (fn) { try { fn(); } catch (e) { console.warn(e); } });
    cleanups = [];
  };

  LS.util = util;
  LS.store = store;
  LS.views = LS.views || {};
  LS.toast = toast;
  LS.modal = modal;

  muat();
})();
