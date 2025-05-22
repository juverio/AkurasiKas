document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const selectAllCheckbox = document.getElementById('select-all');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const bulkDeleteBtn = document.getElementById('bulk-delete');
    const selectedCount = document.getElementById('selected-count');
    const selectedSummary = document.getElementById('selected-summary');
    const confirmModal = document.getElementById('confirm-modal');
    const modalClose = document.querySelector('.modal-close');
    const btnCancel = document.querySelector('.btn-cancel');
    const btnConfirm = document.querySelector('.btn-confirm');
    const confirmMessage = document.getElementById('confirm-message');
    
    // Current page state
    let currentPage = 1;
    let selectedItems = [];
    
    // Initialize date pickers
    function initDatePickers() {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        document.getElementById('start-date').valueAsDate = firstDay;
        document.getElementById('end-date').valueAsDate = lastDay;
    }
    
    // Filter button click handler
    document.querySelector('.filter-btn').addEventListener('click', function() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        // Here you would typically make an AJAX request to filter the data
        console.log('Filtering from', startDate, 'to', endDate);
        // For demo, we'll just reload the table
        loadTableData();
    });
    
    // Download button click handler
    document.querySelector('.download-btn').addEventListener('click', function() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        console.log('Exporting data from', startDate, 'to', endDate);
        // In a real app, this would trigger a download
        alert('Ekspor data akan dimulai...');
    });
    
    // Select all checkbox
    selectAllCheckbox.addEventListener('change', function() {
        const isChecked = this.checked;
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            updateRowSelection(checkbox);
        });
        updateSelectionSummary();
    });
    
    // Individual row checkbox
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateRowSelection(this);
            updateSelectionSummary();
        });
    });
    
    // Row click handler
    document.querySelectorAll('.inventory-table tbody tr').forEach(row => {
        row.addEventListener('click', function(e) {
            if (!e.target.matches('input[type="checkbox"], button, a, i')) {
                const checkbox = this.querySelector('.row-checkbox');
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    });
    
    // Update row selection style
    function updateRowSelection(checkbox) {
        const row = checkbox.closest('tr');
        if (checkbox.checked) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
            selectAllCheckbox.checked = false;
        }
    }
    
    // Update selection summary
    function updateSelectionSummary() {
        selectedItems = Array.from(document.querySelectorAll('.row-checkbox:checked'))
            .map(checkbox => checkbox.dataset.id);
        
        const count = selectedItems.length;
        selectedCount.textContent = count;
        selectedSummary.textContent = count;
        
        bulkDeleteBtn.disabled = count === 0;
    }
    
    // Bulk delete action
    bulkDeleteBtn.addEventListener('click', function() {
        if (selectedItems.length > 0) {
            showConfirmModal(
                `Apakah Anda yakin ingin menghapus ${selectedItems.length} item terpilih?`,
                function() {
                    console.log('Deleting items:', selectedItems);
                    // In a real app, this would be an AJAX call
                    alert(`${selectedItems.length} item berhasil dihapus`);
                    // Then reload the data
                    loadTableData();
                }
            );
        }
    });
    
    // Individual delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const itemId = row.querySelector('.row-checkbox').dataset.id;
            const itemName = row.cells[2].textContent;
            
            showConfirmModal(
                `Apakah Anda yakin ingin menghapus item "${itemName}"?`,
                function() {
                    console.log('Deleting item:', itemId);
                    // In a real app, this would be an AJAX call
                    alert(`Item "${itemName}" berhasil dihapus`);
                    // Then reload the data
                    loadTableData();
                }
            );
        });
    });
    
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const itemId = row.querySelector('.row-checkbox').dataset.id;
            console.log('Editing item:', itemId);
            // In a real app, this would open an edit form/modal
            alert(`Membuka form edit untuk item ${itemId}`);
        });
    });
    
    // Pagination controls
    document.querySelectorAll('.pagination-btn:not(#prev-page):not(#next-page)').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                document.querySelector('.pagination-btn.active').classList.remove('active');
                this.classList.add('active');
                currentPage = parseInt(this.textContent);
                loadTableData();
            }
        });
    });
    
    document.getElementById('next-page').addEventListener('click', function() {
        if (!this.disabled) {
            currentPage++;
            updatePagination();
            loadTableData();
        }
    });
    
    document.getElementById('prev-page').addEventListener('click', function() {
        if (!this.disabled) {
            currentPage--;
            updatePagination();
            loadTableData();
        }
    });
    
    function updatePagination() {
        const totalPages = 2; // In a real app, this would come from the server
        const pageButtons = document.querySelectorAll('.pagination-btn:not(#prev-page):not(#next-page)');
        
        // Update active state
        pageButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === currentPage) {
                btn.classList.add('active');
            }
        });
        
        // Update button states
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = currentPage === totalPages;
    }
    
    // Modal functions
    function showConfirmModal(message, confirmCallback) {
        confirmMessage.textContent = message;
        confirmModal.style.display = 'flex';
        
        // Store the callback
        btnConfirm.onclick = function() {
            confirmCallback();
            confirmModal.style.display = 'none';
        };
    }
    
    modalClose.addEventListener('click', function() {
        confirmModal.style.display = 'none';
    });
    
    btnCancel.addEventListener('click', function() {
        confirmModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });
    
    // Load table data (simulated)
    function loadTableData() {
        console.log('Loading data for page', currentPage);
        // In a real app, this would be an AJAX call to get paginated data
        // For demo, we'll just reset selections
        selectAllCheckbox.checked = false;
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
            updateRowSelection(checkbox);
        });
        updateSelectionSummary();
    }
    
    // Initialize
    initDatePickers();
    loadTableData();

    // Sidebar toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', function () {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
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
});