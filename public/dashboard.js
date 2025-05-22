document.addEventListener("DOMContentLoaded", function () {
    // Charts initialization
    let debitKreditChart = document.getElementById("debitKreditChart")?.getContext("2d");
    let orderChart = document.getElementById("orderChart")?.getContext("2d");
    let incomeDistributionChart = document.getElementById("incomeDistributionChart")?.getContext("2d");
    
    if (debitKreditChart) {
        new Chart(debitKreditChart, {
            type: "bar",
            data: {
                labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
                datasets: [
                    { label: "Debit", backgroundColor: "#ffcc00", data: [2000, 2500, 1800, 3000, 2800, 3500, 4000] },
                    { label: "Kredit", backgroundColor: "#007bff", data: [1500, 2200, 2000, 2600, 3000, 3200, 3700] }
                ]
            }
        });
    }

    if (orderChart) {
        new Chart(orderChart, {
            type: "bar",
            data: {
                labels: ["Selesai", "Perjalanan", "Pending"],
                datasets: [{
                    label: "Jumlah Pesanan",
                    backgroundColor: ["#007bff", "#ffcc00", "#ff6666"],
                    data: [45, 67, 10]
                }]
            }
        });
    }

    if (incomeDistributionChart) {
        new Chart(incomeDistributionChart, {
            type: "pie",
            data: {
                labels: ["Pemasukan", "Pengeluaran", "Jumlah Stok"],
                datasets: [{
                    backgroundColor: ["#007bff", "#ffcc00", "#ff6666"],
                    data: [60, 25, 15]
                }]
            }
        });
    }

    // Date inputs handling
    const tanggalInputs = document.querySelectorAll('input[type="date"]');
    tanggalInputs.forEach(input => {
        input.addEventListener("focus", function () {
            this.setAttribute("type", "date");
        });

        input.addEventListener("blur", function () {
            if (!this.value) {
                this.setAttribute("type", "text");
                this.setAttribute("placeholder", "dd/mm/yyyy");
            }
        });

        if (!input.value) {
            input.setAttribute("type", "text");
            input.setAttribute("placeholder", "dd/mm/yyyy");
        }
    });

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