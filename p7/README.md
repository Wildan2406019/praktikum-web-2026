# Modul 7 — CRUD Full-Stack JavaScript

Nama: Wildan Sonhajul Mukarom  
NIM: 2406019  
Kelas: Informatika A

## Menjalankan di Laragon

1. Klik **Start All** di Laragon agar MySQL aktif.
2. Buka HeidiSQL/phpMyAdmin dan jalankan `database.sql` untuk membuat database, tabel, dan dua data contoh. Jalankan bagian INSERT sekali saja.
3. Buka terminal pada folder `p7`, lalu jalankan:

   ```sh
   npm install
   npm start
   ```

4. Buka http://localhost:3000. Gunakan server Node.js ini agar Fetch API dapat mengakses backend.

Koneksi bawaan: localhost:3306, user root, password kosong, database db_kampus. Jika berbeda, atur environment variable DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, dan DB_NAME sebelum menjalankan server.

## Fitur tugas mandiri

- Pencarian nama/NIM real-time melalui event `input` dan `listMahasiswa.filter(...)`.
- Validasi NIM duplikat menggunakan `.some()` sebelum `fetch()`, dengan alert `NIM sudah terdaftar!`. Edit tetap boleh memakai NIM sendiri.
- Counter `Total Mahasiswa Terdaftar: X Orang` diperbarui setelah tambah/hapus berhasil. Pencarian tidak mengubah total terdaftar.
- Operasi tambah, lihat, edit, hapus tersimpan melalui REST API Express dan MySQL. Query memakai parameter, dan NIM juga dijaga UNIQUE di database.

## Uji manual

1. Muat halaman: dua data contoh tampil dan counter menunjukkan 2 Orang.
2. Cari potongan nama (huruf besar/kecil) atau NIM: tabel langsung tersaring; hapus pencarian untuk mengembalikan semua baris.
3. Tambah mahasiswa dengan NIM baru: baris dan counter bertambah tanpa reload halaman.
4. Tambah NIM yang sama: alert muncul dan data tidak dikirim/ditambahkan.
5. Edit nama tanpa mengganti NIM: berhasil. Ubah NIM menjadi milik baris lain: ditolak.
6. Hapus mahasiswa dan setujui konfirmasi: baris dan counter berkurang. Batalkan konfirmasi: data tetap.
7. Cari kata yang tidak ada: pesan hasil kosong muncul, total tetap. Uji tambah/hapus saat pencarian aktif.
8. Hentikan MySQL: operasi menampilkan pesan gagal dan tidak mengubah counter.
