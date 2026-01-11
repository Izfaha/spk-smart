import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    const token = event.cookies.get('token');
    
    // Daftar halaman yang boleh diakses tanpa login
    const publicRoutes = ['/login'];

    // Jika user belum login & mencoba akses halaman selain login -> tendang ke /login
    if (!token && !publicRoutes.includes(event.url.pathname)) {
        throw redirect(303, '/login');
    }

    // Jika user SUDAH login & mencoba akses /login -> tendang ke dashboard
    if (token && event.url.pathname === '/login') {
        throw redirect(303, '/');
    }

    const response = await resolve(event);
    return response;
}