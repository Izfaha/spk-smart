// server/controllers/dashboardController.js
const db = require('../config/database');

exports.getDashboardData = async (req, res) => {
    try {
        // 1. Ambil Data Counts (Jumlah Alternatif & Kriteria)
        const [altCount] = await db.query('SELECT COUNT(*) as total FROM alternatif');
        const [critCount] = await db.query('SELECT COUNT(*) as total FROM kriteria');

        // 2. Ambil Semua Data yang dibutuhkan untuk perhitungan SMART
        const [alternatifs] = await db.query('SELECT * FROM alternatif');
        const [kriterias] = await db.query('SELECT * FROM kriteria');
        const [penilaians] = await db.query('SELECT * FROM penilaian');

        // Jika data kosong, kembalikan default
        if (alternatifs.length === 0 || kriterias.length === 0 || penilaians.length === 0) {
            return res.json({
                status: 'success',
                counts: {
                    alternatif: altCount[0].total,
                    kriteria: critCount[0].total
                },
                rankings: []
            });
        }

        // === LOGIKA METODE SMART ===
        
        // A. Persiapan Nilai Min/Max untuk Normalisasi
        const minMax = {};
        kriterias.forEach(k => {
            // Filter nilai berdasarkan kriteria ini
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

        // B. Hitung Total Bobot untuk Normalisasi Bobot
        const totalBobot = kriterias.reduce((sum, k) => sum + Number(k.bobot), 0);

        // C. Perhitungan Per Alternatif
        let finalScores = alternatifs.map(alt => {
            let totalScore = 0;

            kriterias.forEach(k => {
                // Cari nilai mentah
                const nilaiData = penilaians.find(p => p.alternatif_id === alt.id && p.kriteria_id === k.id);
                const nilai = nilaiData ? nilaiData.nilai : 0;
                const { min, max } = minMax[k.id];

                // 1. Normalisasi Utility (Rumus SMART)
                let utility = 0;
                if (max !== min) { // Mencegah pembagian dengan nol
                    if (k.jenis === 'Benefit') {
                        utility = (nilai - min) / (max - min);
                    } else { // Cost
                        utility = (max - nilai) / (max - min);
                    }
                } else {
                    utility = 1; // Jika semua nilai sama, utility dianggap max
                }

                // 2. Normalisasi Bobot
                const normBobot = k.bobot / totalBobot;

                // 3. Hitung Nilai Akhir (Utility * Bobot Normal)
                totalScore += utility * normBobot;
            });

            return {
                id: alt.id,
                name: alt.nama_alternatif, // Sesuaikan dengan nama kolom di DB
                score: totalScore.toFixed(3) // Ambil 3 desimal
            };
        });

        // D. Sorting (Ranking tertinggi ke terendah)
        finalScores.sort((a, b) => b.score - a.score);

        // E. Tambahkan properti ranking
        finalScores = finalScores.map((item, index) => ({
            rank: index + 1,
            ...item
        }));

        // === RESPONSE ===
        res.json({
            status: 'success',
            counts: {
                alternatif: altCount[0].total,
                kriteria: critCount[0].total
            },
            rankings: finalScores
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};