document.addEventListener('DOMContentLoaded', () => {
    const addItemBtn = document.querySelector('.add-item-btn');
    const inventoryTable = document.querySelector('.inventory-table tbody');
    const modal = createModal();
    let isEditMode = false; // 🔁 Global flag
    const selectAllCheckbox = document.getElementById('select-all');
    const bulkDeleteBtn = document.getElementById('bulk-delete');
    const exportBtn = document.getElementById('export-btn');
    const selectedCount = document.getElementById('selected-count');
    let selectedItems = new Set();

    selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        selectedItems.clear();

        checkboxes.forEach(cb => {
            cb.checked = e.target.checked;
            if (e.target.checked) selectedItems.add(cb.dataset.id);
        });

        updateSelectedCount();
    });

    // ✅ Checkbox per baris
    document.querySelectorAll('.row-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const id = cb.dataset.id;
            if (cb.checked) selectedItems.add(id);
            else selectedItems.delete(id);

            // Sync header checkbox
            const all = document.querySelectorAll('.row-checkbox');
            const checked = document.querySelectorAll('.row-checkbox:checked');
            selectAllCheckbox.checked = all.length === checked.length;

            updateSelectedCount();
        });
    });

    function updateSelectedCount() {
        selectedCount.textContent = selectedItems.size;
        document.getElementById('selected-summary').textContent = selectedItems.size;
        bulkDeleteBtn.disabled = selectedItems.size === 0;
        exportBtn.disabled = selectedItems.size === 0;
    }

    // ✅ Hapus Massal
    bulkDeleteBtn.addEventListener('click', async () => {
        if (selectedItems.size === 0) return alert('Tidak ada data dipilih.');

        const konfirmasi = await showConfirmDialog(`Yakin ingin menghapus ${selectedItems.size} data?`);
        if (!konfirmasi) return;

        try {
            const res = await fetch('/inventori/delete-multiple', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kodeList: Array.from(selectedItems) })
            });

            const result = await res.json();
            showToast(result.message || 'Berhasil dihapus!', 'success');
            location.reload();
        } catch (err) {
            showToast(result.message || 'Berhasil dihapus!', 'success');
        }
    });

    // ✅ Ekspor Sesuai Filter
    exportBtn.addEventListener('click', async () => {
        if (selectedItems.size === 0) return showToast('Pilih data terlebih dahulu', 'warning');

        try {
            const response = await fetch('/inventori/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kodeList: Array.from(selectedItems) })
            });

            if (!response.ok) {
                const err = await response.json();
                showToast(err.error || 'Gagal ekspor', 'error');
                return;
            }

            // Download blob Excel
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Inventori.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            showToast('Berhasil mengekspor file Excel!', 'success');

        } catch (err) {
            console.error(err);
            showToast('Berhasil mengekspor file Excel!', 'success');
        }
    });


    document.querySelector('.filter-btn').addEventListener('click', () => {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        let url = `/inventori/inventory?`;

        if (startDate) url += `startDate=${startDate}&`;
        if (endDate) url += `endDate=${endDate}&`;

        window.location.href = url;
    });

    document.getElementById('search-input').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const keyword = e.target.value.trim();
            const params = new URLSearchParams(window.location.search);
            if (keyword) params.set('search', keyword);
            else params.delete('search');
            window.location.href = '/inventori/inventory?' + params.toString();
        }
    });

    // Tombol Tambah Barang
    addItemBtn.addEventListener('click', () => {
        openModal({
            title: 'Tambah Barang',
            fields: {
                kode_barang: '',
                nama_barang: '',
                bagian: '',
                tanggal_pembelian: '',
                jumlah_stok: ''
            },
            isEdit: false
        });
    });

    // Event untuk tombol Edit & Hapus
    inventoryTable.addEventListener('click', async (e) => {
        const row = e.target.closest('tr');
        if (!row) return;

        const kode = row?.children[1]?.textContent?.trim();
        const nama = row?.children[2]?.textContent?.trim();

        if (e.target.closest('.edit-btn')) {
            try {
                const response = await fetch(`/inventori/${kode}`);
                const data = await response.json();

                openModal({
                    title: 'Edit Barang',
                    fields: data,
                    isEdit: true
                });
            } catch (err) {
                showToast("Gagal memuat detail barang", "error");
            }
        }

        if (e.target.closest('.delete-btn')) {
            const yakin = await showConfirmDialog(`Yakin ingin menghapus barang ${nama}?`);
            if (!yakin) return;
            try {
                await fetch(`/inventori/delete/${kode}`, { method: 'DELETE' });
                row.remove();
                showToast(`Barang '${nama}' berhasil dihapus!`, "success");
                setTimeout(() => location.reload(), 1000);
            } catch (err) {
                showToast("Gagal menghapus barang", "error");
            }
        }
    });

    // Membuat Modal
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'popup-modal';
        modal.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <h2 class="popup-title"></h2>
                    <button class="popup-close">&times;</button>
                </div>
                <div class="popup-body">
                    <form class="popup-form">
                        <label>Kode Barang</label>
                        <input type="text" name="kode_barang" required>
                        <label>Nama Barang</label>
                        <input type="text" name="nama_barang" required>
                        <label>Bagian</label>
                        <input type="text" name="bagian" required>
                        <label>Tanggal Pembelian</label>
                        <input type="date" name="tanggal_pembelian" required>
                        <label>Jumlah Stok</label>
                        <input type="number" name="jumlah_stok" required>
                        <div class="popup-buttons">
                            <button type="submit" class="popup-submit">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.popup-close').addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Event Simpan Data
        modal.querySelector('.popup-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const item = Object.fromEntries(formData.entries());

            item.jumlah_stok = parseInt(item.jumlah_stok, 10) || 0;

            try {
                const url = isEditMode
                    ? `/inventori/update/${item.kode_barang}`
                    : `/inventori/create`;
                const method = isEditMode ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item),
                    credentials: 'include'
                });

                if (response.ok) {
                    showToast(isEditMode ? "Barang berhasil diperbarui!" : "Barang berhasil ditambahkan!", "success");
                    modal.classList.remove('active');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    const errorText = await response.text();
                    console.error("RESPON GAGAL:", errorText);
                    showToast("Gagal menyimpan data", "error");
                }
            } catch (err) {
                showToast("Terjadi kesalahan saat menyimpan: " + err.message, "error");
            }
        });

        return modal;
    }

    // Buka Modal
    function openModal({ title, fields, isEdit }) {
        isEditMode = isEdit;

        modal.querySelector('.popup-title').textContent = title;

        const form = modal.querySelector('.popup-form');
        const kodeInput = form.querySelector('[name="kode_barang"]');
        const namaInput = form.querySelector('[name="nama_barang"]');
        const bagianInput = form.querySelector('[name="bagian"]');
        const tanggalInput = form.querySelector('[name="tanggal_pembelian"]');
        const stokInput = form.querySelector('[name="jumlah_stok"]');

        kodeInput.value = fields.kode_barang || '';
        namaInput.value = fields.nama_barang || '';
        bagianInput.value = fields.bagian || '';
        tanggalInput.value = fields.tanggal_pembelian?.slice(0, 10) || '';
        stokInput.value = fields.jumlah_stok || '';

        if (isEdit) {
            kodeInput.setAttribute('readonly', true);
        } else {
            kodeInput.removeAttribute('readonly');
        }

        modal.classList.add('active');
    }

    // Notifikasi Toast
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'toast';

        let iconClass = 'bx bx-error-circle';
        if (type === 'success') iconClass = 'bx bx-check-circle';
        if (type === 'warning') iconClass = 'bx bx-error';
        if (type === 'info') iconClass = 'bx bx-info-circle';

        toast.innerHTML = `<i class='${iconClass}'></i><span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    }

    function showConfirmDialog(message) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'confirm-dialog';
            dialog.innerHTML = `
            <div class="confirm-box">
                <p>${message}</p>
                <div class="confirm-actions">
                    <button id="confirm-yes">Ya</button>
                    <button id="confirm-no">Tidak</button>
                </div>
            </div>
        `;
            document.body.appendChild(dialog);

            dialog.querySelector('#confirm-yes').addEventListener('click', () => {
                resolve(true);
                dialog.remove();
            });

            dialog.querySelector('#confirm-no').addEventListener('click', () => {
                resolve(false);
                dialog.remove();
            });
        });
    }

    // User profile dropdown
    const userProfile = document.getElementById('user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', function (e) {
            // Prevent closing when clicking inside dropdown
            if (e.target.closest('.dropdown-menu')) return;
            
            this.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!userProfile.contains(e.target)) {
                userProfile.classList.remove('active');
            }
        });
    }

    // Sidebar Overlay
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (menuToggle && sidebar && sidebarOverlay) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', function () {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }
});