import { fail } from '@sveltejs/kit';

const API_URL = 'http://api:3001/api/penilaian';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const res = await fetch(API_URL);
        const result = await res.json();
        
        return {
            matrixData: result.data || { headers: [], rows: [] }
        };
    } catch (err) {
        console.error("Error load matrix:", err);
        return { matrixData: { headers: [], rows: [] } };
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    saveScores: async ({ request, fetch }) => {
        const data = await request.formData();
        const alternatif_id = data.get('alternatif_id');
        
        // Mengambil semua input yang dimulai dengan 'kriteria_'
        const inputs = [];
        for (const [key, value] of data.entries()) {
            if (key.startsWith('kriteria_')) {
                const kriteria_id = key.split('_')[1];
                inputs.push({
                    kriteria_id: parseInt(kriteria_id),
                    nilai: parseFloat(value)
                });
            }
        }

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alternatif_id, inputs })
            });

            if (!res.ok) return fail(res.status, { error: 'Gagal menyimpan nilai' });

            return { success: true };
        } catch (error) {
            return fail(500, { error: 'Kesalahan server' });
        }
    }
};