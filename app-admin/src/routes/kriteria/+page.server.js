import { fail } from '@sveltejs/kit';

// URL API Backend (service 'api' di docker network)
const API_URL = 'http://api:3001/api/kriteria';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Gagal mengambil data kriteria');
        
        const result = await res.json();
        return {
            criteria: result.data || [] // Return array kosong jika data null
        };
    } catch (err) {
        console.error("Load Kriteria Error:", err);
        return { criteria: [] };
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    // 1. Action Simpan (Tambah Baru / Edit)
    save: async ({ request, fetch }) => {
        const data = await request.formData();
        
        const id = data.get('id');
        const kode_kriteria = data.get('kode_kriteria');
        const nama_kriteria = data.get('nama_kriteria');
        const bobot = data.get('bobot');
        const jenis = data.get('jenis');

        // Validasi Backend Sederhana
        if (!kode_kriteria || !nama_kriteria || !bobot || !jenis) {
            return fail(400, { error: 'Semua field wajib diisi' });
        }

        const payload = { kode_kriteria, nama_kriteria, bobot, jenis };

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
            if (!res.ok) return fail(res.status, { error: 'Gagal menghapus kriteria' });
            return { success: true };
        } catch (error) {
            return fail(500, { error: 'Terjadi kesalahan koneksi' });
        }
    }
};