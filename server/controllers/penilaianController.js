const db = require('../config/database');

// GET Matrix Penilaian (Pivot Table)
exports.getPenilaianMatrix = async (req, res) => {
    try {
        // 1. Ambil Kriteria (untuk Header Kolom)
        const [kriterias] = await db.query('SELECT * FROM kriteria ORDER BY id ASC');
        
        // 2. Ambil Alternatif (untuk Baris)
        const [alternatifs] = await db.query('SELECT * FROM alternatif ORDER BY id ASC');
        
        // 3. Ambil Nilai (Data Isi)
        const [penilaians] = await db.query('SELECT * FROM penilaian');

        // 4. Susun Struktur Matrix
        const matrix = alternatifs.map(alt => {
            const row = {
                id: alt.id,
                name: alt.nama_alternatif,
                scores: {} // Object untuk menyimpan nilai berdasarkan ID Kriteria
            };

            // Isi scores
            kriterias.forEach(k => {
                const found = penilaians.find(p => p.alternatif_id === alt.id && p.kriteria_id === k.id);
                row.scores[k.id] = found ? found.nilai : 0; // Default 0 jika belum dinilai
            });

            return row;
        });

        res.json({
            status: 'success',
            data: {
                headers: kriterias, // List Kriteria untuk <th>
                rows: matrix        // Data Alternatif + Nilai untuk <tbody>
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// SAVE / UPDATE Penilaian
exports.savePenilaian = async (req, res) => {
    const { alternatif_id, inputs } = req.body; 
    // inputs adalah array: [{ kriteria_id: 1, nilai: 80 }, { kriteria_id: 2, nilai: 90 }]

    if (!alternatif_id || !Array.isArray(inputs)) {
        return res.status(400).json({ status: 'error', message: 'Data tidak valid' });
    }

    try {
        // Gunakan Promise.all untuk eksekusi parallel yang efisien
        const queries = inputs.map(item => {
            // Logic UPSERT (Insert kalau belum ada, Update kalau sudah ada)
            return db.query(
                `INSERT INTO penilaian (alternatif_id, kriteria_id, nilai) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)`,
                [alternatif_id, item.kriteria_id, item.nilai]
            );
        });

        await Promise.all(queries);

        res.json({ status: 'success', message: 'Penilaian berhasil disimpan' });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};