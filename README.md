# LinguaSmart — Aplikasi Pembelajaran Teks Deskripsi

Aplikasi web (HTML + CSS + JavaScript murni) untuk pembelajaran **teks deskripsi** Bahasa Indonesia
SMP/MTs kelas VII. Berisi lima komponen yang diminta: **materi, contoh teks deskripsi, permainan,
kuis, serta tantangan dan evaluasi**. Tidak memerlukan instalasi, tidak memerlukan internet.

---

## 1. Cara menjalankan

1. Buka folder `LinguaSmart`.
2. Klik dua kali berkas **`index.html`** — aplikasi langsung terbuka di peramban
   (Chrome, Edge, atau Firefox).
3. Untuk memakai di kelas, folder ini dapat disalin ke flashdisk atau diunggah ke
   Google Drive/website sekolah; cukup satu folder tersebut.

> Progres siswa (XP, badge, skor kuis, karya) disimpan otomatis di peramban yang dipakai
> (**localStorage**). Jadi data tiap siswa tersimpan di komputernya masing-masing.
> Bila penyimpanan peramban dinonaktifkan, aplikasi tetap berjalan, tetapi progres tidak tersimpan
> (ada peringatan di halaman Beranda).

---

## 2. Isi aplikasi

| Menu | Komponen yang diminta | Isi |
|---|---|---|
| **Materi** | Materi | 6 bab: pengertian & ciri, struktur, kaidah kebahasaan, jenis & corak, langkah menulis, kesalahan umum & penyuntingan. Ada pencarian materi dan penanda "sudah dibaca". |
| **Contoh Teks** | Contoh teks deskripsi | 5 teks lengkap (Pantai Kuta, Rumah Gadang, Candi Borobudur, Ibu, Si Manis). Setiap teks dapat ditampilkan **analisis strukturnya** atau **disorot kaidah bahasanya** (kata pancaindra, kata sifat, majas), plus glosarium dan fakta menarik. |
| **Permainan** | Permainan | 3 gim: **Susun Teks** (mengurutkan paragraf), **Tebak Objek** (8 kutipan + batas waktu 25 detik/soal), **Berburu Kata Sifat** (3 tingkat kesulitan, waktu 70 detik). |
| **Kuis** | Kuis | 22 soal pilihan ganda di bank soal. **Latihan Cepat** (10 soal, pembahasan langsung) dan **Ujian Akhir** (20 soal, 15 menit, navigasi soal, pembahasan di akhir). Soal dan pilihan jawaban diacak setiap kali dimainkan. |
| **Tantangan** | Tantangan | 6 tema menulis. Siswa menulis tiga bagian (identifikasi, deskripsi bagian, penutup), lalu mendapat **penilaian otomatis** dan mengisi **refleksi diri**. Karya dapat disimpan dan dicetak. |
| **Karyaku** | Tantangan | Daftar karya siswa, dapat dibuka kembali, dilanjutkan, dicetak, atau dihapus. |
| **Evaluasi** | Evaluasi | Dasbor capaian: XP, level, badge, grafik penguasaan per topik, skor permainan, nilai karya, riwayat aktivitas, rekomendasi tindak lanjut, **cetak laporan evaluasi**, unduh data (JSON), dan reset. |

---

## 3. Penilaian otomatis pada Tantangan Menulis

Skor otomatis (0–100) dihitung dari lima aspek:

| Aspek | Bobot | Cara penilaian |
|---|---|---|
| Kelengkapan struktur | 30 | Identifikasi (min. 15 kata), deskripsi bagian (min. 45 kata), penutup (min. 12 kata) |
| Kuantitas tulisan | 20 | Dibandingkan dengan target kata tema (120–130 kata) |
| Kekayaan kata sifat | 20 | Jumlah kata sifat berbeda yang terdeteksi (maksimal pada 8 kata) |
| Penggunaan pancaindra | 15 | Jumlah indra terdeteksi: 3 indra atau lebih mendapat nilai penuh |
| Gaya bahasa & kerapian | 15 | Majas, kalimat perincian, huruf kapital, tanda baca, penulisan "di" |

**Nilai akhir = 70% skor otomatis + 30% refleksi diri** (refleksi 5 aspek, skala 1–5).
Nilai ini langsung tampil di layar dan dapat dicetak sebagai laporan resmi bertanda tangan guru.

Contoh: skor otomatis 80 dan refleksi 100 menghasilkan nilai akhir 86.

---

## 4. Struktur folder

```
LinguaSmart/
├── index.html                 # kerangka aplikasi (semua menu)
├── css/
│   └── style.css              # tampilan: tema terang/gelap, responsif, gaya cetak
├── js/
│   ├── store.js               # penyimpanan progres, XP, level, badge, toast, modal
│   ├── data.js                # semua konten: materi, contoh teks, soal, permainan, tema, leksikon
│   ├── views-materi.js        # Beranda, Materi, Contoh Teks
│   ├── views-games.js         # 3 permainan
│   ├── views-kuis.js          # kuis latihan & ujian
│   ├── views-tantangan.js     # tantangan menulis, rubrik, daftar/detail karya
│   ├── views-evaluasi.js      # dasbor evaluasi & laporan cetak
│   └── app.js                 # router, navigasi, tema, indikator XP
└── uji/                       # skrip pengujian (opsional, dijalankan dengan Node)
    ├── uji-data.js            # uji data + logika level/badge + mesin rubrik
    ├── uji-statis.js          # uji konsistensi selector, method, dan rute
    └── uji-interaksi.js       # uji semua handler halaman dengan DOM tiruan
```

Semua konten pembelajaran terpusat di **`js/data.js`**, sehingga guru dapat menambah soal,
contoh teks, atau tema menulis tanpa menyentuh kode tampilan.

---

## 5. Menambah soal kuis (untuk guru)

Buka `js/data.js`, cari `kuis: [ ... ]`, lalu tambahkan satu objek seperti contoh berikut:

```js
{
  id: 'q23', topik: 'Struktur Teks',
  soal: 'Bagian teks deskripsi yang berisi kesan penulis disebut ...',
  opsi: ['identifikasi', 'deskripsi bagian', 'penutup', 'orientasi'],
  jawab: 2,                       // indeks jawaban benar (0 = pilihan pertama)
  bahasan: 'Penutup berisi kesan atau perasaan penulis terhadap objek.'
}
```

Gunakan `topik` salah satu dari: `Konsep Dasar`, `Struktur Teks`, `Kaidah Kebahasaan`,
`Analisis Teks` — topik inilah yang muncul pada grafik evaluasi per topik.

---

## 6. Menjalankan skrip pengujian (opsional)

Bila Node.js tersedia:

```powershell
node uji/uji-data.js        # 150+ pemeriksaan data, level/badge, dan mesin rubrik
node uji/uji-statis.js      # 245 pemeriksaan selector, method, dan rute
node uji/uji-interaksi.js   # memanggil semua handler halaman dengan DOM tiruan
```

Ketiganya mencetak `LULUS` bila tidak ada masalah. Skrip ini hanya alat bantu pengembangan;
aplikasi tetap berjalan tanpanya dan folder `uji/` boleh dihapus.

---

## 7. Catatan pemakaian di kelas

- **Alur satu pertemuan (2 × 40 menit):** Materi bab 1–2 → Contoh Teks "Pantai Kuta" →
  Permainan "Susun Teks" → Kuis Latihan Cepat.
- **Alur pertemuan berikutnya:** Materi bab 3–4 → Permainan "Berburu Kata Sifat" dan
  "Tebak Objek" → Kuis Ujian Akhir → Tantangan Menulis → cetak laporan.
- **Penilaian:** gunakan menu **Evaluasi → Cetak laporan** untuk memperoleh laporan per siswa
  (capaian aktivitas, penguasaan per topik, daftar karya, dan nilai). Isi nama serta kelas siswa
  lebih dahulu di halaman Beranda agar tercetak pada laporan.
- Satu peramban = satu siswa. Untuk berganti siswa, gunakan **Evaluasi → Reset progres**
  (disarankan mengunduh data JSON lebih dahulu sebagai cadangan).
