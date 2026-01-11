<script>
  import { Printer, Trophy, FileText } from 'lucide-svelte';

  export let data;

  // Reactivity
  $: headers = data.headers || [];
  $: reportData = data.reportData || [];

  function printReport() {
    window.print();
  }
</script>

<div class="space-y-6 print:space-y-0">
  
  <div class="flex justify-between items-center print:hidden">
    <h2 class="text-2xl font-bold text-slate-800">Laporan Akhir</h2>
    <!-- <button on:click={printReport} class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm flex items-center gap-2 transition-colors">
      <Printer size={18} />
      <span>Cetak Laporan</span>
    </button> -->
  </div>

  <div class="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden print:shadow-none print:border-none print:w-full">
    
    <div class="p-6 border-b border-slate-100 bg-white print:border-b-2 print:border-black">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold text-slate-800 uppercase tracking-wide">Laporan Keputusan Metode SMART</h3>
          <p class="text-slate-500 text-sm mt-1">Sistem Pendukung Keputusan Pemilihan Lokasi</p>
        </div>
        <div class="text-right hidden print:block">
          <p class="text-xs text-slate-500">Dicetak pada:</p>
          <p class="font-mono text-sm font-bold">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead class="bg-slate-50 text-slate-600 text-xs uppercase font-bold tracking-wider print:bg-white print:text-black print:border-b-2 print:border-black">
          <tr>
            <th class="px-4 py-4 border-b border-slate-100 text-center w-16">Rank</th>
            <th class="px-4 py-4 border-b border-slate-100 min-w-[150px]">Alternatif</th>
            
            {#each headers as h}
              <th class="px-4 py-4 border-b border-slate-100 text-center text-slate-500">
                  {h.kode_kriteria}
              </th>
            {/each}

            <th class="px-4 py-4 border-b border-slate-100 text-right w-32 bg-blue-50/50 print:bg-white">Nilai Akhir</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#if reportData.length === 0}
            <tr><td colspan={headers.length + 3} class="p-8 text-center text-slate-500 italic">Belum ada data untuk ditampilkan.</td></tr>
          {:else}
            {#each reportData as item}
              <tr class="hover:bg-slate-50 transition-colors print:hover:bg-white">
                <td class="px-4 py-3 text-center">
                  <div class={`inline-flex items-center justify-center w-8 h-8 rounded-full ${item.rank === 1 ? 'bg-yellow-100 text-yellow-700 font-bold print:border print:border-black' : 'text-slate-500 bg-slate-100 print:bg-white print:text-black'}`}>
                    {#if item.rank === 1} <Trophy size={14} /> {:else} {item.rank} {/if}
                  </div>
                </td>
                
                <td class="px-4 py-3 font-bold text-slate-700 uppercase text-sm">{item.name}</td>
                
                {#each headers as h}
                  <td class="px-4 py-3 text-center text-slate-500 font-mono text-xs">
                    {item.details[h.kode_kriteria]}
                  </td>
                {/each}

                <td class="px-4 py-3 text-right font-bold text-blue-700 text-lg bg-blue-50/30 print:bg-white print:text-black">
                  {item.final_score}
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>

    <div class="hidden print:flex justify-end mt-16 pr-12">
      <div class="text-center">
        <p class="text-sm mb-16">Mengetahui, <br> Kepala Bagian</p>
        <div class="border-b border-black w-48 mb-2"></div>
        <p class="font-bold">( ....................................... )</p>
      </div>
    </div>

    <div class="p-6 border-t border-slate-100 flex justify-end print:hidden">
      <button on:click={printReport} class="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-6 rounded-md shadow-sm flex items-center gap-2 transition-colors">
        <Printer size={18} />
        <span>Cetak Laporan</span>
      </button>
    </div>
  </div>

</div>

<style>
  @media print {
    @page {
      margin: 1.5cm;
      size: A4;
    }
    :global(body) {
      background: white;
      color: black;
    }
  }
</style>