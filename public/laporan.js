// Toggle sidebar on mobile
document.getElementById('menu-toggle').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('sidebar-overlay').classList.toggle('show');
});

document.getElementById('sidebar-overlay').addEventListener('click', function () {
    document.getElementById('sidebar').classList.remove('show');
    document.getElementById('sidebar-overlay').classList.remove('show');
});

// Toggle dropdowns
const dropdownBtns = document.querySelectorAll('.dropdown-btn');

dropdownBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const dropdownId = this.id.replace('-btn', '-content');
        const dropdown = document.getElementById(dropdownId);

        // Close all other dropdowns
        document.querySelectorAll('.dropdown-content').forEach(content => {
            if (content.id !== dropdownId) {
                content.classList.remove('show');
            }
        });

        // Toggle the clicked dropdown
        dropdown.classList.toggle('show');
    });
});

// Handle dropdown item selection
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();

        // Get the dropdown this item belongs to
        const dropdown = this.closest('.dropdown-content');
        const dropdownBtn = document.getElementById(dropdown.id.replace('-content', '-btn'));

        // Remove active class from all siblings
        dropdown.querySelectorAll('.dropdown-item').forEach(sibling => {
            sibling.classList.remove('active');
        });

        // Add active class to clicked item
        this.classList.add('active');

        // Update button text
        dropdownBtn.innerHTML = this.textContent + ' <i class="fas fa-chevron-down"></i>';

        // Hide dropdown
        dropdown.classList.remove('show');
    });
});

// Close dropdowns when clicking outside
window.addEventListener('click', function (e) {
    if (!e.target.matches('.dropdown-btn') && !e.target.matches('.dropdown-content') && !e.target.matches('.dropdown-item')) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
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