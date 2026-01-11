# SPK SMART - Sistem Pendukung Keputusan

Aplikasi ini adalah Sistem Pendukung Keputusan (SPK) menggunakan metode **SMART** (*Simple Multi Attribute Rating Technique*). Aplikasi ini membantu memilih alternatif terbaik (misalnya pemilihan lokasi) berdasarkan kriteria dan bobot yang ditentukan.

---

## 🛠️ Persiapan (Wajib Install Dulu)

Sebelum menjalankan aplikasi, pastikan di komputer/laptop kakak sudah terinstall aplikasi berikut:

1.  **Node.js** (Wajib)
    * Download di: [nodejs.org](https://nodejs.org/)
    * Pilih versi **LTS** (Recommended).
    * Setelah install, cek di cmd/terminal dengan ketik: `node -v` (kalau keluar angka versi, berarti aman).

2.  **XAMPP** (Untuk Databasenya)
    * Download di: [apachefriends.org](https://www.apachefriends.org/download.html)
    * Ini dipakai supaya kita punya database MariaDB/MySQL di laptop (Localhost).

3.  **VS Code** (Text Editor)
    * Supaya gampang edit kodenya.

---

## 🚀 Cara Menjalankan Project (Cara Manual / Tanpa Docker)

Cara ini cocok kalau kakak mau jalanin di laptop biasa menggunakan XAMPP.

### Langkah 1: Siapkan Database
1.  Buka aplikasi **XAMPP Control Panel**.
2.  Klik tombol **Start** pada bagian **Apache** dan **MySQL**.
3.  Buka browser (Chrome/Edge), ketik: `http://localhost/phpmyadmin`.
4.  Buat database baru dengan nama: **`spk_smart`**.
5.  Klik tab **Import**, lalu pilih file `mariadb/user.sql` yang ada di folder project ini.
6.  Klik **Go** / **Kirim**. (Database sudah siap!).

### Langkah 2: Menjalankan Backend (Server API)
Ini adalah "otak" aplikasinya. Harus dinyalakan dulu.

1.  Buka terminal (bisa pakai Command Prompt atau Terminal di VS Code).
2.  Masuk ke folder server:
    ```bash
    cd server
    ```
3.  **PENTING:** Buat file baru di dalam folder `server` bernama `.env`.
4.  Isi file `.env` tersebut dengan pengaturan ini (copy paste saja):
    ```env
    PORT=3001
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=spk_smart
    ```
    *(Penjelasan: Karena pakai XAMPP default, password biasanya kosong. Kalau XAMPP kakak ada passwordnya, isi di bagian DB_PASSWORD).*
    
5.  Install library yang dibutuhkan:
    ```bash
    npm install
    ```
6.  Jalankan server:
    ```bash
    npm run dev
    ```
7.  **Jangan tutup terminal ini!** Biarkan tetap menyala. Kalau muncul tulisan *"Server running on port 3001"*, berarti berhasil.

### Langkah 3: Menjalankan Frontend (Tampilan Web)
Ini adalah tampilan webnya (SvelteKit).

1.  Buka terminal **BARU** (Terminal server tadi jangan dimatikan).
2.  Masuk ke folder aplikasi admin:
    ```bash
    cd app-admin
    ```
3.  Install library:
    ```bash
    npm install
    ```
4.  Jalankan website:
    ```bash
    npm run dev
    ```
5.  Akan muncul link, biasanya `http://localhost:5173`. Klik link itu atau buka di browser.
6.  Selesai! Aplikasi siap dipakai.

---

## 🐋 Cara Menjalankan Project (Pakai Docker)
Cara ini lebih praktis kalau di komputer sudah ada Docker Desktop. Tidak perlu XAMPP.

1.  Pastikan Docker Desktop sudah nyala.
2.  Buka terminal di folder utama project.
3.  Ketik perintah:
    ```bash
    docker-compose up -d --build
    ```
4.  Tunggu sampai selesai download dan install.
5.  Buka browser di `http://localhost:5173`.

---

## 💡 Penjelasan Konfigurasi Server (Untuk Kakak)

Di dalam folder `server` ada file `.env`. Ini ibarat "Kunci Kontak" untuk menyalakan mesin aplikasi. Berikut artinya:

* **PORT=3001**: Pintu masuk server. Server akan berjalan di alamat `localhost:3001`.
* **DB_HOST**: Alamat rumah database.
    * Kalau pakai **XAMPP**, isinya `localhost`.
    * Kalau pakai **Docker**, isinya `mariadb` (sesuai nama container).
* **DB_USER**: Username database. Default XAMPP adalah `root`.
* **DB_PASSWORD**: Password database. Default XAMPP biasanya kosong (tidak diisi apa-apa).
* **DB_NAME**: Nama database yang kita buat di phpMyAdmin tadi, yaitu `spk_smart`.

**Catatan:**
Jika backend error atau tidak bisa connect, 90% masalahnya ada di file `.env` ini. Pastikan username dan password XAMPP kakak sesuai.