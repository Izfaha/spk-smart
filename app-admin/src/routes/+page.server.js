// app-admin/src/routes/+page.server.js

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    // Kita tembak API backend
    // Karena jalan di Docker internal network, gunakan nama service 'api'
    // Tapi fetch sveltekit di server side butuh URL lengkap
    // Saat client-side navigation, dia pake public URL.
    // Untuk development lokal amannya pakai localhost port 3001
    
    // PENTING: Jika error fetch failed, pastikan port dan host sesuai env
    const res = await fetch('http://api:3001/api/dashboard'); 
    
    if (!res.ok) {
        return {
            stats: { alternatif: 0, kriteria: 0 },
            rankings: []
        };
    }

    const result = await res.json();
    
    return {
        stats: result.counts,
        rankings: result.rankings
    };
}