<script>
  import { Plus, Pencil, Trash2, X, Save, AlertCircle } from 'lucide-svelte';
  import { enhance } from '$app/forms';

  // Data dari Server
  export let data;
  export let form;

  $: criteria = data.criteria; // Reactive data tabel

  // State untuk Toggle Auto-Scaling (Hanya Visual Client-side saat ini)
  let isAutoScaling = true;
  function toggleAutoScaling() {
    isAutoScaling = !isAutoScaling;
  }

  // --- MODAL STATE MANAGEMENT ---
  let isModalOpen = false;
  let isDeleteModalOpen = false;
  let editMode = false;

  // Form Variables
  let formId = '';
  let formKode = '';
  let formNama = '';
  let formBobot = '';
  let formJenis = 'Benefit';
  let deleteId = '';

  function openAddModal() {
    editMode = false;
    formId = '';
    formKode = '';
    formNama = '';
    formBobot = '';
    formJenis = 'Benefit';
    isModalOpen = true;
  }

  function openEditModal(item) {
    editMode = true;
    formId = item.id;
    formKode = item.kode_kriteria;
    formNama = item.nama_kriteria;
    formBobot = item.bobot;
    formJenis = item.jenis;
    isModalOpen = true;
  }

  function openDeleteModal(id) {
    deleteId = id;
    isDeleteModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    isDeleteModalOpen = false;
  }
</script>

<div class="space-y-6">
  
  {#if form?.error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{form.error}</span>
    </div>
  {/if}

  <div class="flex justify-between items-center">
    <h2 class="text-2xl font-bold text-slate-800">Kriteria & Bobot</h2>
    <button on:click={openAddModal} class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow-sm sm:hidden">
      <Plus size={20} />
    </button>
  </div>

  <div 
    class="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors" 
    on:click={toggleAutoScaling}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key === 'Enter' && toggleAutoScaling()}
  >
    <span class="font-medium text-slate-700 select-none">Bobot Kriteria Normalisasi Otomatis (Auto-Scaling)</span>
    <div class={`w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300 ${isAutoScaling ? 'bg-green-500' : 'bg-slate-300'}`}>
      <div class={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isAutoScaling ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </div>
  </div>

  <div class="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-6 border-b border-slate-100 bg-white">
      <h3 class="text-lg font-semibold text-slate-700">Data Kriteria Penilaian</h3>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[700px]">
        <thead class="bg-slate-50 text-slate-600 text-sm font-semibold">
          <tr>
            <th class="px-6 py-4 border-b border-slate-100 w-16 text-center">No</th>
            <th class="px-6 py-4 border-b border-slate-100 w-24 text-center">Kode</th>
            <th class="px-6 py-4 border-b border-slate-100">Nama Kriteria</th>
            <th class="px-6 py-4 border-b border-slate-100">Bobot (%)</th>
            <th class="px-6 py-4 border-b border-slate-100">Sifat</th>
            <th class="px-6 py-4 border-b border-slate-100 text-center w-48">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#if criteria.length === 0}
            <tr>
              <td colspan="6" class="px-6 py-8 text-center text-slate-500 italic">Belum ada data kriteria.</td>
            </tr>
          {:else}
            {#each criteria as item, index}
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-center text-slate-500 font-medium">{index + 1}</td>
                <td class="px-6 py-4 text-center">
                  <span class="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold">{item.kode_kriteria}</span>
                </td>
                <td class="px-6 py-4 text-slate-700 font-medium">{item.nama_kriteria}</td>
                <td class="px-6 py-4 text-slate-700 font-bold">{item.bobot}%</td>
                <td class="px-6 py-4">
                  <span class={`px-3 py-1 rounded-full text-xs font-semibold ${item.jenis === 'Benefit' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {item.jenis}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <button on:click={() => openEditModal(item)} class="bg-yellow-500 hover:bg-yellow-600 text-white p-2 px-3 rounded text-sm flex items-center gap-1 transition-colors shadow-sm">
                      <Pencil size={14} /> <span>Edit</span>
                    </button>
                    <button on:click={() => openDeleteModal(item.id)} class="bg-red-500 hover:bg-red-600 text-white p-2 px-3 rounded text-sm flex items-center gap-1 transition-colors shadow-sm">
                      <Trash2 size={14} /> <span>Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>

    <div class="p-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
      <button on:click={openAddModal} class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-sm flex items-center gap-2 transition-colors">
        <Plus size={18} />
        <span>Tambah Kriteria</span>
      </button>
    </div>
  </div>

  {#if isModalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 class="text-lg font-bold text-slate-800">{editMode ? 'Edit Kriteria' : 'Tambah Kriteria Baru'}</h3>
          <button on:click={closeModal} class="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <form method="POST" action="?/save" use:enhance={() => {
            return async ({ result, update }) => {
                if (result.type === 'success') closeModal();
                await update();
            };
        }}>
          <div class="p-6 space-y-4">
            <input type="hidden" name="id" value={formId} />

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Kode Kriteria</label>
                <input type="text" name="kode_kriteria" bind:value={formKode} placeholder="C1" class="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Bobot (%)</label>
                <input type="number" step="0.01" name="bobot" bind:value={formBobot} placeholder="20" class="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nama Kriteria</label>
              <input type="text" name="nama_kriteria" bind:value={formNama} placeholder="Contoh: Harga Sewa" class="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Sifat Kriteria (Attribute)</label>
              <select name="jenis" bind:value={formJenis} class="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="Benefit">Benefit (Semakin besar semakin bagus)</option>
                <option value="Cost">Cost (Semakin kecil semakin bagus)</option>
              </select>
            </div>
          </div>

          <div class="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" on:click={closeModal} class="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50">Batal</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
              <Save size={18} /> Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  {#if isDeleteModalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} />
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-2">Hapus Kriteria?</h3>
        <p class="text-slate-500 text-sm mb-6">Penilaian terkait kriteria ini juga akan ikut terhapus.</p>
        
        <form method="POST" action="?/delete" use:enhance={() => {
            return async ({ result, update }) => {
                if (result.type === 'success') closeModal();
                await update();
            };
        }}>
          <input type="hidden" name="id" value={deleteId} />
          <div class="flex justify-center gap-3">
            <button type="button" on:click={closeModal} class="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50">Batal</button>
            <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Ya, Hapus</button>
          </div>
        </form>
      </div>
    </div>
  {/if}

</div>