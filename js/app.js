/* ==========================================================================
   LinguaSmart — app.js
   Router berbasis hash, navigasi, tema terang/gelap, dan indikator XP.
   ========================================================================== */
(function () {
  'use strict';

  var U = LS.util, S = LS.store;

  var elMain = document.getElementById('main');
  var elNav = document.getElementById('mainnav');
  var elXp = document.getElementById('xpChip');
  var elTema = document.getElementById('themeToggle');
  var elNavToggle = document.getElementById('navToggle');

  var JUDUL = {
    beranda: 'Beranda', materi: 'Materi', contoh: 'Contoh Teks', permainan: 'Permainan',
    kuis: 'Kuis', tantangan: 'Tantangan Menulis', karya: 'Karyaku', evaluasi: 'Evaluasi'
  };

  /* ------------------------------------------------------------- tema warna */

  var THEME_KEY = 'linguasmart.tema';

  function pasangTema(t) {
    document.documentElement.setAttribute('data-theme', t);
    elTema.textContent = t === 'dark' ? '☀️' : '🌙';
    elTema.setAttribute('aria-label', t === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap');
    try { window.localStorage.setItem(THEME_KEY, t); } catch (e) { /* diabaikan */ }
  }

  (function temaAwal() {
    var t = null;
    try { t = window.localStorage.getItem(THEME_KEY); } catch (e) { t = null; }
    if (!t) {
      t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    pasangTema(t);
  })();

  elTema.addEventListener('click', function () {
    var sekarang = document.documentElement.getAttribute('data-theme');
    pasangTema(sekarang === 'dark' ? 'light' : 'dark');
  });

  /* ------------------------------------------------------------ XP indikator */

  function perbaruiXp() {
    var li = S.levelInfo(S.get().xp);
    elXp.textContent = '★ ' + S.get().xp + ' XP · Lv ' + li.level;
    elXp.title = li.ico + ' Level ' + li.level + ' — ' + li.judul +
      (li.next ? ' · ' + li.sisaKeNext + ' XP lagi ke level ' + li.next.level : '');
  }
  LS.refreshXp = perbaruiXp;
  perbaruiXp();

  /* --------------------------------------------------------------- navigasi */

  function tutupMenu() {
    elNav.classList.remove('open');
    elNavToggle.setAttribute('aria-expanded', 'false');
  }

  elNavToggle.addEventListener('click', function () {
    var buka = elNav.classList.toggle('open');
    elNavToggle.setAttribute('aria-expanded', buka ? 'true' : 'false');
  });

  elNav.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'A') tutupMenu();
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') tutupMenu();
  });

  function tandaiAktif(seg) {
    elNav.querySelectorAll('a').forEach(function (a) {
      var aktif = a.getAttribute('data-nav') === seg;
      a.classList.toggle('active', aktif);
      if (aktif) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  /* ----------------------------------------------------------------- router */

  function bagian() {
    var h = window.location.hash.replace(/^#\/?/, '');
    return h.split('/').filter(function (x) { return x !== ''; }).map(function (x) {
      try { return decodeURIComponent(x); } catch (e) { return x; }
    });
  }

  function tidakDitemukan() {
    elMain.innerHTML = LS.ui.head('404', 'Halaman tidak ditemukan',
      'Tautan yang kamu buka tidak tersedia. Silakan pilih menu di bawah ini.') +
      '<section class="card"><div class="btn-row">' +
      '<a class="btn btn-primary" href="#/beranda">Beranda</a>' +
      '<a class="btn" href="#/materi">Materi</a>' +
      '<a class="btn" href="#/contoh">Contoh Teks</a>' +
      '<a class="btn" href="#/permainan">Permainan</a>' +
      '<a class="btn" href="#/kuis">Kuis</a>' +
      '<a class="btn" href="#/tantangan">Tantangan</a>' +
      '<a class="btn" href="#/evaluasi">Evaluasi</a>' +
      '</div></section>';
  }

  function tampilkan() {
    LS.runCleanup();
    tutupMenu();

    var p = bagian();
    var seg = p[0] || 'beranda';
    var param = p[1] || null;
    var render = null;

    switch (seg) {
      case 'beranda':
        render = function () { LS.views.beranda(elMain); };
        break;
      case 'materi':
        render = param
          ? function () { LS.views.materiDetail(elMain, param); }
          : function () { LS.views.materiDaftar(elMain); };
        break;
      case 'contoh':
        render = param
          ? function () { LS.views.contohDetail(elMain, param); }
          : function () { LS.views.contohDaftar(elMain); };
        break;
      case 'permainan':
        if (param === 'susun') render = function () { LS.views.permainanSusun(elMain); };
        else if (param === 'tebak') render = function () { LS.views.permainanTebak(elMain); };
        else if (param === 'sifat') render = function () { LS.views.permainanSifat(elMain); };
        else render = function () { LS.views.permainanDaftar(elMain); };
        break;
      case 'kuis':
        render = function () { LS.views.kuis(elMain); };
        break;
      case 'tantangan':
        render = function () { LS.views.tantangan(elMain); };
        break;
      case 'karya':
        render = param
          ? function () { LS.views.karyaDetail(elMain, param); }
          : function () { LS.views.karyaDaftar(elMain); };
        break;
      case 'evaluasi':
        render = function () { LS.views.evaluasi(elMain); };
        break;
      default:
        render = tidakDitemukan;
        seg = 'beranda';
    }

    document.title = 'LinguaSmart · ' + (JUDUL[seg] || 'Belajar Teks Deskripsi');
    tandaiAktif(seg);

    /* beri jeda singkat agar perubahan hash terasa responsif */
    try {
      render();
    } catch (err) {
      console.error('LinguaSmart: gagal menampilkan halaman.', err);
      elMain.innerHTML = '<section class="card"><h2>Terjadi kesalahan saat menampilkan halaman</h2>' +
        '<p class="muted">' + U.esc(err && err.message ? err.message : String(err)) + '</p>' +
        '<div class="btn-row"><a class="btn btn-primary" href="#/beranda">Kembali ke beranda</a>' +
        '<button class="btn" id="muatUlang" type="button">Muat ulang</button></div></section>';
      var b = document.getElementById('muatUlang');
      if (b) b.addEventListener('click', function () { window.location.reload(); });
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
    perbaruiXp();
  }

  window.addEventListener('hashchange', tampilkan);
  window.addEventListener('load', function () {
    if (!window.location.hash) window.location.hash = '#/beranda';
  });

  /* pantau perubahan progres dari tab lain */
  window.addEventListener('storage', function (ev) {
    if (ev.key === S.keys.KEY) { perbaruiXp(); }
  });

  /* mulai */
  if (!window.location.hash) window.location.hash = '#/beranda';
  tampilkan();
  S.cekBadge();
  console.log('%cLinguaSmart siap dipakai.', 'color:#4f46e5;font-weight:bold',
    'Total soal kuis:', LS.data.kuis.length);
})();
