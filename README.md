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

Alur: login → Beranda → Know Your Financial Institution / Tingkat Kesehatan PVML / Supervisory Plan. Gunakan email valid dan kata sandi apa pun, atau tombol **Coba akun demo**. Login hanya simulasi; kata sandi tidak disimpan atau dikirim. Nama pengguna demo disimpan di sessionStorage hingga keluar atau sesi browser berakhir.

Menu Know Your Financial Institution menyediakan kartu pengenalan yang bisa dibuka. Menu **Tingkat Kesehatan PVML** membuka daftar perusahaan secara langsung, tanpa submenu. Alurnya: **Tingkat Kesehatan PVML → pilih perusahaan → daftar kertas kerja → ikon pensil → output penilaian TKS**.

Pilih **PT Sarana Kalteng Ventura** untuk membuka daftar 25 kertas kerja dalam lima kelompok: Profil Risiko (9), Tata Kelola (13), Rentabilitas (1), Permodalan (1), dan TKS (1). Kelompok dapat dibuka/tutup. Setiap baris memiliki status, ikon kaca pembesar untuk melihat kertas kerja, dan ikon pensil untuk langsung membuka output penilaian TKS perusahaan yang dipilih. Tombol kembali pada output membuka daftar kertas kerja perusahaan yang sama dan mengembalikan fokus ke ikon pensil asal. Status awal merupakan simulasi: 24 selesai dan TKS dalam proses review.

Halaman Daftar mengikuti struktur dua gambar referensi: identitas perusahaan dan periode, metadata penilaian, versi/status, serta tabel Kertas Kerja/Status/Aksi.

Output menampilkan penilaian **PT Sarana Kalteng Ventura** berdasarkan gambar referensi: informasi perusahaan, metadata penilaian, tiga kelompok penilaian, empat faktor, nilai komposit, peringkat komposit, dan peringkat akhir. Angka simulasi mengikuti contoh: nilai komposit sebelumnya **2,25**, perusahaan **1,15**, dan pengawas saat ini **1,95**. Peringkat akhir self assessment tidak tersedia pada contoh sehingga selnya diberi arsiran abu-abu. Status output mengikuti status simulasi kertas kerja TKS. Nilai faktor dihitung dari peringkat × bobot; peringkat komposit masih mengikuti contoh, bukan metodologi resmi. Tautan referensi membuka skala ilustratif dan tombol kembali membawa ke daftar kertas kerja perusahaan yang dipilih; dari sana pengguna dapat kembali ke daftar perusahaan.

Menu **Supervisory Plan**, tepat di bawah Tingkat Kesehatan PVML, langsung membuka pemantauan **PT Sarana Kalteng Ventura** tahun 2026. Struktur mengikuti gambar referensi: identitas perusahaan, tanggal rencana/pemantauan, versi 1 dan Draft, tabel fokus/objek/strategi/status/keterangan, riwayat persetujuan, dan dokumen pendukung. Dua contoh pemantauan mencakup Tata Kelola dan Risiko Kepatuhan. Tombol Edit membuka editor uraian, status, dan keterangan; ikon pensil di identitas membuka editor tahun dan tanggal. Simpan memperbarui tampilan, sedangkan Batal tidak menyimpan. Data riwayat merupakan contoh tetap, terpisah dari perubahan metadata rencana terkini.

Pilih File menerima beberapa dokumen docx, xlsx, pptx, pdf, atau zip, maksimal 25 MB per file, dan menampilkan nama/ukuran dokumen yang dapat dihapus dari daftar. Dokumen hanya dipilih secara lokal untuk demonstrasi; tidak ada unggahan server. Perubahan pemantauan, periode, dan daftar dokumen bertahan dalam memori saat berpindah menu, lalu kembali ke kondisi awal saat halaman dimuat ulang.

## Preview dalam satu file

```sh
npm run build:standalone
```

Buka `dist/mockup-preview.html` di browser. File ini menyertakan JavaScript, CSS, dan font sehingga tidak memerlukan server atau koneksi internet untuk menampilkan mockup. Buat ulang file ini setelah mengubah kode. Jika kebijakan browser melarang pembukaan file lokal, jalankan aplikasi melalui server development.

Mockup mendukung tampilan desktop dan ponsel, navigasi keyboard, bantuan login, tampil/sembunyikan kata sandi, serta keluar dari sesi demo.
