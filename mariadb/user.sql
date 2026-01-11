-- File: mariadb/user.sql
-- Setup Encoding agar support karakter lengkap (Standard Modern)
SET
    NAMES utf8mb4;

SET
    FOREIGN_KEY_CHECKS = 0;

-- Matikan cek FK sementara agar lancar saat create table
-- Buat Database
CREATE DATABASE IF NOT EXISTS `spk_smart`;

USE `spk_smart`;

-- ==========================================
-- 1. TABLE USERS (Admin)
-- ==========================================
DROP TABLE IF EXISTS `users`;

CREATE TABLE
    `users` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `username` varchar(50) NOT NULL,
        `password` varchar(255) NOT NULL, -- Panjang 255 karena password akan di-hash (bcrypt)
        `full_name` varchar(100) DEFAULT NULL,
        `created_at` timestamp NULL DEFAULT current_timestamp(),
        PRIMARY KEY (`id`),
        UNIQUE KEY `username` (`username`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- Seed Data Admin (Password dummy, di real case harus hash bcrypt)
INSERT INTO
    `users` (`username`, `password`, `full_name`)
VALUES
    (
        'admin',
        '$2b$10$DUMMYHASHFORPASSWORD',
        'Administrator SPK'
    );

-- ==========================================
-- 2. TABLE ALTERNATIF (Objek yang dinilai)
-- ==========================================
DROP TABLE IF EXISTS `alternatif`;

CREATE TABLE
    `alternatif` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `nama_alternatif` varchar(100) NOT NULL,
        `deskripsi` text DEFAULT NULL,
        `created_at` timestamp NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- Seed Data Alternatif (Sesuai Gambar Dashboard)
INSERT INTO
    `alternatif` (`nama_alternatif`, `deskripsi`)
VALUES
    ('Alternatif A', 'Kandidat Lokasi Pusat Kota'),
    ('Alternatif B', 'Kandidat Lokasi Area Perumahan'),
    (
        'Alternatif C',
        'Kandidat Lokasi Kawasan Industri'
    ),
    ('Alternatif D', 'Kandidat Lokasi Dekat Pasar'),
    ('Alternatif E', 'Kandidat Lokasi Pinggiran Kota');

-- ==========================================
-- 3. TABLE KRITERIA (Parameter Penilaian)
-- ==========================================
DROP TABLE IF EXISTS `kriteria`;

CREATE TABLE
    `kriteria` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `kode_kriteria` varchar(10) NOT NULL, -- C1, C2, dst
        `nama_kriteria` varchar(100) NOT NULL,
        `bobot` decimal(5, 2) NOT NULL, -- DECIMAL lebih akurat untuk angka bobot dibanding FLOAT
        `jenis` enum ('Benefit', 'Cost') NOT NULL, -- PENTING: Menentukan rumus normalisasi SMART
        `created_at` timestamp NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`),
        UNIQUE KEY `kode_kriteria` (`kode_kriteria`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- Seed Data Kriteria (Contoh kasus pemilihan lokasi)
INSERT INTO
    `kriteria` (
        `kode_kriteria`,
        `nama_kriteria`,
        `bobot`,
        `jenis`
    )
VALUES
    ('C1', 'Harga Sewa', 20.00, 'Cost'), -- Cost: Semakin murah semakin bagus
    ('C2', 'Luas Tanah', 25.00, 'Benefit'), -- Benefit: Semakin luas semakin bagus
    ('C3', 'Strategis', 30.00, 'Benefit'),
    ('C4', 'Keamanan', 15.00, 'Benefit'),
    ('C5', 'Kebersihan', 10.00, 'Benefit');

-- ==========================================
-- 4. TABLE PENILAIAN (Matrix Data Mentah)
-- ==========================================
-- Tabel ini menghubungkan Alternatif dengan Kriteria dan menyimpan Nilainya
DROP TABLE IF EXISTS `penilaian`;

CREATE TABLE
    `penilaian` (
        `id` int (11) NOT NULL AUTO_INCREMENT,
        `alternatif_id` int (11) NOT NULL,
        `kriteria_id` int (11) NOT NULL,
        `nilai` float NOT NULL DEFAULT 0, -- Nilai raw sebelum normalisasi
        `created_at` timestamp NULL DEFAULT current_timestamp(),
        `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (`id`),
        -- CONSTRAINT: Satu alternatif hanya boleh punya satu nilai per kriteria
        UNIQUE KEY `unique_penilaian` (`alternatif_id`, `kriteria_id`),
        -- FOREIGN KEYS: Menjaga integritas data
        CONSTRAINT `fk_penilaian_alternatif` FOREIGN KEY (`alternatif_id`) REFERENCES `alternatif` (`id`) ON DELETE CASCADE,
        CONSTRAINT `fk_penilaian_kriteria` FOREIGN KEY (`kriteria_id`) REFERENCES `kriteria` (`id`) ON DELETE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- Seed Data Penilaian (Dummy Matrix agar app tidak kosong saat pertama run)
-- Asumsi ID Alternatif 1-5 dan Kriteria 1-5 berurutan
INSERT INTO
    `penilaian` (`alternatif_id`, `kriteria_id`, `nilai`)
VALUES
    -- Nilai Alternatif A
    (1, 1, 80),
    (1, 2, 70),
    (1, 3, 90),
    (1, 4, 60),
    (1, 5, 75),
    -- Nilai Alternatif B
    (2, 1, 60),
    (2, 2, 85),
    (2, 3, 70),
    (2, 4, 80),
    (2, 5, 65),
    -- Nilai Alternatif C
    (3, 1, 90),
    (3, 2, 60),
    (3, 3, 50),
    (3, 4, 70),
    (3, 5, 80),
    -- Nilai Alternatif D
    (4, 1, 50),
    (4, 2, 90),
    (4, 3, 85),
    (4, 4, 75),
    (4, 5, 60),
    -- Nilai Alternatif E
    (5, 1, 70),
    (5, 2, 65),
    (5, 3, 60),
    (5, 4, 85),
    (5, 5, 90);

SET
    FOREIGN_KEY_CHECKS = 1;

-- Hidupkan kembali cek FK