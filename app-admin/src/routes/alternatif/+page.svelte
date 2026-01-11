<script>
  import { Plus, Pencil, Trash2, ChevronDown, X, Save, AlertCircle } from 'lucide-svelte';
  import { enhance } from '$app/forms'; // Magic function SvelteKit biar tidak reload halaman

  // Terima data dari server
  export let data;
  export let form; // Untuk menangkap pesan error/sukses dari server

  // Reactivity: Data tabel otomatis update jika database berubah
  $: alternatives = data.alternatives;

  // --- LOGIC MODAL ---
  let isModalOpen = false;
  let isDeleteModalOpen = false;
  let editMode = false;

  // State Form
  let formId = '';
  let formNama = '';
  let formDeskripsi = '';
  let deleteId = '';

  function openAddModal() {
    editMode = false;
    formId = '';
    formNama = '';
    formDeskripsi = '';
    isModalOpen = true;
  }

  function openEditModal(item) {
    editMode = true;
    formId = item.id;
    formNama = item.nama_alternatif; // Pastikan sesuai nama kolom DB
    formDeskripsi = item.deskripsi;
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

<div class="space-y-6 relative">
  
  {#if form?.error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{form.error}</span>
    </div>
  {/if}

  <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
    <h2 class="text-2xl font-bold text-slate-800">Data Alternatif</h2>
    <!-- <button on:click={openAddModal} class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow-sm flex items-center gap-2 transition-colors">
      <Plus size={18} />
      <span>Tambah Alternatif</span>
    </button> -->
  </div>

  <div class="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
    <div class="p-5 border-b border-slate-100">
      <h3 class="text-lg font-bold text-slate-700">Daftar Alternatif</h3>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead class="bg-slate-50 text-slate-600 text-sm font-bold uppercase tracking-wide">
          <tr>
            <th class="px-6 py-4 border-b border-slate-200 w-16 text-center">No</th>
            <th class="px-6 py-4 border-b border-slate-200 w-1/4">Nama Alternatif</th>
            <th class="px-6 py-4 border-b border-slate-200">
              <div class="flex items-center gap-2">Deskripsi Alternatif</div>
            </th>
            <th class="px-6 py-4 border-b border-slate-200 w-48 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#if alternatives.length === 0}
            <tr>
              <td colspan="4" class="px-6 py-8 text-center text-slate-500 italic">Belum ada data alternatif.</td>
            </tr>
          {:else}
            {#each alternatives as item, index}
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-center text-slate-500 font-medium">{index + 1}</td>
                <td class="px-6 py-4 text-slate-700 font-bold">{item.nama_alternatif}</td>
                <td class="px-6 py-4 text-slate-600 text-sm">{item.deskripsi}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <button on:click={() => openEditModal(item)} class="bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 px-3 rounded text-sm font-medium flex items-center gap-1 shadow-sm transition-all active:scale-95">
                      <Pencil size={14} />
                      <span>Edit</span>
                    </button>
                    <button on:click={() => openDeleteModal(item.id)} class="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded text-sm font-medium flex items-center gap-1 shadow-sm transition-all active:scale-95">
                      <Trash2 size={14} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>

    <div class="p-5 border-t border-slate-100 flex justify-end bg-white">
      <button on:click={openAddModal} class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow-sm flex items-center gap-2 transition-colors">
        <Plus size={18} />
        <span>Tambah Alternatif</span>
      </button>
    </div>
  </div>

  {#if isModalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 class="text-lg font-bold text-slate-800">{editMode ? 'Edit Alternatif' : 'Tambah Alternatif Baru'}</h3>
          <button on:click={closeModal} class="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form method="POST" action="?/save" use:enhance={() => {
            return async ({ result, update }) => {
                if (result.type === 'success') closeModal(); // Tutup modal jika sukses
                await update(); // Refresh data tabel
            };
        }}>
          <div class="p-6 space-y-4">
            <input type="hidden" name="id" value={formId} />

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nama Alternatif</label>
              <input 
                type="text" 
                name="nama_alternatif" 
                bind:value={formNama}
                placeholder="Contoh: Lokasi A" 
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
              <textarea 
                name="deskripsi" 
                bind:value={formDeskripsi}
                rows="3"
                placeholder="Keterangan singkat..." 
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          <div class="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" on:click={closeModal} class="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 font-medium transition-colors">
              Batal
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm transition-colors">
              <Save size={18} />
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  {#if isDeleteModalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} />
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-2">Hapus Data?</h3>
        <p class="text-slate-500 text-sm mb-6">Data yang dihapus tidak dapat dikembalikan lagi.</p>
        
        <form method="POST" action="?/delete" use:enhance={() => {
            return async ({ result, update }) => {
                if (result.type === 'success') closeModal();
                await update();
            };
        }}>
          <input type="hidden" name="id" value={deleteId} />
          <div class="flex justify-center gap-3">
            <button type="button" on:click={closeModal} class="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 font-medium transition-colors">
              Batal
            </button>
            <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium shadow-sm transition-colors">
              Ya, Hapus
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

</div>