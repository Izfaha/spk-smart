/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const res = await fetch('http://api:3001/api/laporan');
        const result = await res.json();
        
        return {
            headers: result.headers || [],
            reportData: result.data || []
        };
    } catch (err) {
        console.error("Error load laporan:", err);
        return { headers: [], reportData: [] };
    }
}