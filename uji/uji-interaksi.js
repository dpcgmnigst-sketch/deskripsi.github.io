/* Uji interaksi LinguaSmart dengan DOM tiruan.
   Tujuan: memanggil setiap handler (klik/input) pada setiap halaman untuk
   menangkap ReferenceError / TypeError tanpa memerlukan peramban.        */
const fs = require('fs');
const path = require('path');

const APP = path.join(__dirname, '..');
const JS = path.join(APP, 'js');

/* ------------------------------------------------ DOM tiruan yang merekam */

const dibuat = [];
const nilaiAtribut = {
  'data-mode': 'latihan', 'data-pk': 's1', 'data-tema': 'w1', 'data-i': '0', 'data-nav': '0',
  'data-lv': 'mudah', 'data-pos': '0', 'data-naik': '0', 'data-turun': '1', 'data-benar': '1',
  'data-k': '0', 'data-edit': 'k1', 'data-hapus': 'k1', 'data-j': 'Semua', 'data-aspek': 'r1',
  'data-nilai': '5', 'data-cek': 'c0'
};

const kesalahan = [];
let konteks = '-';
let jumlahPanggil = 0;
let batasPanggil = 4000;

function panggil(el, tipe, ev) {
  const daftar = el._h[tipe];
  if (!daftar) return;
  daftar.forEach(fn => {
    if (jumlahPanggil > batasPanggil) return;
    jumlahPanggil++;
    try { fn.call(el, ev || { type: tipe, target: el, preventDefault() {}, stopPropagation() {} }); }
    catch (e) { kesalahan.push('[' + konteks + '] ' + tipe + ' ' + (el._label || el.tagName) + ': ' + (e && e.message ? e.message : e)); }
  });
}

function fake(tag, label) {
  const el = {
    tagName: (tag || 'div').toUpperCase(), _h: {}, _label: label || (tag || 'div'),
    innerHTML: '', textContent: '', value: '', hidden: false, disabled: false, checked: false,
    selectedIndex: 0, style: { setProperty() {} }, dataset: {}, attributes: {}, children: [], parentNode: null,
    addEventListener(t, fn) { (el._h[t] = el._h[t] || []).push(fn); },
    removeEventListener() {},
    setAttribute(k, v) { el.attributes[k] = String(v); },
    getAttribute(k) { return (k in el.attributes) ? el.attributes[k] : (nilaiAtribut[k] !== undefined ? nilaiAtribut[k] : null); },
    removeAttribute(k) { delete el.attributes[k]; },
    appendChild(c) { el.children.push(c); if (c) c.parentNode = el; return c; },
    insertBefore(c) { el.children.push(c); return c; },
    removeChild(c) { el.children = el.children.filter(x => x !== c); return c; },
    closest() { return null; }, contains() { return false; },
    focus() {}, blur() {}, scrollIntoView() {},
    click() { panggil(el, 'click'); },
    dispatchEvent(ev) { panggil(el, ev.type, ev); return true; },
    querySelector(sel) { return fake('div', sel); },
    querySelectorAll(sel) { return [fake('button', sel)]; },
    get firstChild() { return fake('span', 'firstChild'); },
    get nextSibling() { return fake('p', 'nextSibling'); }
  };
  el.classList = {
    _s: new Set(),
    add(...c) { c.forEach(x => el.classList._s.add(x)); },
    remove(...c) { c.forEach(x => el.classList._s.delete(x)); },
    toggle(c) { if (el.classList._s.has(c)) { el.classList._s.delete(c); return false; } el.classList._s.add(c); return true; },
    contains(c) { return el.classList._s.has(c); }
  };
  dibuat.push(el);
  return el;
}

/* --------------------------------------------------------- stub peramban */

const mem = {};
const winHandlers = {};
const elById = {};
const timers = new Set();
const setIntAsli = global.setInterval, clearIntAsli = global.clearInterval;
const setTosAsli = global.setTimeout, clearTosAsli = global.clearTimeout;

global.setInterval = function (fn, ms) { const id = setIntAsli(fn, ms); timers.add(id); return id; };
global.setTimeout = function (fn, ms) { const id = setTosAsli(fn, ms); timers.add(id); return id; };
global.Event = function (type) { this.type = type; };

global.window = {
  localStorage: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } },
  addEventListener(t, fn) { (winHandlers[t] = winHandlers[t] || []).push(fn); },
  removeEventListener() {}, matchMedia: () => ({ matches: false }),
  location: { hash: '' }, scrollTo() {}, print() {}, open() {}
};
global.document = {
  getElementById(id) { return elById[id] || (elById[id] = fake('div', '#' + id)); },
  createElement(t) { return fake(t); },
  addEventListener() {}, removeEventListener() {}, querySelector() { return fake('div'); }, querySelectorAll() { return []; },
  documentElement: { setAttribute() {}, getAttribute: () => 'light' },
  body: { appendChild() {}, removeChild() {} }, title: ''
};

const mainEl = document.getElementById('main');

global.LS = {};
global.window.LS = global.LS;

/* ------------------------------------------------------------- pemuatan */

const gagalMuat = [];
['store.js', 'data.js', 'views-materi.js', 'views-games.js', 'views-kuis.js', 'views-tantangan.js', 'views-evaluasi.js', 'app.js']
  .forEach(f => {
    const kode = fs.readFileSync(path.join(JS, f), 'utf8');
    try { eval(kode); } catch (e) { gagalMuat.push(f + ': ' + e.message); }
  });

/* --------------------------------------------------------------- jalankan */

function kunjungi(hash) {
  window.location.hash = hash;
  (winHandlers.hashchange || []).forEach(fn => {
    try { fn({ type: 'hashchange' }); }
    catch (e) { kesalahan.push('[' + hash + '] render: ' + e.message); }
  });
}

function klikSemua(pass) {
  for (let p = 0; p < pass; p++) {
    const snapshot = dibuat.slice();
    snapshot.forEach(el => {
      if (el._h.click) panggil(el, 'click');
      if (el._h.input) panggil(el, 'input');
      if (el._h.change) panggil(el, 'change');
    });
    if (jumlahPanggil > batasPanggil) break;
  }
}

const RUTE = ['#/beranda', '#/materi', '#/materi/m1', '#/materi/m6', '#/contoh', '#/contoh/kuta',
  '#/contoh/manis', '#/permainan', '#/permainan/susun', '#/permainan/tebak', '#/permainan/sifat',
  '#/kuis', '#/tantangan', '#/karya', '#/evaluasi', '#/rute-ngawur'];

console.log('Uji interaksi LinguaSmart (DOM tiruan)');
const ringkas = [];
let totalSemua = 0;
RUTE.forEach(r => {
  konteks = r;
  dibuat.length = 0;              // mulai bersih untuk setiap rute
  jumlahPanggil = 0;
  batasPanggil = 1200;            // anggaran per rute
  const sebelum = kesalahan.length;
  kunjungi(r);
  const rusakAwal = mainEl.innerHTML.indexOf('Terjadi kesalahan') !== -1;
  klikSemua(2);
  const rusakAkhir = mainEl.innerHTML.indexOf('Terjadi kesalahan') !== -1;
  const baru = kesalahan.length - sebelum;
  totalSemua += jumlahPanggil;
  ringkas.push(r + ' :: handler dipanggil=' + jumlahPanggil + ' :: error=' + baru +
    (rusakAwal || rusakAkhir ? ' :: HALAMAN ERROR' : ''));
});

const unik = [...new Set(kesalahan)];
console.log(ringkas.join('\n'));
console.log('\nTotal pemanggilan handler: ' + totalSemua);
console.log('Total error tercatat: ' + kesalahan.length + ' (' + unik.length + ' pesan unik)');
unik.slice(0, 40).forEach(u => console.log(' - ' + u));

/* bersihkan timer agar proses berhenti */
timers.forEach(id => { clearIntAsli(id); clearTosAsli(id); });

if (totalSemua < 60) { unik.push('cakupan uji terlalu rendah (' + totalSemua + ' handler)'); }
const gagal = gagalMuat.length > 0 || unik.length > 0;
console.log('\nRINGKASAN: ' + (gagal ? 'ADA MASALAH' : 'SEMUA HANDLER BERJALAN TANPA ERROR'));
if (gagalMuat.length) gagalMuat.forEach(g => console.log(' gagal muat: ' + g));
process.exit(gagal ? 1 : 0);
