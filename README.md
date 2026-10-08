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

Alur: login → Beranda → Know Your PVML / Tingkat Kesehatan PVML. Gunakan email valid dan kata sandi apa pun, atau tombol **Coba akun demo**. Login hanya simulasi; kata sandi tidak disimpan atau dikirim. Nama pengguna demo disimpan di sessionStorage hingga keluar atau sesi browser berakhir.

Menu Know Your PVML menyediakan kartu pengenalan yang bisa dibuka. Menu Tingkat Kesehatan PVML memiliki dua submenu: **Daftar Kertas Kerja Penilaian TKS** dan **Output Kertas Kerja Penilaian TKS**.

Pada submenu Daftar, pilih **PT Sarana Kalteng Ventura** untuk membuka daftar 25 kertas kerja dalam lima kelompok: Profil Risiko (9), Tata Kelola (13), Rentabilitas (1), Permodalan (1), dan TKS (1). Kelompok dapat dibuka/tutup. Setiap baris memiliki status, aksi lihat, dan aksi edit catatan serta status. Simpan memperbarui baris dan jumlah kertas kerja selesai; batal tidak menyimpan perubahan. Perubahan hanya disimpan dalam memori selama halaman browser tidak dimuat ulang. Status awal merupakan simulasi: 24 selesai dan TKS dalam proses review.

Halaman Daftar mengikuti struktur dua gambar referensi: identitas perusahaan dan periode, metadata penilaian, versi/status, serta tabel Kertas Kerja/Status/Aksi.

Submenu Output langsung menampilkan output **PT Sarana Kalteng Ventura** berdasarkan gambar referensi: informasi perusahaan, metadata penilaian, tiga kelompok penilaian, empat faktor, nilai komposit, peringkat komposit, dan peringkat akhir. Angka simulasi mengikuti contoh: nilai komposit sebelumnya **2,25**, perusahaan **1,15**, dan pengawas saat ini **1,95**. Peringkat akhir self assessment tidak tersedia pada contoh sehingga selnya diberi arsiran abu-abu. Status output mengikuti status kertas kerja TKS yang dapat diubah pada submenu Daftar. Nilai faktor dihitung dari peringkat × bobot; peringkat komposit masih mengikuti contoh, bukan metodologi resmi. Tautan referensi membuka skala ilustratif dan tombol daftar membawa kembali ke daftar perusahaan.

## Preview dalam satu file

```sh
npm run build:standalone
```

Buka `dist/mockup-preview.html` di browser. File ini menyertakan JavaScript, CSS, dan font sehingga tidak memerlukan server atau koneksi internet untuk menampilkan mockup. Buat ulang file ini setelah mengubah kode. Jika kebijakan browser melarang pembukaan file lokal, jalankan aplikasi melalui server development.

Mockup mendukung tampilan desktop dan ponsel, navigasi keyboard, bantuan login, tampil/sembunyikan kata sandi, serta keluar dari sesi demo.
