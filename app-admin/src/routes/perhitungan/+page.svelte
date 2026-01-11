<script>
  import { Calculator, Play, Pencil, X, Save } from 'lucide-svelte';
  import { enhance } from '$app/forms';

  export let data;
  
  // Reactivity agar tabel update real-time
  $: headers = data.matrixData?.headers || [];
  $: rows = data.matrixData?.rows || [];

  // --- MODAL STATE ---
  let isModalOpen = false;
  let selectedAlt = null;
  
  // Membuka modal untuk input nilai satu baris (satu alternatif)
  function openInputModal(row) {
    selectedAlt = row; // row berisi { id, name, scores: { 1: 80, 2: 90 } }
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    selectedAlt = null;
  }
</script>

<div class="space-y-6">
  
  <div class="flex justify-between items-center">
    <h2 class="text-2xl font-bold text-slate-800">Perhitungan (Input Nilai)</h2>
    <div class="hidden sm:block text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
       Metode: SMART (Simple Multi Attribute Rating Technique)
    </div>
  </div>

  <div class="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
      <h3 class="text-lg font-semibold text-slate-700 flex items-center gap-2">
        <Calculator size={20} class="text-blue-600"/>
        Matrix Data Mentah
      </h3>
      <span class="text-xs text-slate-500">*Klik tombol Edit untuk input nilai</span>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[800px]">
        <thead class="bg-slate-50 text-slate-600 text-sm font-semibold uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 border-b border-slate-100 w-16 text-center">Aksi</th>
            <th class="px-6 py-4 border-b border-slate-100 min-w-[200px]">Alternatif</th>
            
            {#each headers as k}
              <th class="px-6 py-4 border-b border-slate-100 text-center">
                <div class="flex flex-col">
                  <span>{k.kode_kriteria}</span>
                  <span class="text-[10px] text-slate-400 capitalize font-normal">{k.nama_kriteria}</span>
                </div>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-slate-600">
          {#if rows.length === 0}
             <tr><td colspan={headers.length + 2} class="p-8 text-center text-slate-400">Belum ada data Alternatif/Kriteria</td></tr>
          {:else}
            {#each rows as row}
              <tr class="hover:bg-blue-50/30 transition-colors">
                <td class="px-6 py-4 text-center">
                   <button 
                      on:click={() => openInputModal(row)}
                      class="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-md transition-colors shadow-sm"
                      title="Input Nilai"
                   >
                     <Pencil size={16} />
                   </button>
                </td>
                
                <td class="px-6 py-4 font-medium text-slate-800">{row.name}</td>

                {#each headers as k}
                  <td class="px-6 py-4 text-center font-mono text-slate-700">
                    {row.scores[k.id] || 0}
                  </td>
                {/each}
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>

    <div class="p-6 border-t border-slate-100 flex justify-end">
      <a href="/" class="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 px-6 rounded-md shadow-lg transition-all flex items-center gap-2">
        <span>Lihat Hasil Dashboard</span>
        <Play size={18} />
      </a>
    </div>
  </div>

  {#if isModalOpen && selectedAlt}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
        
        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 class="text-lg font-bold text-slate-800">Input Penilaian</h3>
            <p class="text-sm text-blue-600 font-medium">{selectedAlt.name}</p>
          </div>
          <button on:click={closeModal} class="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form method="POST" action="?/saveScores" use:enhance={() => {
            return async ({ result, update }) => {
                if (result.type === 'success') closeModal();
                await update(); // Refresh tabel otomatis
            };
        }}>
          <input type="hidden" name="alternatif_id" value={selectedAlt.id} />
          
          <div class="p-6 max-h-[60vh] overflow-y-auto space-y-4">
            {#each headers as k}
              <div class="flex items-center gap-4">
                <div class="w-1/3">
                  <span class="block text-sm font-bold text-slate-700">{k.kode_kriteria}</span>
                  <span class="text-xs text-slate-500">{k.nama_kriteria}</span>
                </div>
                <div class="w-2/3">
                  <input 
                    type="number" 
                    step="0.01"
                    name={`kriteria_${k.id}`} 
                    value={selectedAlt.scores[k.id] || 0} 
                    class="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-right font-mono"
                    placeholder="0"
                  />
                </div>
              </div>
            {/each}
          </div>

          <div class="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" on:click={closeModal} class="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 font-medium">
              Batal
            </button>
            <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm">
              <Save size={18} />
              Simpan Penilaian
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

</div>