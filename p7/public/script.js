document.addEventListener('DOMContentLoaded', () => {
  const get = id => document.getElementById(id);
  const form = get('mhsForm');
  const fields = ['nim', 'nama', 'jurusan', 'email'];
  const tbody = get('mhsTableBody');
  const searchInput = get('searchInput');
  let listMahasiswa = [];
  let loaded = false;
  let busy = false;

  function showAlert(message, type = 'success') {
    get('alertMessage').textContent = message;
    get('alertMessage').className = `alert alert-${type}`;
    get('alertMessage').hidden = false;
  }
  async function request(url, options) {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok || data.success === false) throw new Error(data.message || 'Permintaan gagal.');
    return data;
  }
  function resetForm() {
    form.reset();
    get('mhsId').value = '';
    get('formTitle').textContent = 'Tambah Mahasiswa Baru';
    get('btnSubmit').textContent = 'Simpan Mahasiswa';
    get('btnCancel').hidden = true;
  }
  function updateControls() {
    get('btnSubmit').disabled = busy || !loaded;
    get('btnReload').disabled = busy;
    get('btnCancel').disabled = busy;
    tbody.querySelectorAll('button').forEach(button => { button.disabled = busy; });
  }
  function renderTable() {
    // Fitur 1: filter lokal setiap pengguna mengetik, tanpa request baru.
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = listMahasiswa.filter(mhs =>
      mhs.nama.toLowerCase().includes(keyword) || mhs.nim.toLowerCase().includes(keyword)
    );
    // Fitur 3: hitung seluruh data terdaftar, termasuk yang tidak tampil saat pencarian.
    get('totalMahasiswa').textContent = `Total Mahasiswa Terdaftar: ${listMahasiswa.length} Orang`;
    tbody.replaceChildren();
    if (!filtered.length) {
      const cell = document.createElement('td');
      cell.colSpan = 6;
      cell.textContent = keyword ? 'Tidak ada mahasiswa yang cocok.' : 'Belum ada data mahasiswa tersimpan.';
      const row = document.createElement('tr');
      row.appendChild(cell);
      tbody.appendChild(row);
    }
    filtered.forEach((mhs, index) => {
      const row = document.createElement('tr');
      [index + 1, mhs.nim, mhs.nama, mhs.jurusan, mhs.email].forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
      });
      const actions = document.createElement('td');
      ['edit', 'delete'].forEach(action => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `btn-${action}`;
        button.dataset.id = mhs.id;
        button.textContent = action === 'edit' ? 'Edit' : 'Hapus';
        actions.appendChild(button);
      });
      row.appendChild(actions);
      tbody.appendChild(row);
    });
    updateControls();
  }
  async function loadMahasiswa() {
    const data = await request('/api/mahasiswa');
    if (!Array.isArray(data)) throw new Error('Format data mahasiswa tidak valid.');
    listMahasiswa = data;
    loaded = true;
    renderTable();
  }
  async function reload() {
    if (busy) return;
    busy = true;
    updateControls();
    try { await loadMahasiswa(); }
    catch (err) { showAlert(`Gagal memuat data: ${err.message}`, 'error'); }
    finally { busy = false; updateControls(); }
  }
  searchInput.addEventListener('input', () => { if (loaded) renderTable(); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !loaded) return;
    const payload = Object.fromEntries(fields.map(key => [key, get(key).value.trim()]));
    if (fields.some(key => !payload[key])) return showAlert('Semua kolom wajib diisi.', 'error');
    const id = get('mhsId').value;
    // Fitur 2: saat edit, abaikan NIM milik baris yang sedang diedit.
    const duplicate = listMahasiswa.some(mhs => mhs.nim === payload.nim && String(mhs.id) !== id);
    if (duplicate) {
      alert('NIM sudah terdaftar!');
      return;
    }
    busy = true;
    updateControls();
    try {
      const result = await request(id ? `/api/mahasiswa/${id}` : '/api/mahasiswa', {
        method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      resetForm();
      // Perbarui daftar dan counter langsung setelah backend berhasil menyimpan.
      if (id) listMahasiswa = listMahasiswa.map(m => String(m.id) === id ? { ...m, ...payload } : m);
      else listMahasiswa.unshift({ id: result.id, ...payload });
      renderTable();
      showAlert(result.message);
    } catch (err) { showAlert(err.message, 'error'); }
    finally { busy = false; updateControls(); }
  });
  tbody.addEventListener('click', async event => {
    const button = event.target.closest('button[data-id]');
    if (!button || busy) return;
    const id = button.dataset.id;
    const mahasiswa = listMahasiswa.find(m => String(m.id) === id);
    if (!mahasiswa) return;
    if (button.classList.contains('btn-edit')) {
      get('mhsId').value = id;
      fields.forEach(key => { get(key).value = mahasiswa[key]; });
      get('formTitle').textContent = 'Edit Data Mahasiswa';
      get('btnSubmit').textContent = 'Perbarui Mahasiswa';
      get('btnCancel').hidden = false;
      get('nim').focus();
    } else if (button.classList.contains('btn-delete') && confirm('Apakah Anda yakin ingin menghapus data mahasiswa ini?')) {
      busy = true;
      updateControls();
      try {
        const result = await request(`/api/mahasiswa/${id}`, { method: 'DELETE' });
        listMahasiswa = listMahasiswa.filter(m => String(m.id) !== id);
        if (get('mhsId').value === id) resetForm();
        renderTable();
        showAlert(result.message);
      } catch (err) { showAlert(err.message, 'error'); }
      finally { busy = false; updateControls(); }
    }
  });
  get('btnCancel').addEventListener('click', resetForm);
  get('btnReload').addEventListener('click', reload);
  reload();
});
