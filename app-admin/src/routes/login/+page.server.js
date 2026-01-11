import { fail, redirect } from '@sveltejs/kit';

// Pastikan ini benar (pakai api_server atau api tergantung nama service di docker-compose)
const API_URL = 'http://api:3001/api/auth/login'; 

export const actions = {
    login: async ({ cookies, request, fetch }) => {
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');

        if (!username || !password) {
            return fail(400, { error: 'Username dan password wajib diisi' });
        }

        let loginSuccess = false;

        try {
            console.log('Mencoba login ke:', API_URL); // Debugging 1

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await res.json();
            console.log('Response dari API:', result); // Debugging 2

            if (!res.ok) {
                return fail(res.status, { error: result.message || 'Gagal login' });
            }

            // === PERBAIKAN SETTING COOKIE ===
            // 1. sameSite: 'lax' (Lebih aman buat redirect daripada 'strict')
            // 2. secure: false (Wajib false karena kita pakai HTTP, bukan HTTPS)
            cookies.set('token', result.token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax', 
                secure: false, 
                maxAge: 60 * 60 * 24 // 1 hari
            });

            // Tandai sukses, tapi JANGAN redirect di sini biar gak ditangkap catch
            loginSuccess = true;

        } catch (err) {
            console.error("Error Fetch:", err);
            return fail(500, { error: 'Terjadi kesalahan koneksi server (Backend Mati/Salah URL)' });
        }

        // === REDIRECT DI LUAR TRY/CATCH ===
        // Ini memastikan redirect berjalan mulus tanpa dianggap error
        if (loginSuccess) {
            throw redirect(303, '/');
        }
    }
};