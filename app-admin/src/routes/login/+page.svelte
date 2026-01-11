<script>
    import { enhance } from '$app/forms';
    export let form; // Untuk menangkap pesan error dari server
</script>

<div class="min-h-screen flex w-full font-sans">
    
    <div class="hidden lg:flex w-1/2 bg-blue-600 flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        <div class="absolute left-10 top-1/2 w-24 h-0.5 bg-blue-400"></div>
        <div class="absolute right-10 top-2/3 w-32 h-0.5 bg-blue-400"></div>

        <div class="text-right z-10">
            <h1 class="text-6xl font-bold mb-2">WELCOME</h1>
            <h1 class="text-6xl font-bold mb-8">BACK !</h1>
            <p class="text-xl tracking-wide font-light">sistem pendukung keputusan</p>
            <p class="text-4xl font-bold italic mt-2">SMART</p>
        </div>
    </div>

    <div class="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-24">
        
        <div class="w-full max-w-md">
            <h2 class="text-3xl font-bold text-blue-600 mb-12 text-center tracking-widest">ADMIN LOGIN!</h2>

            {#if form?.error}
                <div class="bg-red-100 text-red-600 p-3 rounded mb-4 text-center text-sm border border-red-200">
                    {form.error}
                </div>
            {/if}

            <form method="POST" action="?/login" use:enhance>
                <div class="mb-6">
                    <label class="block text-slate-400 text-sm mb-2 lowercase" for="username">username / email</label>
                    <input 
                        name="username" 
                        type="text" 
                        placeholder="admin" 
                        class="w-full px-4 py-3 border border-slate-200 rounded text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        required
                    />
                </div>

                <div class="mb-10">
                    <label class="block text-slate-400 text-sm mb-2 lowercase" for="password">password</label>
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="******" 
                        class="w-full px-4 py-3 border border-slate-200 rounded text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded shadow-lg shadow-blue-500/30 transition-all active:scale-95 tracking-wide"
                >
                    LOGIN
                </button>
            </form>
        </div>
    </div>
</div>