# SPK SMART - Sistem Pendukung Keputusan

Aplikasi ini adalah Sistem Pendukung Keputusan (SPK) menggunakan metode **SMART**.
Berikut adalah panduan instalasi lengkap untuk pemula.

---

## 🛠️ Persiapan (Wajib Install)

Pastikan 3 aplikasi ini sudah ada di laptop:
1.  **Node.js LTS** ([Download disini](https://nodejs.org/)) - Cek dengan ketik `node -v` di terminal.
2.  **XAMPP** ([Download disini](https://www.apachefriends.org/)) - Untuk database.
3.  **VS Code** - Untuk edit kodingan.

---

## 🚀 Cara Menjalankan (Tanpa Docker / Manual)

Ini cara paling gampang buat di laptop biasa (Windows/Mac) pake XAMPP.

### 1. Siapkan Database
1.  Buka **XAMPP**, nyalakan (Start) **Apache** dan **MySQL**.
2.  Buka browser: `http://localhost/phpmyadmin`.
3.  Buat database baru bernama: **`spk_smart`**.
4.  Klik menu **Import**, pilih file `mariadb/user.sql` dari folder project ini, lalu klik **Go**.

### 2. Setting Backend (Otak Aplikasi)
Backend ini yang ngurusin hitungan rumusnya. Kita akan pakai **Port 3001** supaya aman dan tidak bentrok dengan aplikasi lain.

1.  Buka terminal, masuk ke folder server:
    ```bash
    cd server
    ```
2.  **PENTING:** Buat file baru bernama `.env` di dalam folder `server`.
3.  Copy-paste isinya persis seperti ini:
    ```env
    PORT=3001
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=spk_smart
    ```
    *(Catatan: `DB_PASSWORD` dikosongkan kalau XAMPP-nya standar. Kalau ada passwordnya, silakan diisi).*

4.  Install & Jalankan:
    ```bash
    npm install
    npm run dev
    ```
5.  Pastikan muncul tulisan: `Server running on port 3001`.
    *(Biarkan terminal ini terbuka, jangan disilang!)*

### 3. Konfigurasi Code Frontend (WAJIB DILAKUKAN!)
Karena kita menjalankannya di laptop sendiri (Localhost), kita harus kasih tau Frontend supaya ngobrol sama Backend di alamat `localhost`.

Buka folder **`app-admin/src/routes/`** pake VS Code.
Kamu harus mengedit **5 file** ini:
1.  `routes/+page.server.js`
2.  `routes/alternatif/+page.server.js`
3.  `routes/kriteria/+page.server.js`
4.  `routes/perhitungan/+page.server.js`
5.  `routes/laporan/+page.server.js`

Cari baris kode yang ada tulisannya:
> `http://api:3001`

**GANTI MENJADI:**
> `http://localhost:3001`

*(Jangan lupa di-SAVE semua filenya)*

### 4. Menjalankan Frontend (Tampilan Web)
1.  Buka terminal **BARU** (Terminal server tadi biarin aja nyala).
2.  Masuk ke folder app-admin:
    ```bash
    cd app-admin
    ```
3.  Install & Jalankan:
    ```bash
    npm install
    npm run dev
    ```
4.  Akan muncul link `http://localhost:5173`. Klik link itu untuk membuka aplikasi.

---

## 🐋 Cara Menjalankan (Pakai Docker)
Kalau di komputer sudah ada Docker, tidak perlu XAMPP dan tidak perlu edit-edit file di atas.

1.  Pastikan Docker Desktop nyala.
2.  Buka terminal di folder utama project.
3.  Ketik: `docker-compose up -d --build`
4.  Buka browser: `http://localhost:5173`

---

## ❓ Troubleshooting (Kalau Error)

**Q: Database Connection Error / ECONNREFUSED?**
* **Cek .env:** Pastikan username/password XAMPP benar.
* **Cek XAMPP:** Pastikan MySQL sudah di-Start (Warna hijau).
* **Cek Nama DB:** Pastikan di phpMyAdmin namanya beneran `spk_smart` (huruf kecil semua).

**Q: API Error / Fetch Failed?**
* **Cek Langkah 3:** Pastikan kamu sudah ganti `http://api:3001` jadi `http://localhost:3001` di 5 file tadi.
* **Cek Terminal Backend:** Pastikan terminal yang menjalankan `npm run dev` di folder `server` masih nyala.