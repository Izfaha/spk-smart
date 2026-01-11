import { fail } from '@sveltejs/kit';

// API URL (Gunakan nama service docker 'api')
const API_URL = 'http://api:3001/api/alternatif';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Gagal mengambil data');
        
        const result = await res.json();
        return {
            alternatives: result.data || [] // Pastikan selalu return array
        };
    } catch (err) {
        console.error("Load Error:", err);
        return { alternatives: [] };
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    // 1. Action Tambah / Edit
    save: async ({ request, fetch }) => {
        const data = await request.formData();
        const id = data.get('id');
        const nama = data.get('nama_alternatif');
        const deskripsi = data.get('deskripsi');

        // Payload
        const payload = { nama_alternatif: nama, deskripsi };

        try {
            let res;
            if (id) {
                // UPDATE (PUT)
                res = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // CREATE (POST)
                res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (!res.ok) {
                const errJson = await res.json();
                return fail(res.status, { error: errJson.message });
            }

            return { success: true };

        } catch (error) {
            return fail(500, { error: 'Terjadi kesalahan server' });
        }
    },

    // 2. Action Hapus
    delete: async ({ request, fetch }) => {
        const data = await request.formData();
        const id = data.get('id');

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!res.ok) return fail(res.status, { error: 'Gagal menghapus' });
            return { success: true };
        } catch (error) {
            return fail(500, { error: 'Terjadi kesalahan koneksi' });
        }
    }
};