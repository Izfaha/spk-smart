const db = require('../config/database');

exports.getLaporanSmart = async (req, res) => {
    try {
        // 1. Ambil Data Dasar
        const [alternatifs] = await db.query('SELECT * FROM alternatif');
        const [kriterias] = await db.query('SELECT * FROM kriteria ORDER BY id ASC');
        const [penilaians] = await db.query('SELECT * FROM penilaian');

        if (alternatifs.length === 0 || kriterias.length === 0 || penilaians.length === 0) {
            return res.json({ status: 'success', headers: [], data: [] });
        }

        // 2. Cari Min/Max untuk Normalisasi
        const minMax = {};
        kriterias.forEach(k => {
            const values = penilaians
                .filter(p => p.kriteria_id === k.id)
                .map(p => p.nilai);
            
            if (values.length > 0) {
                minMax[k.id] = {
                    min: Math.min(...values),
                    max: Math.max(...values)
                };
            } else {
                minMax[k.id] = { min: 0, max: 0 };
            }
        });

        // 3. Hitung Total Bobot
        const totalBobot = kriterias.reduce((sum, k) => sum + Number(k.bobot), 0);

        // 4. Kalkulasi Nilai Akhir per Alternatif
        let finalReport = alternatifs.map(alt => {
            let totalScore = 0;
            let criteriaScores = {}; // Untuk menyimpan nilai per kolom kriteria

            kriterias.forEach(k => {
                const nilaiData = penilaians.find(p => p.alternatif_id === alt.id && p.kriteria_id === k.id);
                const nilai = nilaiData ? nilaiData.nilai : 0;
                const { min, max } = minMax[k.id];

                // Normalisasi Utility
                let utility = 0;
                if (max !== min) {
                    if (k.jenis === 'Benefit') {
                        utility = (nilai - min) / (max - min);
                    } else { // Cost
                        utility = (max - nilai) / (max - min);
                    }
                } else {
                    utility = 1;
                }

                // Hitung Score Terbobot
                const normBobot = k.bobot / totalBobot;
                const score = utility * normBobot;
                
                totalScore += score;
                
                // Simpan detail untuk ditampilkan di kolom laporan (opsional: tampilkan nilai asli atau utility)
                // Di sini kita simpan nilai utility terbobot (kontribusi skor)
                criteriaScores[k.kode_kriteria] = score.toFixed(3);
            });

            return {
                id: alt.id,
                name: alt.nama_alternatif,
                details: criteriaScores,
                final_score: totalScore.toFixed(4) // 4 desimal agar akurat
            };
        });

        // 5. Ranking (Sort Descending)
        finalReport.sort((a, b) => b.final_score - a.final_score);

        // 6. Tambah Nomor Peringkat
        finalReport = finalReport.map((item, index) => ({
            rank: index + 1,
            ...item
        }));

        res.json({
            status: 'success',
            headers: kriterias, // Kirim list kriteria untuk header tabel
            data: finalReport
        });

    } catch (error) {
        console.error("Laporan Error:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};