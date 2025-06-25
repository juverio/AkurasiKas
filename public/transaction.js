document.addEventListener('DOMContentLoaded', () => {
    buatPopupTransaksi(); // Bikin struktur popup utama

    const btnTambah = document.getElementById('btn-tambah-transaksi');
    let daftarBarang = [];

    // Event buka popup transaksi
    btnTambah?.addEventListener('click', () => {
        document.querySelector('.popup-overlay').style.display = 'flex';
        setTodayDate();
    });

    // Event close popup
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-popup')) {
            const popup = e.target.closest('.popup-overlay');
            if (popup.id === 'popup-barang') {
                popup.remove(); // untuk popup dinamis
            } else {
                popup.style.display = 'none'; // untuk popup transaksi utama
            }
        }
    });

    document.body.addEventListener('click', async (e) => {
        const id = e.target.closest('button')?.dataset?.id;
        if (!id) return;

        // Detail Transaksi
        if (e.target.closest('.btn-detail')) {
            try {
                const res = await fetch(`/type/transaction/detail/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                // Buat tampilan popup detail
                const popup = document.createElement('div');
                popup.className = 'popup-overlay';
                popup.innerHTML = `
            <div class="popup-form" style="max-width: 600px;">
                <div class="popup-header">
                    <h3>Detail Transaksi</h3>
                    <button class="close-popup">&times;</button>
                </div>
                <div class="popup-body">
                    <p><strong>Tanggal:</strong> ${new Date(data.tanggal).toLocaleDateString('id-ID')}</p>
                    <p><strong>Nama:</strong> ${data.nama}</p>
                    <p><strong>Jenis:</strong> ${data.jenis}</p>
                    <p><strong>Status:</strong> ${data.status_pengiriman}</p>
                    <p><strong>Total:</strong> Rp ${parseFloat(data.total).toLocaleString('id-ID')}</p>
                    <h4>Barang:</h4>
                    <ul>
                        ${data.barang.map(b => `
                            <li>${b.nama_barang} - ${b.qty} x Rp ${parseFloat(b.harga_satuan).toLocaleString('id-ID')} (Disc: ${b.disc}%)</li>
                        `).join('')}
                    </ul>
                </div>
            </div>`;
                document.body.appendChild(popup);
                popup.style.display = 'flex';
            } catch (err) {
                showToast(err.message || 'Gagal memuat detail transaksi');
            }
        }

        // Edit Transaksi
        else if (e.target.closest('.btn-edit')) {
            try {
                const res = await fetch(`/type/transaction/detail/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                // Ubah daftarBarang dan tampilkan popup
                daftarBarang = data.barang.map(b => ({
                    kode: b.kode_barang,
                    nama: b.nama_barang,
                    bagian: b.bagian,
                    qty: b.qty,
                    diskon: b.disc,
                    harga: b.harga_satuan,
                }));

                document.querySelector('.popup-overlay').style.display = 'flex';
                document.getElementById('tanggal_transaksi').value = data.tanggal.split('T')[0];
                document.getElementById('tanggal_invoice').value = data.tanggal_invoice?.split('T')[0] || data.tanggal.split('T')[0];
                document.getElementById('nama_customer').value = data.nama;
                document.getElementById('kode_invoice').value = data.kode || '';
                document.getElementById('jenis_dokumen').value = data.jenis;

                renderBarangTable();

                // Tambahkan id ke form untuk update
                document.getElementById('form-transaksi').dataset.editId = id;
            } catch (err) {
                showToast(err.message || 'Gagal memuat data untuk edit');
            }
        }

        // Edit Status Pengiriman
        else if (e.target.closest('.btn-status')) {
            const statusBaru = prompt('Ubah status pengiriman (Diproses/Dikirim/Selesai)?');
            if (!statusBaru) return;
            try {
                const res = await fetch(`/type/transaction/status/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: statusBaru })
                });
                const result = await res.json();
                showToast(result.message);
                if (res.ok) location.reload();
            } catch (err) {
                showToast('Gagal mengubah status');
            }
        }

        // Hapus Transaksi
        else if (e.target.closest('.btn-delete')) {
            if (!confirm('Yakin ingin menghapus transaksi ini?')) return;
            try {
                const res = await fetch(`/type/transaction/${id}`, { method: 'DELETE' });
                const result = await res.json();
                showToast(result.message);
                if (res.ok) location.reload();
            } catch (err) {
                showToast('Gagal menghapus transaksi');
            }
        }
    });


    // Event listener tombol tambah barang
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-tambah-barang')) {
            buatPopupTambahBarang((barangBaru) => {
                daftarBarang.push(barangBaru);
                renderBarangTable();
            });
        }
    });

    function buatPopupTransaksi() {
        const popup = document.createElement('div');
        popup.classList.add('popup-overlay');
        popup.style.display = 'none';
        popup.innerHTML = `
        <div class="popup-form" id="popup-transaction">
            <div class="popup-header">
                <h3>Tambah Transaksi</h3>
                <button class="close-popup">&times;</button>
            </div>
            <div class="popup-body">
                <form id="form-transaksi">
                    <div class="form-group">
                        <label>Tanggal Transaksi</label>
                        <input type="date" id="tanggal_transaksi" required>
                    </div>
                    <div class="form-group">
                        <label>Nama Customer</label>
                        <input type="text" id="nama_customer" required>
                    </div>
                    <div class="form-group">
                        <label>Kode Invoice</label>
                        <input type="text" id="kode_invoice" required>
                    </div>
                    <div class="form-group">
                        <label>Jenis Dokumen</label>
                        <select id="jenis_dokumen" required>
                            <option value="penjualan">Penjualan</option>
                            <option value="pembelian">Pembelian</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Tanggal Invoice</label>
                        <input type="date" id="tanggal_invoice" required>
                    </div>

                    <div class="barang-section">
                        <button type="button" class="btn-tambah-barang">+ Tambah Barang</button>
                        <table class="barang-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Kode Barang</th>
                                    <th>Nama Barang</th>
                                    <th>Bagian</th>
                                    <th>Qty</th>
                                    <th>Diskon (%)</th>
                                    <th>Harga Satuan</th>
                                    <th>Subtotal</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="barang-body">
                                <tr class="empty-row">
                                    <td colspan="9" style="text-align:center; color:gray;">Tidak ada Barang</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="form-total">
                        <label>Total Transaksi: </label>
                        <span id="total-transaksi">Rp 0</span>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-submit">Simpan</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Toast -->
        <div id="toast" class="toast" style="display:none;"></div>
    `;
        document.body.appendChild(popup);

        // Tambahkan validasi saat submit
        popup.querySelector('#form-transaksi').addEventListener('submit', async (e) => {
            e.preventDefault();
            const barangRows = document.querySelectorAll('#barang-body tr:not(.empty-row)');
            if (barangRows.length === 0) {
                showToast('Harap tambahkan minimal 1 barang sebelum menyimpan transaksi');
                return;
            }

            const data = {
                jenis: document.getElementById('jenis_dokumen').value,
                tanggal_invoice: document.getElementById('tanggal_invoice').value,
                nama_customer: document.getElementById('nama_customer').value,
                barang: daftarBarang.map(b => ({
                    kode_barang: b.kode,
                    nama_barang: b.nama,
                    bagian: b.bagian,
                    qty: b.qty,
                    disc: b.diskon,
                    harga_satuan: b.harga,
                    subtotal: b.qty * b.harga * (1 - b.diskon / 100),
                })),
            };

            try {
                const res = await fetch('/type/transaction', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await res.json();
                showToast(result.message);
                if (res.ok) {
                    document.querySelector('.popup-overlay').style.display = 'none';
                    setTimeout(() => window.location.reload(), 1000);
                }
            } catch (err) {
                showToast('Gagal menyimpan transaksi');
            }
        });

    }

    function showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.style.display = 'block';
        toast.style.opacity = '1';

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 300);
        }, 2500);
    }

    function setTodayDate() {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Tambah 1 bulan
        const jatuhTempo = new Date(today);
        jatuhTempo.setMonth(jatuhTempo.getMonth() + 1);
        const jatuhTempoStr = jatuhTempo.toISOString().split('T')[0];

        document.getElementById('tanggal_transaksi').value = todayStr;
        document.getElementById('tanggal_invoice').value = todayStr;
        document.getElementById('jatuh_tempo').value = jatuhTempoStr;
    }

    function buatPopupTambahBarang(callback, barangEdit = null) {
        const popupLama = document.getElementById('popup-barang');
        if (popupLama) popupLama.remove();

        const popup = document.createElement('div');
        popup.className = 'popup-overlay';
        popup.id = 'popup-barang';
        popup.innerHTML = `
        <div class="popup-form" style="max-width: 450px;">
            <div class="popup-header">
                <h3>${barangEdit ? 'Edit Barang' : 'Tambah Barang'}</h3>
                <button class="close-popup">&times;</button>
            </div>
            <div class="popup-body">
                <form id="form-barang">
                    <div class="form-group">
                        <label>Kode Barang</label>
                        <input type="text" id="kodeBarang" required value="${barangEdit?.kode || ''}">
                    </div>
                    <div class="form-group">
                        <label>Nama Barang</label>
                        <input type="text" id="namaBarang" readonly value="${barangEdit?.nama || ''}">
                    </div>
                    <div class="form-group">
                        <label>Bagian</label>
                        <input type="text" id="bagian" readonly value="${barangEdit?.bagian || ''}">
                    </div>
                    <div class="form-group">
                        <label>Qty</label>
                        <input type="number" id="qty" required value="${barangEdit?.qty || 1}" min="1">
                    </div>
                    <div class="form-group">
                        <label>Diskon (%)</label>
                        <input type="number" id="diskon" required value="${barangEdit?.diskon || 0}" min="0" max="100">
                    </div>
                    <div class="form-group">
                        <label>Harga Satuan</label>
                        <input type="number" id="harga" required value="${barangEdit?.harga || 0}" min="0">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-submit">Simpan</button>
                    </div>
                </form>
            </div>
            <div class="toast toast-popup" style="display:none;"></div>
        </div>
    `;
        document.body.appendChild(popup);
        popup.style.display = 'flex';

        const kodeInput = popup.querySelector('#kodeBarang');
        const namaInput = popup.querySelector('#namaBarang');
        const bagianInput = popup.querySelector('#bagian');
        const toastPopup = popup.querySelector('.toast-popup');

        let barangValid = false;

        // 🔎 Auto-fill nama & bagian saat kode diisi
        kodeInput.addEventListener('blur', async () => {
            const kode = kodeInput.value.trim();
            if (!kode) return;

            try {
                const res = await fetch(`/type/cari-barang?kode=${kode}`);
                if (!res.ok) throw new Error();

                const barang = await res.json();
                namaInput.value = barang.nama_barang;
                bagianInput.value = barang.bagian;
                barangValid = true;

            } catch (err) {
                namaInput.value = '';
                bagianInput.value = '';
                barangValid = false;
                showPopupToast('Barang tidak ditemukan di database.');
            }
        });

        popup.querySelector('#form-barang').addEventListener('submit', (e) => {
            e.preventDefault();

            if (!barangValid) {
                showPopupToast('Barang tidak valid. Mohon isi kode yang tersedia di database.');
                return;
            }

            const data = {
                kode: kodeInput.value,
                nama: namaInput.value,
                bagian: bagianInput.value,
                qty: parseFloat(popup.querySelector('#qty').value),
                diskon: parseFloat(popup.querySelector('#diskon').value),
                harga: parseFloat(popup.querySelector('#harga').value),
            };

            popup.remove();
            callback(data);
        });

        popup.querySelector('.close-popup').addEventListener('click', () => popup.remove());

        // 🔔 Toast khusus pop-up
        function showPopupToast(message) {
            toastPopup.textContent = message;
            toastPopup.style.display = 'block';
            toastPopup.style.opacity = '1';

            setTimeout(() => {
                toastPopup.style.opacity = '0';
                setTimeout(() => {
                    toastPopup.style.display = 'none';
                }, 300);
            }, 2500);
        }
    }



    function renderBarangTable() {
        const tbody = document.getElementById('barang-body');
        tbody.innerHTML = '';
        daftarBarang.forEach((barang, index) => {
            const subtotal = (barang.qty * barang.harga) * (1 - barang.diskon / 100);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${barang.kode}</td>
                <td>${barang.nama}</td>
                <td>${barang.bagian}</td>
                <td>${barang.qty}</td>
                <td>${barang.diskon}</td>
                <td>Rp ${barang.harga.toLocaleString('id-ID')}</td>
                <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
                <td>
                    <button type="button" class="edit-barang" data-index="${index}"><i
                                                        class="fas fa-edit"></i></button>
                    <button type="button" class="hapus-barang" data-index="${index}"><i
                                                        class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Hapus
        document.querySelectorAll('.hapus-barang').forEach(btn => {
            btn.addEventListener('click', e => {
                const index = parseInt(e.target.dataset.index);
                daftarBarang.splice(index, 1);
                renderBarangTable();
            });
        });

        // Edit
        document.querySelectorAll('.edit-barang').forEach(btn => {
            btn.addEventListener('click', e => {
                const index = parseInt(e.target.dataset.index);
                const barang = daftarBarang[index];
                buatPopupTambahBarang((barangBaru) => {
                    daftarBarang[index] = barangBaru;
                    renderBarangTable();
                }, barang);
            });
        });

        updateTotalTransaksi();
    }

    function updateTotalTransaksi() {
        const total = daftarBarang.reduce((sum, b) => {
            return sum + (b.qty * b.harga) * (1 - b.diskon / 100);
        }, 0);
        document.getElementById('total-transaksi').textContent = 'Rp ' + total.toLocaleString('id-ID');
    }
});
