const db = require('../config/database');

// GET Semua Alternatif
exports.getAllAlternatif = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM alternatif ORDER BY id ASC');
        res.json({
            status: 'success',
            data: rows
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// CREATE Alternatif Baru
exports.createAlternatif = async (req, res) => {
    const { nama_alternatif, deskripsi } = req.body;
    
    // Validasi sederhana
    if (!nama_alternatif) {
        return res.status(400).json({ status: 'error', message: 'Nama Alternatif wajib diisi' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO alternatif (nama_alternatif, deskripsi) VALUES (?, ?)',
            [nama_alternatif, deskripsi]
        );
        res.status(201).json({
            status: 'success',
            message: 'Alternatif berhasil ditambahkan',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// UPDATE Alternatif
exports.updateAlternatif = async (req, res) => {
    const { id } = req.params;
    const { nama_alternatif, deskripsi } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE alternatif SET nama_alternatif = ?, deskripsi = ? WHERE id = ?',
            [nama_alternatif, deskripsi, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
        }

        res.json({ status: 'success', message: 'Alternatif berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// DELETE Alternatif
exports.deleteAlternatif = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM alternatif WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
        }

        res.json({ status: 'success', message: 'Alternatif berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};