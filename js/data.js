/* ==========================================================================
   LinguaSmart — data.js
   Seluruh konten pembelajaran: materi, contoh teks, bank soal kuis,
   data permainan, tema tantangan menulis, dan rubrik penilaian.
   ========================================================================== */
window.LS = window.LS || {};

LS.data = {

  /* ======================================================================
     1. MATERI
     Blok yang didukung:
       p | h | list | table | callout | quote | steps | compare | example | kv
     ====================================================================== */
  materi: [
    {
      id: 'm1',
      judul: 'Mengenal Teks Deskripsi',
      ico: '📘',
      ringkas: 'Pengertian, tujuan, dan ciri-ciri teks deskripsi.',
      menit: 7,
      blok: [
        { t: 'p', text: 'Teks deskripsi adalah teks yang menggambarkan suatu objek — tempat, orang, benda, hewan, atau suasana — secara terperinci sehingga pembaca seolah-olah melihat, mendengar, mencium, atau merasakan sendiri objek tersebut.' },
        { t: 'p', text: 'Kata deskripsi berasal dari bahasa Latin describere yang berarti "menggambarkan". Karena itu, penulis teks deskripsi bertugas seperti pelukis: ia memilih detail yang paling kuat, lalu menuangkannya ke dalam kata-kata.' },
        { t: 'example', judul: 'Bedanya menceritakan dan mendeskripsikan', isi: [
          'Menceritakan: "Aku pergi ke pantai kemarin bersama ayah." (ada peristiwa dan urutan waktu)',
          'Mendeskripsikan: "Pasir di pantai itu putih kecokelatan dan terasa hangat di telapak kaki." (ada penggambaran objek melalui pancaindra)'
        ]},
        { t: 'h', text: 'Tujuan Teks Deskripsi' },
        { t: 'list', items: [
          'Menggambarkan objek dengan jelas agar pembaca mengenalnya dengan tepat.',
          'Menghidupkan kesan pembaca seolah melihat, mendengar, dan merasakan objek itu sendiri.',
          'Menyampaikan kesan atau perasaan penulis terhadap objek yang diamati.',
          'Memberikan informasi tentang bentuk, warna, ukuran, sifat, dan suasana objek.'
        ]},
        { t: 'h', text: 'Ciri-Ciri Teks Deskripsi' },
        { t: 'table', head: ['Ciri', 'Penjelasan', 'Contoh'], rows: [
          ['Objeknya khusus dan tunggal', 'Bukan objek yang umum, melainkan satu objek tertentu yang benar-benar diamati.', 'bukan "pantai" tetapi "Pantai Kuta"'],
          ['Melibatkan pancaindra', 'Penggambaran memakai penglihatan, pendengaran, penciuman, pengecapan, dan perabaan.', '"Aroma melati menyeruak", "pasirnya halus"'],
          ['Banyak kata sifat', 'Kata sifat dipakai untuk menilai bentuk, warna, sifat, dan suasana objek.', 'jernih, rimbun, lengang, sejuk'],
          ['Menggunakan kalimat perincian', 'Objek dirinci dengan angka, ukuran, warna, atau jumlah agar nyata.', '"setinggi 35 meter, terdiri atas 10 tingkat"'],
          ['Mengandung kesan penulis', 'Di bagian akhir biasanya terdapat perasaan atau penilaian penulis.', '"Sungguh, aku bangga melihatnya."']
        ]},
        { t: 'callout', jenis: 'tip', title: 'Trik cepat mengingat', text: 'D-E-S-K: Detail, Emosi, Sensorik, Khusus. Tulisanmu sudah menjadi deskripsi yang baik jika memuat keempat hal ini.' },
        { t: 'compare', kiri: { judul: 'Teks Deskripsi', items: ['Fokus pada satu objek', 'Tidak memerlukan alur peristiwa', 'Menjelaskan "bagaimana bentuk/rasanya"', 'Banyak kata sifat dan perincian pancaindra'] }, kanan: { judul: 'Teks Narasi (Cerita)', items: ['Fokus pada rangkaian peristiwa', 'Memiliki alur: awal–tengah–akhir', 'Menjelaskan "apa yang terjadi lalu apa"', 'Banyak kata kerja dan kata penghubung waktu'] } },
        { t: 'callout', jenis: 'info', title: 'Uji diri', text: 'Perhatikan kalimat berikut: "Kucingku berbulu putih dan matanya bulat hijau." Mengapa kalimat itu termasuk deskripsi? Karena ia menggambarkan sifat dan bentuk satu objek khusus, bukan menceritakan peristiwa.' }
      ]
    },

    {
      id: 'm2',
      judul: 'Struktur Teks Deskripsi',
      ico: '🧱',
      ringkas: 'Identifikasi, deskripsi bagian, dan penutup beserta polanya.',
      menit: 8,
      blok: [
        { t: 'p', text: 'Teks deskripsi yang utuh tersusun atas tiga bagian utama. Memahami struktur ini membuat tulisanmu teratur dan mudah diikuti pembaca.' },
        { t: 'steps', items: [
          { judul: 'Identifikasi', isi: 'Berisi nama objek, lokasi atau asal objek, dan gambaran umum. Bagian ini menjawab pertanyaan "apa/siapa yang dibicarakan?" Contoh: "Rumah Gadang adalah rumah adat suku Minangkabau di Sumatra Barat."' },
          { judul: 'Deskripsi bagian', isi: 'Berisi perincian objek: bagian-bagiannya, warna, ukuran, bahan, suara, aroma, dan hal-hal yang bisa diserap pancaindra. Bagian ini adalah tubuh terpanjang dari teks.' },
          { judul: 'Penutup (kesan)', isi: 'Berisi simpulan atau kesan penulis terhadap objek. Sifatnya pilihan, tetapi membuat teks terasa lebih hidup. Contoh: "Sungguh, keindahan Pantai Kuta akan selalu kurindukan."' }
        ]},
        { t: 'h', text: 'Ciri Tiap Bagian' },
        { t: 'table', head: ['Struktur', 'Isi', 'Ciri bahasa', 'Contoh kalimat'], rows: [
          ['Identifikasi', 'Nama, lokasi, gambaran umum objek', 'Kata benda + kata sifat umum, kata penunjuk', '"Pantai Kuta terletak di Kabupaten Badung, Bali."'],
          ['Deskripsi bagian', 'Perincian bagian, warna, ukuran, suasana', 'Kata sifat, kata konkret, kalimat perincian, pancaindra', '"Pasirnya halus dan berwarna putih kecokelatan."'],
          ['Penutup', 'Kesan, perasaan, atau simpulan penulis', 'Kata perasaan, kalimat seru, kata ganti orang pertama', '"Betapa bahagianya aku berada di sana."']
        ]},
        { t: 'h', text: 'Tiga Pola Mengembangkan Deskripsi Bagian' },
        { t: 'list', items: [
          { b: 'Pola ruang (spasial)', t: ' — merinci objek dari luar ke dalam, dari atas ke bawah, atau dari kiri ke kanan. Contoh: atap, dinding, lalu ruang dalam rumah.' },
          { b: 'Pola waktu (kronologis)', t: ' — merinci suasana objek pada waktu berbeda. Contoh: pagi, siang, menjelang senja.' },
          { b: 'Pola aspek', t: ' — merinci objek berdasarkan hal tertentu. Contoh: bentuk tubuh, kebiasaan, dan makanan kesukaan hewan peliharaan.' }
        ]},
        { t: 'example', judul: 'Kerangka sederhana (objek: kantin sekolah)', isi: [
          'Identifikasi: nama kantin, letaknya di sebelah timur lapangan.',
          'Deskripsi bagian 1 (ruang): meja panjang berwarna biru, dinding bercat putih, etalase kaca.',
          'Deskripsi bagian 2 (suasana): aroma bakso, suara sendok berdenting, keriuhan siswa saat istirahat.',
          'Penutup: kantin menjadi tempat favorit karena murah dan nyaman.'
        ]},
        { t: 'callout', jenis: 'warn', title: 'Sering keliru', text: 'Banyak siswa menulis penutup yang berisi nasihat atau ajakan ("Marilah kita menjaga kebersihan pantai"). Itu bukan penutup deskripsi. Penutup deskripsi berisi kesan penulis terhadap objek.' }
      ]
    },

    {
      id: 'm3',
      judul: 'Kaidah Kebahasaan Teks Deskripsi',
      ico: '🔤',
      ringkas: 'Kata sifat, kalimat perincian, pancaindra, majas, kata depan, sinonim–antonim.',
      menit: 10,
      blok: [
        { t: 'p', text: 'Kekuatan teks deskripsi terletak pada pilihan kata dan kalimatnya. Berikut kaidah kebahasaan yang wajib kamu kuasai.' },
        { t: 'table', head: ['Kaidah', 'Penjelasan', 'Contoh'], rows: [
          ['Kata sifat', 'Memberi penilaian atau keadaan pada objek.', 'jernih, rimbun, lengang, gagah, gurih'],
          ['Kata konkret', 'Kata yang bisa ditangkap pancaindra, bukan kata abstrak.', '"pasir", "ombak", "karamunting" (bukan "keindahan")'],
          ['Kalimat perincian', 'Memerinci objek dengan angka, ukuran, warna, atau jumlah.', '"Tingginya 35 meter dan terdiri atas 10 tingkat."'],
          ['Pancaindra', 'Melibatkan penglihatan, pendengaran, penciuman, pengecapan, perabaan.', '"Gemericik air", "aroma pandan", "permukaan licin"'],
          ['Majas', 'Perbandingan atau pengandaian agar gambaran lebih hidup.', '"Atapnya melengkung seperti tanduk kerbau."'],
          ['Kata depan', 'Menunjukkan tempat dan arah: di, ke, dari, pada.', '"di tepi pantai", "ke arah utara"'],
          ['Sinonim & antonim', 'Memilih kata yang tepat dan bervariasi.', 'indah = elok; ramai >< sepi'],
          ['Kata ganti', 'Mengacu pada objek agar tidak berulang.', '"Pantai itu ... Ia juga dikenal ..."']
        ]},
        { t: 'h', text: '1) Kata Sifat: Bumbu Utama Deskripsi' },
        { t: 'p', text: 'Bandingkan dua kalimat berikut. Kalimat pertama hanya memberi informasi; kalimat kedua membuat pembaca membayangkan.' },
        { t: 'example', judul: 'Sebelum dan sesudah', isi: [
          'Kurang hidup: "Ada bunga di halaman rumahku."',
          'Lebih hidup: "Bunga melati putih bermekaran di halaman rumahku, harumnya menyeruak setiap sore."'
        ]},
        { t: 'h', text: '2) Kalimat Perincian' },
        { t: 'p', text: 'Kalimat perincian berfungsi mengubah gambaran yang kabur menjadi jelas. Sertakan angka, ukuran, warna, bahan, atau jumlah.' },
        { t: 'example', judul: 'Contoh', isi: [
          'Kabur: "Rumahnya besar."',
          'Terperinci: "Rumahnya berukuran 12 x 9 meter dengan empat kamar dan serambi berukir."'
        ]},
        { t: 'h', text: '3) Melibatkan Pancaindra' },
        { t: 'table', head: ['Pancaindra', 'Kata yang sering dipakai', 'Contoh kalimat'], rows: [
          ['Penglihatan', 'warna, bentuk, ukuran, kilau', '"Langit senja berwarna jingga keemasan."'],
          ['Pendengaran', 'suara, gemericik, deru, senyap', '"Deru ombak terdengar sampai teras rumah."'],
          ['Penciuman', 'aroma, harum, semerbak, menyengat', '"Aroma melati menyeruak dari balik pagar."'],
          ['Pengecapan', 'manis, asin, gurih, sepat', '"Kuah baksonya gurih dan sedikit pedas."'],
          ['Perabaan', 'halus, kasar, lembut, dingin, licin', '"Permukaan batu itu licin dan dingin."']
        ]},
        { t: 'h', text: '4) Majas untuk Menghidupkan Gambaran' },
        { t: 'list', items: [
          { b: 'Perumpamaan (simile)', t: ' — memakai kata seperti, bagaikan, laksana, serupa, bak. Contoh: "Ombaknya putih seperti kapas."' },
          { b: 'Personifikasi', t: ' — benda diperlakukan seperti manusia. Contoh: "Ombak memeluk kaki pantai dengan lembut."' },
          { b: 'Metafora', t: ' — perbandingan langsung tanpa kata pembanding. Contoh: "Ibu adalah rumah paling hangat bagiku."' }
        ]},
        { t: 'h', text: '5) Kata Depan "di" vs Awalan "di-"' },
        { t: 'table', head: ['Bentuk', 'Ciri', 'Contoh benar', 'Contoh salah'], rows: [
          ['Kata depan "di"', 'Menyatakan tempat, ditulis terpisah, diikuti kata tempat.', 'di tepi pantai, di sekolah', 'ditepi pantai'],
          ['Awalan "di-"', 'Membentuk kata kerja pasif, ditulis serangkai.', 'dibuka, ditata, dihiasi', 'di buka, di tata']
        ]},
        { t: 'callout', jenis: 'tip', title: 'Uji cepat', text: 'Jika kata setelah "di" adalah tempat, tulis terpisah. Jika kata setelah "di" adalah kata kerja, tulis serangkai. Contoh: "Bunga itu ditanam di taman."' }
      ]
    },

    {
      id: 'm4',
      judul: 'Jenis dan Corak Teks Deskripsi',
      ico: '🗂️',
      ringkas: 'Deskripsi tempat, orang, objek, hewan, suasana; objektif vs subjektif.',
      menit: 6,
      blok: [
        { t: 'p', text: 'Teks deskripsi dapat dibedakan berdasarkan objek yang digambarkan dan berdasarkan corak penyampaiannya.' },
        { t: 'h', text: 'Berdasarkan Objek' },
        { t: 'table', head: ['Jenis', 'Fokus penggambaran', 'Contoh judul'], rows: [
          ['Deskripsi tempat', 'Lokasi, bagian-bagian tempat, suasana', '"Pantai Kuta yang Menakjubkan"'],
          ['Deskripsi orang', 'Ciri fisik, sifat, kebiasaan, kesan penulis', '"Ibu, Pahlawan dalam Hidupku"'],
          ['Deskripsi benda', 'Bentuk, bahan, ukuran, fungsi, nilai', '"Sepeda Ontel Kesayangan Ayah"'],
          ['Deskripsi hewan', 'Bulu, mata, tingkah laku, makanan', '"Si Manis, Kucing Kesayanganku"'],
          ['Deskripsi suasana', 'Apa yang dirasakan pancaindra pada saat tertentu', '"Pagi di Pasar Kampungku"']
        ]},
        { t: 'h', text: 'Berdasarkan Corak' },
        { t: 'compare',
          kiri: { judul: 'Deskripsi Objektif', items: [
            'Menggambarkan objek apa adanya berdasarkan fakta yang tampak.',
            'Tidak memasukkan perasaan pribadi penulis.',
            'Banyak data: ukuran, jumlah, lokasi, tahun.',
            'Contoh: "Candi Borobudur terletak di Kabupaten Magelang dan tingginya 35 meter."'
          ]},
          kanan: { judul: 'Deskripsi Subjektif', items: [
            'Menggambarkan objek berdasarkan kesan dan perasaan penulis.',
            'Menggunakan kata perasaan: kagum, sedih, bahagia, rindu.',
            'Contoh: "Ibu adalah sosok paling hangat dan paling sabar bagiku."'
          ]}
        },
        { t: 'callout', jenis: 'info', title: 'Keduanya boleh digabung', text: 'Dalam praktik, teks deskripsi sering memuat keduanya: bagian identifikasi dan deskripsi bagian cenderung objektif, sedangkan penutup cenderung subjektif.' }
      ]
    },

    {
      id: 'm5',
      judul: 'Langkah Menulis Teks Deskripsi',
      ico: '✏️',
      ringkas: 'Tujuh langkah dari memilih objek sampai menyunting tulisan.',
      menit: 8,
      blok: [
        { t: 'p', text: 'Menulis deskripsi yang baik bukan soal panjangnya, melainkan ketepatan detail dan kejelasan gambaran.' },
        { t: 'steps', items: [
          { judul: 'Pilih objek yang kamu kenal', isi: 'Objek yang pernah kamu lihat langsung akan jauh lebih mudah dan lebih hidup untuk digambarkan.' },
          { judul: 'Amati dengan pancaindra', isi: 'Amati dan catat: apa yang terlihat, terdengar, tercium, terasa di lidah, dan tersentuh kulit.' },
          { judul: 'Kumpulkan kata sifat', isi: 'Buat daftar minimal 10 kata sifat yang tepat untuk objekmu, misalnya: rimbun, lengang, keperakan, sejuk.' },
          { judul: 'Buat kerangka sesuai struktur', isi: 'Tuliskan tiga bagian: identifikasi, deskripsi bagian (boleh dua sampai tiga paragraf), dan penutup.' },
          { judul: 'Kembangkan menjadi paragraf', isi: 'Setiap paragraf sebaiknya membahas satu aspek atau satu pola (ruang, waktu, atau aspek).' },
          { judul: 'Periksa kaidah kebahasaan', isi: 'Pastikan ada kata sifat, kalimat perincian, pancaindra, majas, dan penulisan kata depan yang benar.' },
          { judul: 'Sunting dan baca ulang', isi: 'Perbaiki ejaan, tanda baca, pengulangan kata, dan kalimat yang terlalu panjang. Bacalah dengan suara lantang untuk mengujinya.' }
        ]},
        { t: 'h', text: 'Lima Pertanyaan Ajaib saat Mengamati' },
        { t: 'list', items: [
          'Apa yang aku lihat? (warna, bentuk, ukuran, cahaya)',
          'Apa yang aku dengar? (suara, denting, deru, keheningan)',
          'Apa yang aku cium? (harum, menyengat, aroma tanah)',
          'Apa yang aku rasakan di kulit? (hangat, dingin, kasar, halus)',
          'Apa yang aku rasakan di hati? (kagum, tenang, rindu, bangga)'
        ]},
        { t: 'callout', jenis: 'tip', title: 'Aturan "tunjukkan, jangan katakan"', text: 'Jangan hanya menulis "pantainya bagus". Tunjukkan dengan detail: "Pasirnya putih kecokelatan, ombaknya panjang dan bergulung setinggi satu meter."' },
        { t: 'example', judul: 'Judul yang menarik', isi: [
          'Kurang menarik: "Pantai"',
          'Lebih menarik: "Pantai Kuta yang Menakjubkan"',
          'Kurang menarik: "Kucing Saya"',
          'Lebih menarik: "Si Manis, Kucing Kesayanganku"'
        ]}
      ]
    },

    {
      id: 'm6',
      judul: 'Kesalahan Umum & Cara Menyunting',
      ico: '🔧',
      ringkas: 'Kesalahan yang sering muncul dalam tulisan siswa dan cara memperbaikinya.',
      menit: 7,
      blok: [
        { t: 'p', text: 'Menyunting berarti memperbaiki tulisan sebelum dianggap selesai. Kenali dulu kesalahan yang paling sering muncul.' },
        { t: 'table', head: ['Kesalahan', 'Contoh salah', 'Perbaikan'], rows: [
          ['Terlalu umum, bukan objek khusus', '"Pantai itu indah."', '"Pantai Kuta memiliki pasir putih kecokelatan dan ombak setinggi satu meter."'],
          ['Pemborosan kata', '"Sangat-sangat amat indah sekali."', '"Sangat indah."'],
          ['Hanya satu indra yang dipakai', 'Semua kalimat hanya tentang penglihatan.', 'Tambahkan suara, aroma, rasa, atau sentuhan.'],
          ['Struktur tidak lengkap', 'Tidak ada identifikasi sehingga pembaca tidak tahu objeknya.', 'Sebutkan nama dan lokasi objek pada paragraf pertama.'],
          ['Penutup berisi nasihat/ajakan', '"Marilah kita menjaga pantai ini."', '"Sungguh, senja di pantai itu selalu kurindukan."'],
          ['Kata depan salah tulis', '"ditepi pantai", "di buka"', '"di tepi pantai", "dibuka"'],
          ['Kalimat terlalu panjang tanpa jeda', 'Satu kalimat memuat lima gagasan sekaligus.', 'Pecah menjadi beberapa kalimat; satu kalimat satu gagasan utama.'],
          ['Pengulangan kata yang membosankan', '"indah ... indah ... indah"', 'Gunakan sinonim: elok, memesona, menawan.']
        ]},
        { t: 'h', text: 'Empat Langkah Menyunting' },
        { t: 'steps', items: [
          { judul: 'Sunting isi', isi: 'Apakah objeknya khusus? Apakah detailnya cukup untuk membuat pembaca membayangkan?' },
          { judul: 'Sunting struktur', isi: 'Apakah identifikasi, deskripsi bagian, dan penutup sudah ada dan berurutan?' },
          { judul: 'Sunting bahasa', isi: 'Apakah ada kata sifat yang bervariasi, kalimat perincian, pancaindra, dan majas?' },
          { judul: 'Sunting ejaan', isi: 'Periksa huruf kapital di awal kalimat dan nama tempat, tanda titik–koma, serta penulisan "di".' }
        ]},
        { t: 'callout', jenis: 'warn', title: 'Ingat', text: 'Menulis itu proses. Karya pertama hampir selalu bisa diperbaiki. Simpan draf, lalu sunting minimal satu kali sebelum dikumpulkan.' }
      ]
    }
  ],

  /* ======================================================================
     2. CONTOH TEKS DESKRIPSI
     ====================================================================== */
  contoh: [
    {
      id: 'kuta',
      judul: 'Pantai Kuta yang Menakjubkan',
      jenis: 'Tempat',
      corak: 'Objektif–Subjektif',
      ico: '🏖️',
      menit: 5,
      teks: [
        'Pantai Kuta adalah salah satu pantai paling terkenal di Bali. Pantai ini terletak di Kabupaten Badung, sekitar sembilan kilometer dari Bandara I Gusti Ngurah Rai. Kuta dikenal karena pasirnya yang putih kecokelatan dan ombaknya yang panjang, sehingga menjadi tempat favorit wisatawan dari berbagai negara.',
        'Pada pagi hari, suasana Pantai Kuta masih lengang. Angin laut bertiup lembut membawa aroma asin yang khas. Pasirnya halus dan terasa hangat ketika menyentuh telapak kaki. Ketika matahari mulai tinggi, payung-payung berwarna-warni berbaris di tepi pantai seperti jamur raksasa yang tumbuh di atas pasir. Suara ombak yang memecah di garis pantai terdengar berulang-ulang, menemani celoteh wisatawan yang sedang berfoto.',
        'Menjelang senja, langit di atas Kuta berubah menjadi jingga keemasan. Ombak setinggi satu meter dimanfaatkan para peselancar untuk menantang adrenalin. Di sepanjang jalan pantai, para pedagang menawarkan jagung bakar, kelapa muda, dan aneka suvenir.',
        'Pantai Kuta adalah perpaduan keindahan alam dan kehidupan wisata yang ramai. Bagiku, tempat ini selalu berhasil membuat hati terasa ringan. Sungguh, keindahan Pantai Kuta akan selalu kurindukan.'
      ],
      struktur: [
        { label: 'Identifikasi', paragraf: 0, isi: 'Menyebutkan nama objek (Pantai Kuta), lokasi (Kabupaten Badung, sembilan kilometer dari bandara), dan gambaran umum (pasir putih kecokelatan, ombak panjang).' },
        { label: 'Deskripsi bagian', paragraf: 1, isi: 'Merinci suasana pagi dengan pola waktu: angin, aroma asin, tekstur pasir, payung berwarna, dan suara ombak.' },
        { label: 'Deskripsi bagian', paragraf: 2, isi: 'Merinci suasana senja: warna langit, aktivitas peselancar, dan pedagang di sepanjang jalan pantai.' },
        { label: 'Penutup', paragraf: 3, isi: 'Menyampaikan kesan dan perasaan penulis terhadap objek, bukan nasihat atau ajakan.' }
      ],
      kaidah: [
        { nama: 'Kata sifat', contoh: 'terkenal, lengang, halus, hangat, ramai, ringan', ket: 'Memberi keadaan dan penilaian pada objek.' },
        { nama: 'Kalimat perincian', contoh: 'sekitar sembilan kilometer; ombak setinggi satu meter', ket: 'Ukuran dan jarak membuat gambaran lebih nyata.' },
        { nama: 'Pancaindra', contoh: 'aroma asin (penciuman), pasir halus (perabaan), suara ombak (pendengaran), jingga keemasan (penglihatan)', ket: 'Melibatkan empat indra sekaligus.' },
        { nama: 'Majas perumpamaan', contoh: 'payung berwarna-warni seperti jamur raksasa', ket: 'Memakai kata pembanding "seperti".' },
        { nama: 'Kata depan', contoh: 'di Kabupaten Badung, di tepi pantai, di sepanjang jalan', ket: 'Ditulis terpisah karena menunjukkan tempat.' }
      ],
      glosarium: [
        { kata: 'lengang', arti: 'sepi; tidak ramai' },
        { kata: 'peselancar', arti: 'orang yang berselancar di atas ombak' },
        { kata: 'suvenir', arti: 'barang kenang-kenangan' },
        { kata: 'adrenalin', arti: 'kegembiraan/ketegangan yang memacu semangat' }
      ],
      fakta: [
        'Pantai Kuta mulai dikenal luas pada 1970-an ketika para peselancar asing menemukan ombaknya.',
        'Kuta berada di jalur wisata Bali selatan bersama Legian dan Seminyak.'
      ]
    },

    {
      id: 'gadang',
      judul: 'Rumah Gadang, Rumah Adat Minangkabau',
      jenis: 'Tempat / Budaya',
      corak: 'Objektif',
      ico: '🏠',
      menit: 5,
      teks: [
        'Rumah Gadang adalah rumah adat suku Minangkabau di Sumatra Barat. Rumah ini disebut juga Rumah Bagonjong karena atapnya melengkung menyerupai tanduk kerbau. Bangunannya berbentuk persegi panjang dan berdiri di atas tiang-tiang kayu yang kokoh.',
        'Bagian atap Rumah Gadang terbuat dari ijuk hitam yang tebal. Kedua ujung atapnya menjulang runcing ke atas, seperti tanduk kerbau yang sedang berlaga. Dindingnya berupa papan kayu berukir dengan motif akar, bunga, dan garis lengkung. Ketika pintu kayu dibuka, tercium aroma kayu tua yang hangat dan khas. Bagian dalam rumah terdiri atas beberapa ruang: ruang utama untuk musyawarah, kamar-kamar untuk kaum perempuan, dan dapur di bagian belakang.',
        'Rumah Gadang bukan sekadar bangunan tempat tinggal. Rumah ini menjadi lambang kebersamaan dan kebanggaan keluarga Minangkabau. Melihatnya, aku merasa kagum pada kearifan nenek moyang bangsa kita.'
      ],
      struktur: [
        { label: 'Identifikasi', paragraf: 0, isi: 'Nama objek (Rumah Gadang/Rumah Bagonjong), asal daerah (Sumatra Barat), dan gambaran umum bentuk bangunan.' },
        { label: 'Deskripsi bagian', paragraf: 1, isi: 'Dirinci dengan pola ruang: atap, dinding, aroma, lalu bagian dalam rumah.' },
        { label: 'Penutup', paragraf: 2, isi: 'Kesan penulis: kagum dan bangga terhadap warisan budaya.' }
      ],
      kaidah: [
        { nama: 'Kata sifat', contoh: 'kokoh, tebal, runcing, hangat, khas', ket: 'Menggambarkan bahan dan bentuk.' },
        { nama: 'Kata konkret', contoh: 'ijuk, papan, tiang, motif akar, dapur', ket: 'Benda nyata yang dapat ditangkap pancaindra.' },
        { nama: 'Majas', contoh: 'atapnya ... seperti tanduk kerbau yang sedang berlaga (perumpamaan)', ket: 'Memberi gambaran bentuk yang lebih jelas.' },
        { nama: 'Pola ruang', contoh: 'atap → dinding → bagian dalam', ket: 'Deskripsi bagian disusun dari luar ke dalam.' }
      ],
      glosarium: [
        { kata: 'ijuk', arti: 'serabut hitam dari pohon aren untuk atap' },
        { kata: 'bagonjong', arti: 'berbentuk seperti tanduk kerbau yang melengkung' },
        { kata: 'musyawarah', arti: 'perundingan bersama untuk mencapai kesepakatan' },
        { kata: 'kearifan', arti: 'kebijaksanaan; kepandaian' }
      ],
      fakta: [
        'Jumlah kamar Rumah Gadang biasanya ganjil dan setiap kamar dihuni oleh perempuan beserta keluarganya.',
        'Rumah Gadang dibangun tanpa paku pada struktur utamanya; sambungan kayu dipasang dengan pasak.'
      ]
    },

    {
      id: 'borobudur',
      judul: 'Candi Borobudur, Warisan Dunia',
      jenis: 'Tempat / Sejarah',
      corak: 'Objektif',
      ico: '🛕',
      menit: 5,
      teks: [
        'Candi Borobudur adalah candi Buddha terbesar di dunia. Candi ini terletak di Kabupaten Magelang, Jawa Tengah, sekitar 40 kilometer dari Yogyakarta. Bangunannya berbentuk piramida bertingkat dan berdiri di atas bukit kecil yang dikelilingi sawah serta perbukitan hijau.',
        'Candi Borobudur memiliki tinggi sekitar 35 meter dan terdiri atas sepuluh tingkat. Sepuluh tingkat itu meliputi enam tingkat berbentuk persegi, tiga tingkat berbentuk lingkaran, dan satu stupa induk di puncak. Dinding candi dihiasi lebih dari dua ribu panel relief yang menggambarkan kehidupan manusia, cerita Jataka, dan ajaran Buddha. Pada tiga tingkat lingkaran terdapat 72 stupa berlubang yang di dalamnya tersimpan arca Buddha. Ketika matahari terbit, cahaya keemasan menyentuh batu-batu andesit itu sehingga suasana terasa hening dan khidmat.',
        'Keberadaan Candi Borobudur menunjukkan betapa tinggi peradaban nenek moyang Indonesia. Bangunan ini telah ditetapkan sebagai Warisan Dunia UNESCO. Melihatnya, kita pantas merasa bangga dan ikut menjaga kelestariannya.'
      ],
      struktur: [
        { label: 'Identifikasi', paragraf: 0, isi: 'Nama objek, predikat (candi Buddha terbesar di dunia), lokasi, dan bentuk umum.' },
        { label: 'Deskripsi bagian', paragraf: 1, isi: 'Perincian berupa angka dan ukuran: tinggi 35 meter, sepuluh tingkat, 72 stupa, lebih dari dua ribu panel relief, dan suasana pagi.' },
        { label: 'Penutup', paragraf: 2, isi: 'Kesan dan kebanggaan penulis terhadap objek.' }
      ],
      kaidah: [
        { nama: 'Kalimat perincian', contoh: 'tinggi sekitar 35 meter; 72 stupa; lebih dari dua ribu panel relief', ket: 'Ciri khas deskripsi objektif.' },
        { nama: 'Kata sifat', contoh: 'terbesar, hijau, hening, khidmat, bangga', ket: 'Menghidupkan suasana dan kesan.' },
        { nama: 'Pancaindra', contoh: 'cahaya keemasan (penglihatan)', ket: 'Menambah kesan nyata pada deskripsi.' },
        { nama: 'Kata depan', contoh: 'di Kabupaten Magelang, di puncak, di dalamnya', ket: 'Kata depan penunjuk tempat.' }
      ],
      glosarium: [
        { kata: 'relief', arti: 'gambar timbul pada dinding batu' },
        { kata: 'stupa', arti: 'bangunan suci berbentuk genta bagi umat Buddha' },
        { kata: 'andesit', arti: 'jenis batu vulkanik berwarna abu-abu' },
        { kata: 'khidmat', arti: 'sangat bersungguh-sungguh; khusyuk' }
      ],
      fakta: [
        'Borobudur dibangun pada abad ke-8 hingga ke-9 pada masa Dinasti Syailendra.',
        'Borobudur sempat tertutup tanah dan semak sebelum dipugar besar-besaran pada 1973–1983.'
      ]
    },

    {
      id: 'ibu',
      judul: 'Ibu, Rumah Paling Hangat Bagiku',
      jenis: 'Orang',
      corak: 'Subjektif',
      ico: '👩',
      menit: 4,
      teks: [
        'Ibu adalah sosok paling hangat dalam hidupku. Namanya Sri, usianya empat puluh dua tahun, dan ia bekerja sebagai penjahit di rumah kami yang kecil di ujung gang.',
        'Ibu bertubuh mungil dengan kulit sawo matang dan rambut yang selalu diikat rapi. Di sudut matanya terlihat garis-garis halus, tanda bahwa ia banyak begadang menyelesaikan jahitan pesanan. Suaranya lembut, tetapi kalimatnya selalu tegas ketika mengingatkanku untuk belajar. Tangannya kasar karena sering menyentuh kain dan jarum, namun sentuhannya saat mengelus kepalaku terasa paling menenangkan.',
        'Setiap pagi, aroma nasi goreng buatannya membangunkan seisi rumah. Ia tidak pernah mengeluh meskipun harus menjahit sampai larut malam. Baginya, keluarga adalah alasan untuk terus bekerja.',
        'Ibu adalah rumah paling hangat bagiku, tempat aku selalu ingin pulang. Aku ingin menjadi orang yang bisa membahagiakan dan membanggakannya suatu hari nanti.'
      ],
      struktur: [
        { label: 'Identifikasi', paragraf: 0, isi: 'Nama dan gambaran umum objek: sosok ibu, nama, usia, pekerjaan.' },
        { label: 'Deskripsi bagian', paragraf: 1, isi: 'Ciri fisik dan sifat: tubuh mungil, kulit sawo matang, rambut diikat rapi, suara lembut, tangan kasar namun menenangkan.' },
        { label: 'Deskripsi bagian', paragraf: 2, isi: 'Kebiasaan sehari-hari: aroma masakan, kebiasaan menjahit sampai malam.' },
        { label: 'Penutup', paragraf: 3, isi: 'Kesan dan harapan penulis yang bersifat sangat pribadi.' }
      ],
      kaidah: [
        { nama: 'Deskripsi subjektif', contoh: 'rumah paling hangat bagiku; sentuhannya terasa paling menenangkan', ket: 'Memasukkan perasaan penulis.' },
        { nama: 'Pancaindra', contoh: 'aroma nasi goreng (penciuman), tangan kasar (perabaan), suara lembut (pendengaran)', ket: 'Tiga indra dipakai bergantian.' },
        { nama: 'Metafora', contoh: 'Ibu adalah rumah paling hangat bagiku', ket: 'Perbandingan langsung tanpa kata pembanding.' },
        { nama: 'Kata sifat', contoh: 'hangat, mungil, tegas, lembut, menenangkan', ket: 'Menghidupkan sifat dan kesan.' }
      ],
      glosarium: [
        { kata: 'sawo matang', arti: 'warna kulit cokelat kemerahan' },
        { kata: 'begadang', arti: 'terjaga sampai larut malam' },
        { kata: 'mengelus', arti: 'mengusap dengan lembut' }
      ],
      fakta: [
        'Deskripsi orang yang baik menyeimbangkan ciri fisik, sifat, kebiasaan, dan kesan penulis.',
        'Menulis tentang orang terdekat memudahkan kita memilih detail yang jujur dan menyentuh.'
      ]
    },

    {
      id: 'manis',
      judul: 'Si Manis, Kucing Kesayanganku',
      jenis: 'Hewan',
      corak: 'Subjektif',
      ico: '🐱',
      menit: 4,
      teks: [
        'Si Manis adalah kucing betina berumur dua tahun yang tinggal bersama keluargaku. Tubuhnya kecil dengan bulu putih bersih dan bercak oranye di bagian kepala.',
        'Matanya bulat berwarna hijau seperti kelereng. Ketika berjalan, ekornya selalu tegak dan bergoyang lembut. Kumisnya panjang dan halus, sementara hidungnya kecil berwarna merah muda. Setiap kali aku pulang sekolah, Si Manis langsung menggosokkan kepalanya ke kakiku sambil mendengkur pelan.',
        'Si Manis sangat suka bermain bola benang. Setiap sore ia mengejar-ngejar benang itu di lantai ruang tamu sampai napasnya terengah-engah. Makanan kesukaannya adalah ikan tongkol rebus tanpa garam. Ketika merasa kedinginan, ia akan meringkuk di pangkuanku dan menutup matanya dengan tenang.',
        'Bagi keluargaku, Si Manis bukan sekadar hewan peliharaan, melainkan anggota keluarga kecil yang selalu menghibur kami.'
      ],
      struktur: [
        { label: 'Identifikasi', paragraf: 0, isi: 'Nama objek, jenis kelamin, umur, dan gambaran umum warna bulu.' },
        { label: 'Deskripsi bagian', paragraf: 1, isi: 'Pola aspek: ciri fisik (mata, ekor, kumis, hidung) dan tingkah laku menyambut penulis.' },
        { label: 'Deskripsi bagian', paragraf: 2, isi: 'Kebiasaan bermain dan makanan kesukaan.' },
        { label: 'Penutup', paragraf: 3, isi: 'Kesan penulis: Si Manis dianggap bagian dari keluarga.' }
      ],
      kaidah: [
        { nama: 'Pancaindra', contoh: 'bulu putih bersih (penglihatan), mendengkur pelan (pendengaran), bulu halus (perabaan)', ket: 'Pancaindra membuat objek terasa hidup.' },
        { nama: 'Perumpamaan', contoh: 'Matanya bulat berwarna hijau seperti kelereng', ket: 'Kata pembanding "seperti".' },
        { nama: 'Kalimat perincian', contoh: 'berumur dua tahun; bercak oranye di bagian kepala', ket: 'Umur dan letak bercak memperjelas objek.' },
        { nama: 'Kata sifat', contoh: 'manis, kecil, bulat, lembut, terengah-engah', ket: 'Menggambarkan bentuk dan keadaan.' }
      ],
      glosarium: [
        { kata: 'mendengkur', arti: 'suara bergetar khas kucing yang menandakan nyaman' },
        { kata: 'terengah-engah', arti: 'bernapas pendek-pendek karena lelah' },
        { kata: 'tongkol', arti: 'jenis ikan laut yang banyak dikonsumsi' }
      ],
      fakta: [
        'Deskripsi hewan menjadi kuat jika memuat ciri fisik, tingkah laku, dan kebiasaan makannya.',
        'Menggunakan nama panggilan hewan ("Si Manis") membuat teks terasa lebih akrab.'
      ]
    }
  ],

  /* ======================================================================
     3. BANK SOAL KUIS
     topik: Konsep Dasar | Struktur Teks | Kaidah Kebahasaan | Analisis Teks
     ====================================================================== */
  kuis: [
    {
      id: 'q1', topik: 'Konsep Dasar',
      soal: 'Teks deskripsi adalah teks yang bertujuan ...',
      opsi: [
        'menceritakan rangkaian peristiwa secara berurutan',
        'meyakinkan pembaca agar setuju dengan pendapat penulis',
        'menggambarkan objek secara terperinci sehingga pembaca seolah melihat dan merasakannya',
        'menjelaskan langkah-langkah membuat sesuatu'
      ],
      jawab: 2,
      bahasan: 'Inti teks deskripsi adalah penggambaran objek secara terperinci melalui pancaindra. Pilihan A ciri narasi, B ciri persuasi, dan D ciri prosedur.'
    },
    {
      id: 'q2', topik: 'Konsep Dasar',
      soal: 'Objek yang digambarkan dalam teks deskripsi bersifat ...',
      opsi: ['umum dan luas', 'khusus atau tunggal', 'khayalan yang tidak nyata', 'selalu berupa manusia'],
      jawab: 1,
      bahasan: 'Teks deskripsi membahas satu objek tertentu, misalnya "Pantai Kuta", bukan "pantai" secara umum.'
    },
    {
      id: 'q3', topik: 'Konsep Dasar',
      soal: 'Berikut yang BUKAN ciri teks deskripsi adalah ...',
      opsi: [
        'melibatkan pengalaman pancaindra',
        'banyak menggunakan kata sifat',
        'menggunakan urutan waktu sebagai kerangka utama cerita',
        'memuat kesan atau perasaan penulis'
      ],
      jawab: 2,
      bahasan: 'Urutan waktu sebagai kerangka utama adalah ciri teks narasi. Deskripsi boleh memakai pola waktu, tetapi itu bukan kerangka utamanya.'
    },
    {
      id: 'q4', topik: 'Konsep Dasar',
      soal: 'Perbedaan utama teks deskripsi dan teks narasi adalah ...',
      opsi: [
        'deskripsi menggambarkan objek, narasi menceritakan rangkaian peristiwa',
        'deskripsi selalu lebih pendek daripada narasi',
        'deskripsi tidak boleh memakai kata sifat',
        'narasi tidak memiliki tokoh'
      ],
      jawab: 0,
      bahasan: 'Fokus deskripsi adalah objek (bagaimana bentuk, warna, suasananya), sedangkan narasi fokus pada peristiwa dan alurnya.'
    },
    {
      id: 'q5', topik: 'Struktur Teks',
      soal: 'Urutan struktur teks deskripsi yang tepat adalah ...',
      opsi: [
        'orientasi – komplikasi – resolusi',
        'tujuan – langkah – penutup',
        'pernyataan umum – aspek yang dilaporkan – simpulan',
        'identifikasi – deskripsi bagian – penutup'
      ],
      jawab: 3,
      bahasan: 'Struktur teks deskripsi: identifikasi, deskripsi bagian, lalu penutup (kesan). Pilihan A struktur narasi dan B struktur prosedur.'
    },
    {
      id: 'q6', topik: 'Struktur Teks',
      soal: 'Bagian identifikasi pada teks deskripsi berisi ...',
      opsi: [
        'perincian warna dan ukuran bagian-bagian objek',
        'kesan dan perasaan penulis terhadap objek',
        'nasihat agar pembaca menjaga objek tersebut',
        'nama objek, lokasi, dan gambaran umum objek'
      ],
      jawab: 3,
      bahasan: 'Identifikasi memperkenalkan objek: namanya apa, di mana, dan bagaimana gambaran umumnya.'
    },
    {
      id: 'q7', topik: 'Struktur Teks',
      soal: 'Kutipan: "Rumah Gadang berdiri kokoh di atas tiang-tiang kayu di tepi jalan kampung." Kutipan tersebut termasuk struktur ...',
      opsi: ['identifikasi', 'deskripsi bagian', 'penutup', 'orientasi'],
      jawab: 0,
      bahasan: 'Kalimat itu memperkenalkan objek dan lokasinya, jadi termasuk bagian identifikasi.'
    },
    {
      id: 'q8', topik: 'Struktur Teks',
      soal: 'Kutipan: "Dindingnya terbuat dari papan kayu berukir dengan motif akar dan bunga." Kutipan tersebut termasuk struktur ...',
      opsi: [
        'identifikasi',
        'penutup',
        'deskripsi bagian',
        'simpulan'
      ],
      jawab: 2,
      bahasan: 'Kalimat itu merinci satu bagian objek (dinding) beserta bahan dan motifnya, sehingga termasuk deskripsi bagian.'
    },
    {
      id: 'q9', topik: 'Struktur Teks',
      soal: 'Kutipan: "Sungguh, aku bangga melihat rumah adat itu." Kutipan tersebut termasuk struktur ...',
      opsi: ['identifikasi', 'deskripsi bagian', 'penutup', 'pembuka'],
      jawab: 2,
      bahasan: 'Kalimat itu menyampaikan kesan/perasaan penulis, ciri khas bagian penutup.'
    },
    {
      id: 'q10', topik: 'Struktur Teks',
      soal: 'Merinci objek dari bagian atap, lalu dinding, lalu ruang dalam disebut pola pengembangan ...',
      opsi: ['kronologis (waktu)', 'spasial (ruang)', 'kausal (sebab-akibat)', 'aspek'],
      jawab: 1,
      bahasan: 'Pola ruang atau spasial menyusun perincian berdasarkan letak bagian objek, misalnya dari luar ke dalam.'
    },
    {
      id: 'q11', topik: 'Kaidah Kebahasaan',
      soal: 'Kalimat yang paling banyak menggunakan kata sifat adalah ...',
      opsi: [
        'Ayah pergi ke pasar pagi ini.',
        'Ia membeli dua kilo ikan tongkol.',
        'Kami berangkat pukul enam pagi.',
        'Air lautnya sangat jernih, pasirnya putih, dan udaranya sejuk.'
      ],
      jawab: 3,
      bahasan: 'Kata "jernih", "putih", dan "sejuk" adalah kata sifat yang menggambarkan keadaan objek.'
    },
    {
      id: 'q12', topik: 'Kaidah Kebahasaan',
      soal: 'Fungsi kalimat perincian dalam teks deskripsi adalah ...',
      opsi: [
        'memerinci objek dengan angka, ukuran, warna, atau jumlah agar gambaran lebih jelas',
        'memendekkan teks agar mudah dibaca',
        'menambahkan nasihat bagi pembaca',
        'menceritakan urutan peristiwa'
      ],
      jawab: 0,
      bahasan: 'Kalimat perincian mengubah gambaran yang kabur menjadi konkret: "tingginya 35 meter", "72 stupa".'
    },
    {
      id: 'q13', topik: 'Kaidah Kebahasaan',
      soal: 'Majas pada kalimat "Ombak memeluk kaki pantai dengan lembut" adalah ...',
      opsi: ['perumpamaan (simile)', 'personifikasi', 'metafora', 'hiperbola'],
      jawab: 1,
      bahasan: 'Ombak (benda) digambarkan melakukan perbuatan manusia, yaitu "memeluk". Itu personifikasi.'
    },
    {
      id: 'q14', topik: 'Kaidah Kebahasaan',
      soal: 'Majas pada kalimat "Atapnya melengkung seperti tanduk kerbau" adalah ...',
      opsi: ['perumpamaan (simile)', 'personifikasi', 'metafora', 'litotes'],
      jawab: 0,
      bahasan: 'Ada kata pembanding "seperti", sehingga kalimat itu termasuk perumpamaan atau simile.'
    },
    {
      id: 'q15', topik: 'Kaidah Kebahasaan',
      soal: 'Kalimat yang melibatkan indra pendengar adalah ...',
      opsi: [
        'Gemericik air mengalir di sela batu terdengar jelas.',
        'Warna langit berubah jingga keemasan.',
        'Aroma melati menyeruak dari balik pagar.',
        'Permukaan batu itu licin dan dingin.'
      ],
      jawab: 0,
      bahasan: '"Gemericik" dan "terdengar" berkaitan dengan indra pendengaran.'
    },
    {
      id: 'q16', topik: 'Kaidah Kebahasaan',
      soal: 'Penulisan kata depan yang tepat adalah ...',
      opsi: ['ditepi pantai', 'dite pi pantai', 'diteipi pantai', 'di tepi pantai'],
      jawab: 3,
      bahasan: '"di" sebagai kata depan penunjuk tempat ditulis terpisah: di tepi pantai. Awalan "di-" untuk kata kerja ditulis serangkai, misalnya "ditata".'
    },
    {
      id: 'q17', topik: 'Kaidah Kebahasaan',
      soal: 'Sinonim kata "elok" adalah ...',
      opsi: ['buruk', 'kotor', 'indah', 'sempit'],
      jawab: 2,
      bahasan: 'Elok bersinonim dengan indah, cantik, atau memesona.'
    },
    {
      id: 'q18', topik: 'Kaidah Kebahasaan',
      soal: 'Antonim kata "ramai" adalah ...',
      opsi: ['sepi', 'riuh', 'sibuk', 'padat'],
      jawab: 0,
      bahasan: 'Antonim (lawan kata) dari ramai adalah sepi atau lengang.'
    },
    {
      id: 'q19', topik: 'Analisis Teks',
      soal: 'Kutipan: "Candi Borobudur terletak di Kabupaten Magelang. Tingginya sekitar 35 meter dan terdiri atas sepuluh tingkat." Kutipan tersebut merupakan deskripsi ...',
      opsi: ['subjektif', 'objektif', 'naratif', 'persuasif'],
      jawab: 1,
      bahasan: 'Deskripsi objektif memuat fakta dan data yang dapat diverifikasi, tanpa memasukkan perasaan penulis.'
    },
    {
      id: 'q20', topik: 'Analisis Teks',
      soal: 'Kutipan: "Ibu adalah rumah paling hangat bagiku." Kutipan tersebut merupakan deskripsi ...',
      opsi: ['objektif', 'prosedural', 'subjektif', 'ekspositori'],
      jawab: 2,
      bahasan: 'Kalimat itu memuat kesan dan perasaan pribadi penulis, ciri deskripsi subjektif.'
    },
    {
      id: 'q21', topik: 'Analisis Teks',
      soal: 'Kalimat yang mengandung pemborosan kata adalah ...',
      opsi: [
        'Pantai itu sangat indah.',
        'Pantai itu sangat-sangat amat indah sekali.',
        'Pantai itu indah dan bersih.',
        'Pantai itu tampak indah pada sore hari.'
      ],
      jawab: 1,
      bahasan: 'Pemakaian "sangat-sangat", "amat", dan "sekali" sekaligus merupakan pemborosan kata. Cukup satu penanda, misalnya "sangat indah".'
    },
    {
      id: 'q22', topik: 'Analisis Teks',
      soal: 'Judul yang paling tepat untuk teks deskripsi tentang kucing peliharaan bernama Manis adalah ...',
      opsi: ['Kucing', 'Si Manis, Kucing Kesayanganku', 'Cara Memelihara Kucing', 'Kucing di Seluruh Dunia'],
      jawab: 1,
      bahasan: 'Judul deskripsi sebaiknya menunjukkan objek khusus dan menarik perhatian, bukan objek umum atau topik prosedural.'
    }
  ],

  /* ======================================================================
     4. PERMAINAN
     ====================================================================== */

  /* --- 4a. Susun Teks: urutkan paragraf sesuai struktur --- */
  susun: [
    {
      id: 's1',
      judul: 'Pantai Kuta',
      petunjuk: 'Susun tiga paragraf berikut menjadi teks deskripsi yang utuh: identifikasi → deskripsi bagian → penutup.',
      paragraf: [
        { label: 'Identifikasi', teks: 'Pantai Kuta adalah salah satu pantai paling terkenal di Bali. Pantai ini terletak di Kabupaten Badung, sekitar sembilan kilometer dari Bandara I Gusti Ngurah Rai.' },
        { label: 'Deskripsi bagian', teks: 'Pasir di Pantai Kuta berwarna putih kecokelatan dan terasa halus di telapak kaki. Ombaknya panjang dan bergulung setinggi satu meter sehingga cocok untuk berselancar. Deru ombak yang memecah di garis pantai terdengar sepanjang hari.' },
        { label: 'Penutup', teks: 'Keindahan Pantai Kuta membuat siapa pun betah berlama-lama. Sungguh, senja di Kuta adalah pemandangan yang tidak akan aku lupakan.' }
      ]
    },
    {
      id: 's2',
      judul: 'Si Manis',
      petunjuk: 'Susun empat paragraf berikut agar strukturnya runtut: identifikasi, dua paragraf deskripsi bagian, lalu penutup.',
      paragraf: [
        { label: 'Identifikasi', teks: 'Si Manis adalah kucing betina berumur dua tahun yang tinggal di rumahku. Bulunya putih bersih dengan bercak oranye di bagian kepala.' },
        { label: 'Deskripsi bagian', teks: 'Tubuh Si Manis kecil dan lentur. Matanya bulat berwarna hijau seperti kelereng. Ketika berjalan, ekornya selalu tegak dan bergoyang lembut.' },
        { label: 'Deskripsi bagian', teks: 'Si Manis sangat suka bermain bola benang. Setiap sore ia mengejar-ngejar benang itu di lantai ruang tamu sampai napasnya terengah-engah.' },
        { label: 'Penutup', teks: 'Bagi keluargaku, Si Manis bukan sekadar hewan peliharaan, melainkan anggota keluarga yang selalu menghibur.' }
      ]
    },
    {
      id: 's3',
      judul: 'Pasar Pagi',
      petunjuk: 'Susun tiga paragraf berikut sesuai struktur teks deskripsi.',
      paragraf: [
        { label: 'Identifikasi', teks: 'Pasar pagi di dekat rumahku mulai hidup sejak pukul lima. Pasar itu terletak di tepi jalan raya, tepat di depan balai desa.' },
        { label: 'Deskripsi bagian', teks: 'Aroma gorengan dan bau tanah basah bercampur menjadi satu. Suara tawar-menawar pedagang dan pembeli saling bersahutan. Sayuran hijau ditata rapi di atas tikar, sedangkan ikan segar diletakkan di atas meja kayu.' },
        { label: 'Penutup', teks: 'Meskipun sederhana, pasar pagi itu selalu membuatku merasa dekat dengan kehidupan warga kampungku.' }
      ]
    }
  ],

  /* --- 4b. Tebak Objek: tebak objek dari kutipan deskripsi --- */
  tebak: [
    { id: 't1', kutipan: 'Atapnya melengkung runcing menyerupai tanduk kerbau, sedangkan dindingnya berupa papan berukir motif akar dan bunga.',
      jawab: 'Rumah Gadang', opsi: ['Rumah Gadang', 'Candi Borobudur', 'Kapal Pinisi', 'Masjid Agung'],
      bahasan: 'Kata kunci "atap melengkung seperti tanduk kerbau" dan "papan berukir" adalah ciri Rumah Gadang.' },
    { id: 't2', kutipan: 'Bangunannya berbentuk piramida bertingkat, tingginya sekitar 35 meter, dan berdiri di Kabupaten Magelang.',
      jawab: 'Candi Borobudur', opsi: ['Monumen Nasional', 'Candi Prambanan', 'Candi Borobudur', 'Gedung Sate'],
      bahasan: 'Tinggi 35 meter, berbentuk piramida bertingkat, dan berlokasi di Magelang — itulah Candi Borobudur.' },
    { id: 't3', kutipan: 'Bulunya putih bersih, matanya bulat hijau seperti kelereng, dan ia suka mengejar bola benang.',
      jawab: 'Kucing', opsi: ['Kelinci', 'Kucing', 'Burung merpati', 'Ikan koi'],
      bahasan: 'Mata bulat hijau dan kebiasaan mengejar benang adalah ciri kucing.' },
    { id: 't4', kutipan: 'Pasirnya halus dan hangat, ombaknya panjang bergulung, dan banyak peselancar datang ke sana pada sore hari.',
      jawab: 'Pantai', opsi: ['Gunung', 'Pantai', 'Sawah', 'Hutan'],
      bahasan: 'Pasir, ombak, dan peselancar menunjukkan objek pantai.' },
    { id: 't5', kutipan: 'Daunnya lebar memanjang, batangnya beruas, dan buahnya bergantung berwarna kuning.',
      jawab: 'Pohon pisang', opsi: ['Pohon pisang', 'Pohon mangga', 'Pohon kelapa', 'Pohon jambu'],
      bahasan: 'Daun lebar memanjang dan batang beruas adalah ciri khas pohon pisang.' },
    { id: 't6', kutipan: 'Tubuhnya kecil, suaranya mendengung, dan ia hinggap di bunga untuk menghisap nektar.',
      jawab: 'Lebah', opsi: ['Kupu-kupu', 'Lebah', 'Capung', 'Semut'],
      bahasan: 'Suara mendengung dan kebiasaan menghisap nektar menunjukkan lebah.' },
    { id: 't7', kutipan: 'Beroda dua, sadelnya kulit tua, belnya berbunyi "tring-tring", dan rangkanya tebal berwarna hitam.',
      jawab: 'Sepeda ontel', opsi: ['Sepeda ontel', 'Sepatu bola', 'Kipas angin', 'Payung'],
      bahasan: 'Roda dua, sadel kulit, dan bel "tring-tring" menggambarkan sepeda ontel.' },
    { id: 't8', kutipan: 'Airnya masih mengepul, aromanya harum, rasanya manis, dan biasa disajikan pada pagi hari.',
      jawab: 'Secangkir teh manis', opsi: ['Es kelapa', 'Secangkir teh manis', 'Jus jeruk', 'Air putih'],
      bahasan: 'Mengepul, harum, dan manis adalah ciri minuman hangat seperti teh manis.' }
  ],

  /* --- 4c. Berburu Kata Sifat --- */
  sifat: {
    detik: 70,
    level: [
      {
        id: 'mudah', nama: 'Mudah',
        kata: [
          { w: 'indah', s: true }, { w: 'bersih', s: true }, { w: 'harum', s: true },
          { w: 'lembut', s: true }, { w: 'tinggi', s: true }, { w: 'cerah', s: true },
          { w: 'meja', s: false }, { w: 'berlari', s: false }, { w: 'dan', s: false },
          { w: 'kemarin', s: false }, { w: 'buku', s: false }, { w: 'menulis', s: false }
        ]
      },
      {
        id: 'sedang', nama: 'Sedang',
        kata: [
          { w: 'jernih', s: true }, { w: 'gurih', s: true }, { w: 'dingin', s: true },
          { w: 'ramai', s: true }, { w: 'kasar', s: true }, { w: 'gagah', s: true },
          { w: 'sejuk', s: true },
          { w: 'sekolah', s: false }, { w: 'berjalan', s: false }, { w: 'karena', s: false },
          { w: 'sungai', s: false }, { w: 'menari', s: false }
        ]
      },
      {
        id: 'sulit', nama: 'Sulit',
        kata: [
          { w: 'semerbak', s: true }, { w: 'lengang', s: true }, { w: 'keemasan', s: true },
          { w: 'rimbun', s: true }, { w: 'kusut', s: true }, { w: 'licin', s: true },
          { w: 'khidmat', s: true },
          { w: 'pancaran', s: false }, { w: 'keindahan', s: false }, { w: 'menggema', s: false },
          { w: 'tarian', s: false }, { w: 'pepohonan', s: false }
        ]
      }
    ]
  },

  /* ======================================================================
     5. TANTANGAN MENULIS
     ====================================================================== */
  tema: [
    {
      id: 'w1', judul: 'Ruang Kelasku', jenis: 'Tempat', ico: '🏫', targetKata: 120,
      petunjuk: 'Amati ruang kelasmu. Perhatikan susunan meja, dinding, papan tulis, jendela, dan suasana saat pelajaran berlangsung.',
      contohJudul: 'Kelas VII A, Ruang Belajar Favoritku',
      pemandu: [
        'Di mana letak kelasmu dan apa nama kelasnya?',
        'Bagaimana susunan meja dan kursi di dalam kelas?',
        'Apa yang tergantung atau tertempel di dinding kelas?',
        'Suara apa yang terdengar ketika pelajaran berlangsung?',
        'Bagaimana perasaanmu saat berada di kelas itu?'
      ],
      indra: [
        { nama: 'Penglihatan', ico: '👁️', contoh: 'warna dinding, cahaya dari jendela, kerapian meja' },
        { nama: 'Pendengaran', ico: '👂', contoh: 'suara guru, gesekan kursi, bel istirahat' },
        { nama: 'Penciuman', ico: '👃', contoh: 'aroma kapur tulis, bau penghapus, wangi bunga meja' },
        { nama: 'Perabaan', ico: '✋', contoh: 'permukaan meja kayu, dinginnya besi kursi' },
        { nama: 'Pengecapan', ico: '👄', contoh: 'rasa air minum saat istirahat (bila relevan)' }
      ]
    },
    {
      id: 'w2', judul: 'Tempat Favorit di Rumahku', jenis: 'Tempat / Suasana', ico: '🏡', targetKata: 120,
      petunjuk: 'Pilih satu sudut rumah yang paling kamu sukai: kamar, teras, dapur, atau halaman.',
      contohJudul: 'Teras Belakang, Sudut Favoritku',
      pemandu: [
        'Di bagian mana rumahmu tempat itu berada?',
        'Benda apa saja yang ada di sana?',
        'Bagaimana cahaya dan udaranya pada pagi atau sore hari?',
        'Apa yang biasa kamu lakukan di sana?',
        'Mengapa tempat itu terasa istimewa bagimu?'
      ],
      indra: [
        { nama: 'Penglihatan', ico: '👁️', contoh: 'cahaya matahari, warna cat, tanaman' },
        { nama: 'Pendengaran', ico: '👂', contoh: 'kicau burung, suara hujan, derit pintu' },
        { nama: 'Penciuman', ico: '👃', contoh: 'aroma kopi, wangi tanah setelah hujan' },
        { nama: 'Perabaan', ico: '✋', contoh: 'dinginnya lantai keramik, hangatnya kursi rotan' },
        { nama: 'Pengecapan', ico: '👄', contoh: 'manisnya teh yang diminum di sana' }
      ]
    },
    {
      id: 'w3', judul: 'Hewan di Sekitarku', jenis: 'Hewan', ico: '🐾', targetKata: 120,
      petunjuk: 'Pilih satu hewan yang benar-benar kamu kenal: hewan peliharaan, hewan di sekolah, atau hewan di sekitar rumah.',
      contohJudul: 'Koko, Ayam Jago Tetanggaku',
      pemandu: [
        'Apa nama atau sebutan hewan itu dan sejak kapan kamu mengenalnya?',
        'Bagaimana bentuk tubuh, warna, dan ukuran bagian tubuhnya?',
        'Bagaimana tingkah lakunya ketika makan atau bermain?',
        'Suara apa yang dikeluarkannya?',
        'Apa kesanmu terhadap hewan itu?'
      ],
      indra: [
        { nama: 'Penglihatan', ico: '👁️', contoh: 'warna bulu, bentuk mata, gerak ekor' },
        { nama: 'Pendengaran', ico: '👂', contoh: 'dengkur, kicau, gonggongan, kepakan sayap' },
        { nama: 'Penciuman', ico: '👃', contoh: 'bau bulu basah, aroma kandang' },
        { nama: 'Perabaan', ico: '✋', contoh: 'halusnya bulu, kasarnya telapak kaki' },
        { nama: 'Pengecapan', ico: '👄', contoh: 'tidak selalu relevan — boleh dilewati' }
      ]
    },
    {
      id: 'w4', judul: 'Orang yang Aku Kagumi', jenis: 'Orang', ico: '🧑', targetKata: 130,
      petunjuk: 'Tulis tentang satu orang yang paling berkesan bagimu: ibu, ayah, kakak, nenek, atau gurumu.',
      contohJudul: 'Nenek, Perempuan Bersuara Lembut',
      pemandu: [
        'Siapa namanya, berapa usianya, dan apa pekerjaannya?',
        'Bagaimana ciri fisik yang paling khas pada dirinya?',
        'Bagaimana sifat dan kebiasaannya sehari-hari?',
        'Apa hal yang paling kamu ingat dari perbuatannya?',
        'Apa kesan dan harapanmu untuknya?'
      ],
      indra: [
        { nama: 'Penglihatan', ico: '👁️', contoh: 'rambut beruban, kerutan di mata, cara berpakaian' },
        { nama: 'Pendengaran', ico: '👂', contoh: 'suara lembut, tawa, nada menasihati' },
        { nama: 'Penciuman', ico: '👃', contoh: 'aroma minyak kayu putih, wangi sabun' },
        { nama: 'Perabaan', ico: '✋', contoh: 'tangan kasar dan hangat, elusan di kepala' },
        { nama: 'Pengecapan', ico: '👄', contoh: 'rasa masakan khasnya' }
      ]
    },
    {
      id: 'w5', judul: 'Makanan Khas Daerahku', jenis: 'Benda / Kuliner', ico: '🍲', targetKata: 120,
      petunjuk: 'Pilih satu makanan khas daerahmu yang paling kamu kenal, termasuk cara penyajiannya.',
      contohJudul: 'Soto Banjar, Hangatnya Kampung Halaman',
      pemandu: [
        'Apa nama makanan itu dan dari daerah mana asalnya?',
        'Bagaimana bentuk, warna, dan bahan utamanya?',
        'Bagaimana aroma dan rasanya saat masih hangat?',
        'Bagaimana cara penyajiannya dan dengan apa ia dimakan?',
        'Apa kesanmu terhadap makanan itu?'
      ],
      indra: [
        { nama: 'Penglihatan', ico: '👁️', contoh: 'warna kuah, bentuk potongan, taburan bawang goreng' },
        { nama: 'Penciuman', ico: '👃', contoh: 'aroma rempah, wangi santan, harum daun jeruk' },
        { nama: 'Pengecapan', ico: '👄', contoh: 'gurih, pedas, asam segar' },
        { nama: 'Perabaan', ico: '✋', contoh: 'hangat mangkuk di telapak tangan' },
        { nama: 'Pendengaran', ico: '👂', contoh: 'suara kuah dituang, sendok berdenting' }
      ]
    },
    {
      id: 'w6', judul: 'Suasana Pagi di Lingkunganku', jenis: 'Suasana', ico: '🌅', targetKata: 120,
      petunjuk: 'Gambarkan suasana pagi di sekitar rumahmu dari pukul lima hingga pukul tujuh.',
      contohJudul: 'Pagi di Gang Kecil Kami',
      pemandu: [
        'Bagaimana keadaan langit dan udara saat itu?',
        'Suara apa saja yang terdengar?',
        'Kegiatan apa yang dilakukan warga sekitar?',
        'Aroma apa yang tercium pada waktu itu?',
        'Apa yang kamu rasakan menyaksikan suasana tersebut?'
      ],
      indra: [
        { nama: 'Penglihatan', ico: '👁️', contoh: 'kabut tipis, cahaya keemasan, embun' },
        { nama: 'Pendengaran', ico: '👂', contoh: 'suara azan, sapu menyapu jalan, klakson jauh' },
        { nama: 'Penciuman', ico: '👃', contoh: 'aroma nasi baru matang, bau tanah basah' },
        { nama: 'Perabaan', ico: '✋', contoh: 'udara sejuk, angin tipis' },
        { nama: 'Pengecapan', ico: '👄', contoh: 'rasa hangat minuman pagi' }
      ]
    }
  ],

  /* ======================================================================
     6. RUBRIK, REFLEKSI, DAN LEKSIKON PENILAIAN
     ====================================================================== */
  refleksiAspek: [
    { id: 'r1', teks: 'Keaslian pengamatan — objek benar-benar saya amati, bukan sekadar dikarang.' },
    { id: 'r2', teks: 'Kelengkapan struktur — identifikasi, deskripsi bagian, dan penutup sudah ada.' },
    { id: 'r3', teks: 'Kekayaan kata — saya memakai banyak kata sifat dan kalimat perincian.' },
    { id: 'r4', teks: 'Penggunaan pancaindra — saya melibatkan beberapa indra, bukan hanya penglihatan.' },
    { id: 'r5', teks: 'Kerapian ejaan — huruf kapital, tanda baca, dan penulisan "di" sudah benar.' }
  ],

  refleksiChecklist: [
    'Judul saya menunjukkan objek khusus dan menarik.',
    'Bagian identifikasi menyebut nama dan lokasi/asal objek.',
    'Saya merinci objek dengan angka, ukuran, warna, atau jumlah.',
    'Saya melibatkan minimal tiga pancaindra.',
    'Saya memakai majas atau perumpamaan minimal satu kali.',
    'Saya membaca ulang dan memperbaiki ejaan sebelum menyimpan.'
  ],

  leksikon: {
    /* Daftar kata sifat untuk deteksi otomatis pada rubrik dan permainan */
    sifat: ['indah', 'elok', 'memesona', 'menawan', 'cantik', 'rupawan', 'gagah', 'tampan', 'mungil', 'besar', 'kecil', 'tinggi', 'rendah', 'panjang', 'pendek', 'lebar', 'luas', 'sempit', 'bulat', 'lonjong', 'tipis', 'tebal', 'berat', 'ringan', 'bersih', 'kotor', 'jernih', 'bening', 'keruh', 'cerah', 'gelap', 'redup', 'terang', 'berkilau', 'gemerlap', 'keemasan', 'keperakan', 'putih', 'hitam', 'merah', 'biru', 'hijau', 'kuning', 'jingga', 'ungu', 'cokelat', 'kecokelatan', 'harum', 'wangi', 'semerbak', 'menyengat', 'amis', 'tengik', 'manis', 'asam', 'asin', 'pahit', 'gurih', 'pedas', 'sepat', 'lezat', 'nikmat', 'segar', 'hangat', 'panas', 'dingin', 'sejuk', 'lembap', 'basah', 'kering', 'halus', 'kasar', 'lembut', 'licin', 'kesat', 'tajam', 'tumpul', 'keras', 'empuk', 'renyah', 'lengang', 'ramai', 'riuh', 'senyap', 'hening', 'sunyi', 'khidmat', 'nyaman', 'asri', 'rimbun', 'gersang', 'subur', 'rindang', 'kusut', 'rapi', 'teratur', 'berantakan', 'kokoh', 'kuat', 'rapuh', 'runcing', 'lengkung', 'bergelombang', 'rata', 'curam', 'dangkal', 'dalam', 'gagah', 'anggun', 'sopan', 'ramah', 'sabar', 'tegas', 'rajin', 'malas', 'cerdik', 'jenaka', 'sedih', 'riang', 'bahagia', 'bangga', 'kagum', 'rindu', 'tenang', 'gelisah', 'lelah', 'sehat', 'sakit', 'kaya', 'miskin', 'berani', 'takut', 'jujur', 'adil', 'bijak', 'indahnya', 'megah', 'megahnya', 'melekat', 'wangi', 'khas', 'unik', 'langka', 'mahal', 'murah'],

    /* Kata penanda pancaindra */
    indra: {
      lihat: ['warna', 'terang', 'gelap', 'redup', 'cerah', 'berkilau', 'gemerlap', 'memancar', 'bersinar', 'tampak', 'terlihat', 'jernih', 'bening', 'keemasan', 'keperakan', 'putih', 'hitam', 'merah', 'biru', 'hijau', 'kuning', 'jingga', 'ungu', 'cokelat', 'kecokelatan', 'bentuk', 'tinggi', 'rendah', 'lebar', 'luas', 'sempit', 'panjang', 'pendek', 'bulat', 'lonjong', 'megah', 'indah', 'cantik', 'elok', 'memesona'],
      dengar: ['suara', 'bunyi', 'gemericik', 'berdesir', 'desau', 'kicau', 'nyanyian', 'gemuruh', 'riuh', 'senyap', 'hening', 'sunyi', 'denting', 'dentingan', 'gema', 'terdengar', 'mendengar', 'berdentang', 'berderit', 'bisik', 'celoteh', 'sahut', 'bersahutan', 'mendengung', 'deru', 'gamang', 'lengang'],
      cium: ['aroma', 'bau', 'wangi', 'harum', 'semerbak', 'semriwing', 'menyengat', 'menyeruak', 'amis', 'tengik', 'harumnya', 'wanginya', 'aroma'],
      rasa: ['rasa', 'manis', 'asam', 'pahit', 'asin', 'gurih', 'pedas', 'sepat', 'lezat', 'nikmat', 'segar', 'kecut', 'hambar', 'rasanya'],
      raba: ['halus', 'kasar', 'lembut', 'dingin', 'sejuk', 'hangat', 'panas', 'lembap', 'basah', 'kering', 'tajam', 'keras', 'empuk', 'licin', 'berbulu', 'kesat', 'renyah', 'menyentuh', 'tersentuh', 'terasa']
    },

    /* Penanda majas perumpamaan */
    majas: ['seperti', 'bagaikan', 'laksana', 'seumpama', 'serupa', 'bak', 'seolah', 'seakan', 'bagai', 'menyerupai', 'mirip'],

    /* Penanda kalimat perincian */
    perincian: ['meter', 'sentimeter', 'kilometer', 'kaki', 'tingkat', 'tahun', 'bulan', 'hari', 'pukul', 'jam', 'menit', 'buah', 'batang', 'ekor', 'buah', 'hektar', 'kilo', 'kilogram', 'gram', 'liter', 'orang', 'lembar', 'bilah', 'helai', 'puluh', 'ratus', 'ribu', 'juta']
  }
};
