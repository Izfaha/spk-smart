<script>
  import '../layout.css'; 
  import { page } from '$app/stores'; // Kita butuh ini untuk cek URL saat ini
  import { 
    LayoutDashboard, 
    Database, 
    Scale, 
    Calculator, 
    FileText, 
    Settings,
    Menu,
    X,
    LogOut
  } from 'lucide-svelte';

  let isSidebarOpen = false;

  const menus = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Data Alternatif', href: '/alternatif', icon: Database },
    { label: 'Kriteria & Bobot', href: '/kriteria', icon: Scale },
    { label: 'Perhitungan', href: '/perhitungan', icon: Calculator },
    { label: 'Laporan', href: '/laporan', icon: FileText },
    // { label: 'Pengaturan', href: '/pengaturan', icon: Settings },
  ];

  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
</script>

{#if $page.url.pathname === '/login'}
    
    <slot />

{:else}

    <div class="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      <button 
        on:click={toggleSidebar} 
        class="lg:hidden fixed top-4 right-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg"
      >
        {#if isSidebarOpen}
          <X size={24} />
        {:else}
          <Menu size={24} />
        {/if}
      </button>
    
      <aside class="
        fixed inset-y-0 left-0 z-40 w-64 bg-blue-600 text-white transition-transform duration-300 ease-in-out flex flex-col
        lg:translate-x-0 lg:static lg:block
        {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      ">
        <div class="p-6 border-b border-blue-500">
          <h1 class="text-2xl font-bold tracking-wide">SPK SMART</h1>
        </div>
    
        <nav class="mt-6 px-2 flex-1">
          {#each menus as menu}
            <a 
              href={menu.href} 
              class="flex items-center gap-3 px-4 py-3 mb-1 rounded-md transition-all duration-200
              {$page.url.pathname === menu.href 
                ? 'bg-blue-700 text-white font-medium shadow-md translate-x-1' 
                : 'text-blue-100 hover:bg-blue-500 hover:text-white hover:translate-x-1'}"
            >
              <svelte:component this={menu.icon} size={20} />
              <span>{menu.label}</span>
            </a>
          {/each}
        </nav>

        <div class="p-4 border-t border-blue-500 bg-blue-800/20">
            <form action="/logout" method="POST">
                <button 
                    type="submit" 
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-200 hover:bg-red-500 hover:text-white transition-all duration-300 group shadow-sm hover:shadow-red-500/50"
                >
                    <LogOut size={20} class="group-hover:-rotate-12 transition-transform duration-300" />
                    <span class="font-bold tracking-wide">Logout</span>
                </button>
            </form>
        </div>
      </aside>
    
      <main class="flex-1 p-4 lg:p-8 overflow-y-auto">
        <slot />
      </main>
    
      {#if isSidebarOpen}
        <div 
          class="fixed inset-0 bg-black/50 z-30 lg:hidden"
          on:click={toggleSidebar}
        ></div>
      {/if}
    </div>

{/if}