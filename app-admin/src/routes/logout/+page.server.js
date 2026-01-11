import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ cookies }) => {
        // 1. Hapus Cookie 'token'
        cookies.delete('token', { path: '/' });
        
        // 2. Tendang ke halaman Login
        throw redirect(303, '/login');
    }
};