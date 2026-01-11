// server/controllers/kriteriaController.js
const db = require('../config/database');

// GET Semua Kriteria
exports.getAllKriteria = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM kriteria ORDER BY kode_kriteria ASC');
        res.json({
            status: 'success',
            data: rows
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// CREATE Kriteria Baru
exports.createKriteria = async (req, res) => {
    // Pastikan field ini sesuai dengan kolom di tabel database kamu
    const { kode_kriteria, nama_kriteria, bobot, jenis } = req.body;
    
    // Validasi input
    if (!kode_kriteria || !nama_kriteria || !bobot || !jenis) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Semua field (Kode, Nama, Bobot, Jenis) wajib diisi!' 
        });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO kriteria (kode_kriteria, nama_kriteria, bobot, jenis) VALUES (?, ?, ?, ?)',
            [kode_kriteria, nama_kriteria, bobot, jenis]
        );
        res.status(201).json({
            status: 'success',
            message: 'Kriteria berhasil ditambahkan',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// UPDATE Kriteria
exports.updateKriteria = async (req, res) => {
    const { id } = req.params;
    const { kode_kriteria, nama_kriteria, bobot, jenis } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE kriteria SET kode_kriteria = ?, nama_kriteria = ?, bobot = ?, jenis = ? WHERE id = ?',
            [kode_kriteria, nama_kriteria, bobot, jenis, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Data kriteria tidak ditemukan' });
        }

        res.json({ status: 'success', message: 'Kriteria berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// DELETE Kriteria
exports.deleteKriteria = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM kriteria WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Data kriteria tidak ditemukan' });
        }

        res.json({ status: 'success', message: 'Kriteria berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};