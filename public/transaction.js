document.addEventListener('DOMContentLoaded', function () {
    // Sidebar Toggle Functionality
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

    // Handle Transaction Type Dropdown
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function () {
            dropdownMenu.style.display = 'none';
        });

        dropdownMenu.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        const dropdownOptions = dropdownMenu.querySelectorAll('a');
        dropdownOptions.forEach(option => {
            option.addEventListener('click', function () {
                const selectedText = this.textContent;
                dropdownToggle.innerHTML = selectedText + ' <i class="fas fa-caret-down"></i>';
                dropdownMenu.style.display = 'none';
            });
        });
    }

    // Table Selection Functionality
    const selectAllCheckbox = document.getElementById('select-all');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');

    if (selectAllCheckbox && rowCheckboxes.length > 0) {
        selectAllCheckbox.addEventListener('change', function () {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
                updateRowSelection(checkbox);
            });
        });

        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                updateRowSelection(this);

                const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
                const someChecked = Array.from(rowCheckboxes).some(cb => cb.checked);

                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate = someChecked && !allChecked;
            });

            updateRowSelection(checkbox);
        });
    }

    function updateRowSelection(checkbox) {
        const row = checkbox.closest('tr');
        if (row) {
            if (checkbox.checked) {
                row.classList.add('selected-row');
            } else {
                row.classList.remove('selected-row');
            }
        }
    }

    // Calendar input functionality
    const dateInputs = document.querySelectorAll('.date-input');
    const calendarIcons = document.querySelectorAll('.date-field i');

    if (dateInputs.length > 0) {
        dateInputs.forEach(input => {
            // Tambahkan event listener untuk menangani perubahan tanggal
            input.addEventListener('change', function () {
                const selectedDate = this.value;
                console.log(`Tanggal dipilih: ${selectedDate}`);
            });
        });

        // Make calendar icons clickable
        if (calendarIcons.length > 0) {
            calendarIcons.forEach(icon => {
                icon.addEventListener('click', function () {
                    const input = this.parentElement.querySelector('.date-input');
                    if (input) {
                        input.focus(); // Fokuskan input tanggal
                        input.showPicker(); // Buka date picker (jika didukung)
                    }
                });
            });
        }
    }

    // Pagination functionality
    const paginationButtons = document.querySelectorAll('.pagination-number');
    const prevPageArrow = document.querySelector('.pagination-arrow:first-child');
    const nextPageArrow = document.querySelector('.pagination-arrow:last-child');

    if (paginationButtons.length > 0) {
        function getCurrentActivePage() {
            let currentPage = 1;
            let currentButton = null;

            paginationButtons.forEach((btn, index) => {
                if (btn.classList.contains('active')) {
                    currentPage = parseInt(btn.textContent);
                    currentButton = btn;
                }
            });

            return { page: currentPage, button: currentButton };
        }

        function setActivePage(pageNum) {
            let targetButton = null;

            paginationButtons.forEach(btn => {
                const btnPage = parseInt(btn.textContent);
                if (btnPage === pageNum) {
                    targetButton = btn;
                }
                btn.classList.remove('active');
            });

            if (targetButton) {
                targetButton.classList.add('active');
                console.log(`Navigated to page ${pageNum}`);
                updateArrowStates(pageNum);
                return true;
            }

            return false;
        }

        function updateArrowStates(currentPage) {
            const minPage = parseInt(paginationButtons[0].textContent);
            const maxPage = parseInt(paginationButtons[paginationButtons.length - 1].textContent);

            if (currentPage <= minPage) {
                prevPageArrow.classList.add('disabled');
                prevPageArrow.style.opacity = '0.5';
                prevPageArrow.style.cursor = 'not-allowed';
            } else {
                prevPageArrow.classList.remove('disabled');
                prevPageArrow.style.opacity = '1';
                prevPageArrow.style.cursor = 'pointer';
            }

            if (currentPage >= maxPage) {
                nextPageArrow.classList.add('disabled');
                nextPageArrow.style.opacity = '0.5';
                nextPageArrow.style.cursor = 'not-allowed';
            } else {
                nextPageArrow.classList.remove('disabled');
                nextPageArrow.style.opacity = '1';
                nextPageArrow.style.cursor = 'pointer';
            }
        }

        updateArrowStates(getCurrentActivePage().page);

        if (prevPageArrow) {
            prevPageArrow.addEventListener('click', function () {
                if (this.classList.contains('disabled')) return;

                const { page } = getCurrentActivePage();
                setActivePage(page - 1);
            });
        }

        if (nextPageArrow) {
            nextPageArrow.addEventListener('click', function () {
                if (this.classList.contains('disabled')) return;

                const { page } = getCurrentActivePage();
                setActivePage(page + 1);
            });
        }

        paginationButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const pageNum = parseInt(this.textContent);
                setActivePage(pageNum);
            });
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search input');

    if (searchInput) {
        searchInput.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim().toLowerCase();

                if (searchTerm.length > 0) {
                    alert(`Searching for: "${searchTerm}". In a real application, this would filter the table.`);
                }
            }
        });
    }

    // Download button functionality
    const downloadButton = document.querySelector('.btn-secondary');

    if (downloadButton) {
        downloadButton.addEventListener('click', function () {
            const selectedRows = document.querySelectorAll('.selected-row');
            const selectedCount = selectedRows.length;

            if (selectedCount > 0) {
                alert(`Downloading data for ${selectedCount} selected transaction(s). In a real application, this would generate a CSV/Excel file.`);
            } else {
                alert('Please select at least one transaction to download.');
            }
        });
    }

    // New transaction button functionality
    const newTransactionButton = document.querySelector('.action-buttons .btn-primary');

    if (newTransactionButton) {
        newTransactionButton.addEventListener('click', function () {
            createTransactionDialog(); // Buat dan tampilkan dialog
        });
    }

    // Fungsi untuk menutup semua dialog yang terbuka
    function closeAllDialogs() {
        const existingDialog = document.getElementById('transactionDialog');
        const existingAddItemDialog = document.getElementById('addItemDialog');
        const existingOverlay = document.getElementById('dialogOverlay');

        if (existingDialog) {
            document.body.removeChild(existingDialog);
        }
        if (existingAddItemDialog) {
            document.body.removeChild(existingAddItemDialog);
        }
        if (existingOverlay) {
            document.body.removeChild(existingOverlay);
        }
    }

    // Fungsi untuk membuat dan menampilkan dialog utama (Input Transaksi)
    function createTransactionDialog() {
        closeAllDialogs(); // Tutup semua dialog yang sudah terbuka

        // Buat elemen dialog
        const dialog = document.createElement('div');
        dialog.id = 'transactionDialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.width = '600px';
        dialog.style.maxHeight = '80vh';
        dialog.style.overflowY = 'auto';
        dialog.style.padding = '20px';
        dialog.style.backgroundColor = '#fff';
        dialog.style.border = '1px solid #ccc';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        dialog.style.zIndex = '1000';

        // Tambahkan konten ke dalam dialog
        dialog.innerHTML = `
        <h2>Input Transaksi</h2>
        <div>
            <label for="inputDate">Tgl. Input Transaksi:</label>
            <input type="date" id="inputDate" name="inputDate" required>
        </div>
        <div>
            <label for="dueDate">Tgl. Jatuh Tempo:</label>
            <input type="date" id="dueDate" name="dueDate" required>
        </div>
        <div>
            <label for="invoiceCode">Kode Invoice:</label>
            <input type="text" id="invoiceCode" name="invoiceCode" required>
        </div>
        <div>
            <label for="docType">Jenis Dok. Transaksi:</label>
            <input type="text" id="docType" name="docType" required>
        </div>
        <div>
            <label for="supplierName">Nama Supplier/Cust:</label>
            <input type="text" id="supplierName" name="supplierName" required>
        </div>
        <div>
            <label for="invoiceDate">Tanggal Invoice:</label>
            <input type="date" id="invoiceDate" name="invoiceDate" required>
        </div>
        
        <!-- Tombol Tambah Barang -->
        <button type="button" class="btn-primary" id="addItemButton" style="margin-bottom: 16px;">Tambah Barang</button>
        
        <!-- Tabel Barang -->
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Kode Barang</th>
                    <th>Nama Barang</th>
                    <th>Beginn</th>
                    <th>Ory</th>
                    <th>Disc</th>
                    <th>Harga Satuan</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td><input type="text" value="SKU85003"></td>
                    <td><input type="text" value="Pita 1"></td>
                    <td><input type="text" value="Pita"></td>
                    <td><input type="text" value="Zipos"></td>
                    <td><input type="text" value="TK"></td>
                    <td><input type="text" value="Rp 16.000"></td>
                    <td><input type="text" value=""></td>
                </tr>
                <tr>
                    <td>2</td>
                    <td><input type="text" value="SKU20061"></td>
                    <td><input type="text" value="Pita 2"></td>
                    <td><input type="text" value="Pita"></td>
                    <td><input type="text" value="Tipos"></td>
                    <td><input type="text" value="0"></td>
                    <td><input type="text" value=""></td>
                    <td><input type="text" value=""></td>
                </tr>
                <tr>
                    <td>3</td>
                    <td><input type="text" value="SKU87861"></td>
                    <td><input type="text" value="Kristal 1"></td>
                    <td><input type="text" value="Acc"></td>
                    <td><input type="text" value="TQba"></td>
                    <td><input type="text" value="0"></td>
                    <td><input type="text" value=""></td>
                    <td><input type="text" value=""></td>
                </tr>
                <tr>
                    <td>4</td>
                    <td><input type="text" value="SKU71672"></td>
                    <td><input type="text" value="Kristal 3"></td>
                    <td><input type="text" value="Acc"></td>
                    <td><input type="text" value="Topos"></td>
                    <td><input type="text" value="1.5%"></td>
                    <td><input type="text" value=""></td>
                    <td><input type="text" value=""></td>
                </tr>
            </tbody>
        </table>
        <div>
            <h3>Total</h3>
            <div>
                <label for="debit">Debit:</label>
                <input type="text" id="debit" name="debit" value="0">
            </div>
            <div>
                <label for="credit">Kredit:</label>
                <input type="text" id="credit" name="credit" value="0">
            </div>
            <div>
                <label for="balance">Saldo:</label>
                <input type="text" id="balance" name="balance" value="0">
            </div>
        </div>
        <div class="dialog-buttons">
            <button type="button" class="btn-primary" id="saveButton">Simpan</button>
            <button type="button" class="btn-secondary" id="cancelButton">Batal</button>
        </div>
    `;

        // Tambahkan dialog ke dalam body
        document.body.appendChild(dialog);

        // Tambahkan overlay
        const overlay = document.createElement('div');
        overlay.id = 'dialogOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '999';
        document.body.appendChild(overlay);

        // Tangani klik tombol "Batal"
        const cancelButton = document.getElementById('cancelButton');
        cancelButton.addEventListener('click', function () {
            closeAllDialogs();
        });

        // Tangani klik tombol "Simpan"
        const saveButton = document.getElementById('saveButton');
        saveButton.addEventListener('click', function () {
            const supplierName = document.getElementById('supplierName').value;
            const invoiceDate = document.getElementById('invoiceDate').value;

            console.log('Data Transaksi:', {
                supplierName,
                invoiceDate
            });

            alert('Transaksi berhasil disimpan!');
            closeAllDialogs();
        });

        // Tangani klik tombol "Tambah Barang"
        const addItemButton = document.getElementById('addItemButton');
        addItemButton.addEventListener('click', function () {
            createAddItemDialog(); // Buat dan tampilkan dialog tambah barang
        });

        // Fungsi untuk menutup dialog
        function closeDialog() {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
        }
    }

    // Tambahkan styling untuk dialog dan tombol
    const style = document.createElement('style');
    style.innerHTML = `
        #transactionDialog h2 {
            margin-top: 0;
            font-size: 1.5em;
            color: #333;
        }

        #transactionDialog label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #555;
        }

        #transactionDialog input {
            width: 100%;
            padding: 8px;
            margin-bottom: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        #transactionDialog table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }

        #transactionDialog table th,
        #transactionDialog table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }

        #transactionDialog table input {
            width: 100%;
            border: none;
            background: transparent;
        }

        .dialog-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 16px;
        }

        .dialog-buttons button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .dialog-buttons .btn-primary {
            background-color: #007bff;
            color: #fff;
        }

        .dialog-buttons .btn-secondary {
            background-color: #6c757d;
            color: #fff;
        }
    `;
    document.head.appendChild(style);

    // Fungsi untuk membuat dan menampilkan dialog tambah barang
    function createAddItemDialog() {
        closeAllDialogs(); // Tutup semua dialog yang sudah terbuka

        // Buat elemen dialog
        const dialog = document.createElement('div');
        dialog.id = 'addItemDialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.width = '400px';
        dialog.style.padding = '20px';
        dialog.style.maxHeight = '80vh';
        dialog.style.overflowY = 'auto';
        dialog.style.backgroundColor = '#fff';
        dialog.style.border = '1px solid #ccc';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        dialog.style.zIndex = '1000';

        // Tambahkan konten ke dalam dialog
        dialog.innerHTML = `
        <h2>Tambah Barang</h2>
        <div>
            <label for="itemCode">Kode Barang:</label>
            <input type="text" id="itemCode" name="itemCode" required>
        </div>
        <div>
            <label for="itemName">Nama Barang:</label>
            <input type="text" id="itemName" name="itemName" required>
        </div>
        <div>
            <label for="itemBeginn">Beginn:</label>
            <input type="text" id="itemBeginn" name="itemBeginn" required>
        </div>
        <div>
            <label for="itemOry">Ory:</label>
            <input type="text" id="itemOry" name="itemOry" required>
        </div>
        <div>
            <label for="itemDisc">Disc:</label>
            <input type="text" id="itemDisc" name="itemDisc" required>
        </div>
        <div>
            <label for="itemPrice">Harga Satuan:</label>
            <input type="text" id="itemPrice" name="itemPrice" required>
        </div>
        <div class="dialog-buttons">
            <button type="button" class="btn-primary" id="saveItemButton">Simpan</button>
            <button type="button" class="btn-secondary" id="cancelItemButton">Batal</button>
        </div>
    `;

        // Tambahkan dialog ke dalam body
        document.body.appendChild(dialog);

        // Tambahkan overlay
        const overlay = document.createElement('div');
        overlay.id = 'dialogOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '999';
        document.body.appendChild(overlay);

        // Tangani klik tombol "Batal"
        const cancelItemButton = document.getElementById('cancelItemButton');
        cancelItemButton.addEventListener('click', function () {
            createTransactionDialog();
        });

        // Tangani klik tombol "Simpan"
        const saveItemButton = document.getElementById('saveItemButton');
        saveItemButton.addEventListener('click', function () {
            const itemCode = document.getElementById('itemCode').value;
            const itemName = document.getElementById('itemName').value;
            const itemBeginn = document.getElementById('itemBeginn').value;
            const itemOry = document.getElementById('itemOry').value;
            const itemDisc = document.getElementById('itemDisc').value;
            const itemPrice = document.getElementById('itemPrice').value;

            console.log('Barang Baru:', {
                itemCode,
                itemName,
                itemBeginn,
                itemOry,
                itemDisc,
                itemPrice
            });

            alert('Barang berhasil ditambahkan!');
            createTransactionDialog();
        });
    }

    // Fungsi untuk menutup semua dialog
    function closeAllDialogs() {
        const existingDialog = document.getElementById('transactionDialog');
        const existingAddItemDialog = document.getElementById('addItemDialog');
        const existingOverlay = document.getElementById('dialogOverlay');

        if (existingDialog) {
            document.body.removeChild(existingDialog);
        }
        if (existingAddItemDialog) {
            document.body.removeChild(existingAddItemDialog);
        }
        if (existingOverlay) {
            document.body.removeChild(existingOverlay);
        }
    }

    // Fungsi untuk menutup dialog tambah barang
    function closeAddItemDialog() {
        document.body.removeChild(dialog);
        document.body.removeChild(overlay);
    }


    // Tambahkan styling untuk dialog tambah barang
    const style1 = document.createElement('style');
    style1.innerHTML = `
        #addItemDialog h2 {
            margin-top: 0;
            font-size: 1.5em;
            color: #333;
        }

        #addItemDialog label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #555;
        }

        #addItemDialog input {
            width: 100%;
            padding: 8px;
            margin-bottom: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .dialog-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 16px;
        }

        .dialog-buttons button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .dialog-buttons .btn-primary {
            background-color: #007bff;
            color: #fff;
        }

        .dialog-buttons .btn-secondary {
            background-color: #6c757d;
            color: #fff;
        }
    `;
    document.head.appendChild(style1);

    // Filter button functionality
    const filterButton = document.querySelector('.btn-icon');

    if (filterButton) {
        filterButton.addEventListener('click', function () {
            alert('This would open advanced filtering options. In a real application, this might show a dropdown or modal with filter criteria.');
        });
    }

    // Notification bell functionality
    const notificationBell = document.querySelector('.header-right .fa-bell');

    if (notificationBell) {
        notificationBell.addEventListener('click', function () {
            alert('This would show notifications. In a real application, this would display a dropdown with recent notifications.');
        });
    }

    // Make status cells clickable to show status history
    const statusCells = document.querySelectorAll('td .status');

    if (statusCells.length > 0) {
        statusCells.forEach(status => {
            status.addEventListener('click', function () {
                const statusText = this.textContent;
                const transactionCode = this.closest('tr').cells[1].textContent;
                alert(`Status history for ${transactionCode}: ${statusText}. In a real application, this would show a modal with the full status history.`);
            });

            status.style.cursor = 'pointer';
        });
    }

    // Add row hover effect
    const tableRows = document.querySelectorAll('tbody tr');

    if (tableRows.length > 0) {
        tableRows.forEach(row => {
            row.addEventListener('mouseenter', function () {
                if (!this.classList.contains('selected-row')) {
                    this.style.backgroundColor = '#f9fafb';
                }
            });

            row.addEventListener('mouseleave', function () {
                if (!this.classList.contains('selected-row')) {
                    this.style.backgroundColor = '';
                }
            });
        });
    }

    // Profile Dropdown Functionality
    const userProfile = document.getElementById('user-profile');

    if (userProfile) {
        userProfile.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!userProfile.contains(e.target)) {
                userProfile.classList.remove('active');
            }
        });

        // Prevent dropdown from closing when clicking inside it
        const dropdownMenu = userProfile.querySelector('.profile-dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }
    }
});