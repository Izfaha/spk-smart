<script>
  import { Users, ClipboardList, Zap, RotateCw } from 'lucide-svelte';
  
  // Menerima data dari +page.server.js
  export let data;

  // Destructure data agar lebih rapi
  $: ({ stats: statsData, rankings } = data);

  // Mapping data dari server ke format UI Stats
  $: stats = [
    { 
      title: 'Jumlah Alternatif', 
      value: `${statsData?.alternatif || 0} Alternatif`, 
      icon: Users, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Jumlah Kriteria', 
      value: `${statsData?.kriteria || 0} Kriteria`, 
      icon: ClipboardList, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Metode', 
      value: 'SMART', 
      icon: Zap, 
      color: 'text-yellow-500' 
    },
  ];

  // Fungsi refresh (reload halaman untuk hitung ulang)
  function handleCalculate() {
    window.location.reload();
  }
</script>

<div class="space-y-6">
  
  <div>
    <h2 class="text-2xl font-bold text-slate-800">Dashboard</h2>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each stats as stat}
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div class="p-3 bg-slate-50 rounded-lg {stat.color}">
          <svelte:component this={stat.icon} size={24} />
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500">{stat.title}</p>
          <p class="text-xl font-bold text-slate-800 mt-1">{stat.value}</p>
        </div>
      </div>
    {/each}
  </div>

  <div class="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-6 border-b border-slate-100 flex justify-between items-center">
      <h3 class="text-lg font-bold text-slate-700">Hasil Perangkingan SMART</h3>
      <span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
        Real-time Calculation
      </span>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 text-slate-600 uppercase text-xs font-semibold tracking-wider">
          <tr>
            <th class="px-6 py-4 border-b border-slate-100 w-20 text-center">Peringkat</th>
            <th class="px-6 py-4 border-b border-slate-100 w-full">Alternatif</th>
            <th class="px-6 py-4 border-b border-slate-100 text-right">Nilai Akhir</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#if rankings.length > 0}
            {#each rankings as item}
              <tr class="hover:bg-slate-50 transition-colors group">
                <td class="px-6 py-4 text-center">
                  <span class={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm 
                    ${item.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                      item.rank === 2 ? 'bg-gray-100 text-gray-700' : 
                      item.rank === 3 ? 'bg-orange-100 text-orange-800' : 'text-slate-500'}`}>
                    {item.rank}
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-600 font-medium">{item.name}</td>
                <td class="px-6 py-4 text-slate-800 font-bold text-right text-lg">{item.score}</td>
              </tr>
            {/each}
          {:else}
            <tr>
              <td colspan="3" class="px-6 py-8 text-center text-slate-500 italic">
                Belum ada data penilaian. Silakan isi data alternatif dan penilaian terlebih dahulu.
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>

    <div class="p-6 border-t border-slate-100 flex justify-end">
      <button 
        on:click={handleCalculate}
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-md shadow-sm transition-all active:scale-95 flex items-center gap-2"
      >
        <RotateCw size={18} />
        <span>Hitung Ulang / Refresh</span>
      </button>
    </div>
  </div>

</div>