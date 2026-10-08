# Mockup interaktif PVML

Mockup Sistem Pengawasan PVML berbahasa Indonesia dengan logo OJK dan palet merah, hitam, serta putih. Bukan situs resmi OJK.

Beranda menampilkan simulasi agregat tiga sektor: pembiayaan, modal ventura, dan lembaga keuangan mikro. Indikator mencakup total aset, debitur, cabang, perusahaan, dan pembiayaan/penyertaan. Pilihan periode April–Juni 2026 dan cakupan sektor memperbarui angka, grafik tren, komposisi aset, serta tabel ringkasan. Klik bulan di bawah grafik untuk membaca nilai asetnya. Semua angka agregat merupakan ilustrasi dan terpisah dari contoh kertas kerja PT Sarana Kalteng Ventura.

## Menjalankan

Memerlukan Node.js 20.19+ atau 22.12+.

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

Alur: login → Beranda → Know Your Financial Institution / Tingkat Kesehatan PVML / Supervisory Plan. Login wajib menggunakan akun dummy: username **pengawas**, kata sandi **PVML2026!**. Kombinasi lain ditolak dengan pesan kesalahan. Detail akun tersedia di **Bantuan masuk**; tidak ada tombol masuk langsung. Login merupakan simulasi di browser, bukan autentikasi server. Kata sandi tidak disimpan atau dikirim. Penanda sesi dummy disimpan di sessionStorage hingga keluar atau sesi browser berakhir; sesi dari versi login lama tidak digunakan.

Menu Know Your Financial Institution menyediakan kartu pengenalan yang bisa dibuka. Menu **Tingkat Kesehatan PVML** membuka daftar perusahaan secara langsung, tanpa submenu. Alurnya: **Tingkat Kesehatan PVML → pilih perusahaan → daftar kertas kerja → ikon pensil → output penilaian TKS**.

Pilih **PT Sarana Kalteng Ventura** untuk membuka daftar 25 kertas kerja dalam lima kelompok: Profil Risiko (9), Tata Kelola (13), Rentabilitas (1), Permodalan (1), dan TKS (1). Kelompok dapat dibuka/tutup. Setiap baris memiliki status dan ikon kaca pembesar untuk melihat kertas kerja. Pensil pada **Analisis Profil Risiko**, **Peringkat Komposit**, **Rentabilitas**, **Permodalan**, dan **Tingkat Kesehatan PVML** membuka editor masing-masing. Pensil lainnya membuka contoh output penilaian TKS. Tombol kembali pada output membuka daftar kertas kerja perusahaan yang sama dan mengembalikan fokus ke ikon pensil asal. Status awal merupakan simulasi: 20 selesai dan lima editor penilaian belum diisi. Status kelima editor mengikuti draft/submission yang tersimpan di browser.

Halaman **Analisis Profil Risiko** mengikuti referensi baru: tabel delapan risiko (Strategis, Operasional, Kredit, Pasar, Likuiditas, Hukum, Kepatuhan, Reputasi), masing-masing dengan Risiko Inheren/KPMR/Tingkat Risiko pada tiga kelompok penilaian, lalu tabel Peringkat Risiko keseluruhan. Peringkat 1–5 dapat dipilih manual jika tersedia dan langsung tersimpan; tidak ada perhitungan peringkat otomatis. Satu header merah **Analisa** menaungi delapan judul risiko abu-abu. Setiap risiko memiliki dua narasi, Risiko Inheren dan Kualitas Penerapan Manajemen Risiko, dengan tombol **Simpan** per isian (total 16). Narasi kosong ditolak; perubahan narasi membuat isian belum tersimpan kembali. **Submit** hanya aktif setelah seluruh 16 narasi terisi dan versi terkininya disimpan. Submit menyimpan status/waktu dan mengunci editor; **Edit kembali** membuka draft untuk revisi. Narasi/peringkat yang disimpan dan status submit bertahan setelah reload melalui localStorage, khusus perusahaan SKV-001/periode Juni 2026/browser ini. Narasi yang belum di-save hanya bertahan saat navigasi tanpa reload. Kegagalan penyimpanan ditampilkan sebagai error dan tidak dianggap berhasil. Belum ada pengiriman server.

Editor **Peringkat Komposit** pada kelompok Tata Kelola menampilkan baris **Peringkat Tata Kelola yang Baik**. Editor **Rentabilitas** dan **Permodalan** masing-masing menampilkan satu baris peringkat. Ketiganya memakai header merah, tiga kelompok penilaian dengan peringkat manual 1–5, serta satu kolom **Analisa**.

Editor **Tingkat Kesehatan PVML** mengikuti referensi historis: pengawas sebelumnya **Desember 2024**, perusahaan/self assessment **Desember 2025**, pengawas saat ini **Desember 2025**. Tabel memuat empat faktor dan Peringkat Komposit Akhir **2 / 1 / 2** dengan latar abu-abu, tanpa Nilai Komposit atau Peringkat Komposit by system. Di bawahnya ada satu kolom **Analisis**. Peringkat TKS mengikuti angka referensi tetap, tanpa perhitungan otomatis. Periode identitas pada editor TKS juga Desember 2025; halaman contoh output terpisah tetap memakai Juni 2026.

Keempat editor memiliki **Simpan Analisa**, **Submit**, dan **Edit kembali**. Narasi kosong ditolak, dan submit hanya aktif setelah versi terkini narasi disimpan. Setelah submit editor terkunci, status daftar menjadi Selesai; Edit kembali membuka draft. Data disimpan terpisah melalui localStorage per jenis kertas kerja/perusahaan/periode, termasuk peringkat manual dan waktu submit, sehingga tidak saling menimpa dan bertahan setelah reload. Narasi tersimpan ditampilkan pada dialog kaca pembesar. Tidak ada pengiriman ke server.

Halaman Daftar mengikuti struktur dua gambar referensi: identitas perusahaan dan periode, metadata penilaian, versi/status, serta tabel Kertas Kerja/Status/Aksi.

Output menampilkan penilaian **PT Sarana Kalteng Ventura** berdasarkan gambar referensi: informasi perusahaan, metadata penilaian, tiga kelompok penilaian dengan satu kolom **Peringkat** untuk masing-masing kelompok, empat faktor, nilai komposit, peringkat komposit, dan peringkat akhir. Kolom Bobot dan Nilai Faktor tidak ditampilkan. Angka simulasi mengikuti contoh: nilai komposit sebelumnya **2,25**, perusahaan **1,15**, dan pengawas saat ini **1,95**. Peringkat akhir self assessment tidak tersedia pada contoh sehingga selnya diberi arsiran abu-abu. Status output mengikuti status simulasi kertas kerja TKS. Nilai faktor dihitung dari peringkat × bobot; peringkat komposit masih mengikuti contoh, bukan metodologi resmi. Tautan referensi membuka skala ilustratif dan tombol kembali membawa ke daftar kertas kerja perusahaan yang dipilih; dari sana pengguna dapat kembali ke daftar perusahaan.

Menu **Supervisory Plan**, tepat di bawah Tingkat Kesehatan PVML, langsung membuka pemantauan **PT Sarana Kalteng Ventura** tahun 2026. Struktur mengikuti gambar referensi: identitas perusahaan, tanggal rencana/pemantauan, versi 1 dan Draft, tabel fokus/objek/strategi/status/keterangan, riwayat persetujuan, dan dokumen pendukung. Dua contoh pemantauan mencakup Tata Kelola dan Risiko Kepatuhan. Tombol Edit membuka editor uraian, status, dan keterangan; ikon pensil di identitas membuka editor tahun dan tanggal. Simpan memperbarui tampilan, sedangkan Batal tidak menyimpan. Data riwayat merupakan contoh tetap, terpisah dari perubahan metadata rencana terkini.

Pilih File menerima beberapa dokumen docx, xlsx, pptx, pdf, atau zip, maksimal 25 MB per file, dan menampilkan nama/ukuran dokumen yang dapat dihapus dari daftar. Dokumen hanya dipilih secara lokal untuk demonstrasi; tidak ada unggahan server. Perubahan pemantauan, periode, dan daftar dokumen bertahan dalam memori saat berpindah menu, lalu kembali ke kondisi awal saat halaman dimuat ulang.

## Preview dalam satu file

```sh
npm run build:standalone
```

Buka `dist/mockup-preview.html` di browser. File ini menyertakan JavaScript, CSS, dan font sehingga tidak memerlukan server atau koneksi internet untuk menampilkan mockup. Buat ulang file ini setelah mengubah kode. Jika kebijakan browser melarang pembukaan file lokal, jalankan aplikasi melalui server development.

Mockup mendukung tampilan desktop dan ponsel, navigasi keyboard, bantuan login, tampil/sembunyikan kata sandi, serta keluar dari sesi demo.
