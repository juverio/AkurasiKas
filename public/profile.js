document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tab');
    const profileForm = document.querySelector('.profile-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const tabName = this.textContent.trim();
            console.log('Selected tab:', tabName);
            if (tabName === 'Profil') {
                profileForm.style.display = 'block';
            } else {
                profileForm.style.display = 'none';
                showToast(`Tab ${tabName} dipilih`, 'info');
            }
        });
    });

    const uploadButton = document.querySelectorAll('.btn-outline')[0];
    const deleteButton = document.querySelectorAll('.btn-outline')[1];
    const profileImage = document.querySelector('.profile-image');

    // === Unggah Foto ===
    if (uploadButton && uploadButton.textContent.includes('Unggah Foto')) {
        uploadButton.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.click();

            fileInput.addEventListener('change', () => {
                const file = fileInput.files?.[0];
                if (!file) return showToast('Tidak ada file yang dipilih', 'warning');

                const formData = new FormData();
                formData.append('photo', file);

                fetch('/profile/upload', {
                    method: 'POST',
                    body: formData
                })
                    .then(res => {
                        if (!res.ok) throw new Error('Gagal mengunggah');
                        return res.json();
                    })
                    .then(data => {
                        if (data.success && data.photoUrl) {
                            profileImage.src = data.photoUrl;
                            showToast('Foto berhasil diunggah!', 'success');
                        } else {
                            showToast(data.message || 'Upload gagal', 'error');
                        }
                    })
                    .catch(err => {
                        console.error('Upload error:', err);
                        showToast('Terjadi kesalahan saat upload', 'error');
                    });
            });
        });
    }

    // === Hapus Foto ===
    if (deleteButton && deleteButton.textContent.includes('Hapus Foto')) {
        deleteButton.addEventListener('click', () => {
            fetch('/profile/delete-photo', {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        profileImage.src = '/assets/profile-user.png'; // default image
                        showToast('Foto berhasil dihapus!', 'success');
                    } else {
                        showToast(data.message || 'Gagal menghapus foto', 'error');
                    }
                })
                .catch(err => {
                    console.error('Delete error:', err);
                    showToast('Terjadi kesalahan saat menghapus foto', 'error');
                });
        });
    }

    // Form submission
    const saveButton = document.querySelector('.btn-primary');
    const form = document.querySelector('.profile-form');

    if (saveButton && form) {
        saveButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Ambil nilai dari input name dan email
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();

            // Validasi data input
            if (!name || !email) {
                showToast('Nama dan email wajib diisi!', 'error');
                return;
            }

            // Kirim data ke backend
            fetch('/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        showToast('Profil berhasil disimpan!', 'success');
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        showToast(data.message || 'Gagal menyimpan profil', 'error');
                        setTimeout(() => location.reload(), 1500);
                    }
                })
                .catch(error => {
                    console.error('Profile update error:', error);
                    showToast('Terjadi kesalahan saat menyimpan profil', 'error');
                });
        });
    }


    // Toggle device selection
    const deviceCheckboxes = document.querySelectorAll('.device-check input[type="checkbox"]');

    deviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const deviceName = this.closest('.device-info').querySelector('.device-name').textContent.trim();
            console.log(`Device ${deviceName} ${this.checked ? 'selected' : 'deselected'}`);
        });
    });

    // Helper function to show toast notifications
    function showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add toast to the document
        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';

            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Add slideOut animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Tab functionality - modified to handle Team tab
    const tabs1 = document.querySelectorAll('.tab');
    const profileForm1 = document.querySelector('.profile-form');
    const profileContent = document.querySelector('.profile-content');

    // Create team section container (initially hidden)
    const teamSection = document.createElement('div');
    teamSection.className = 'team-section';
    teamSection.style.display = 'none';
    profileContent.appendChild(teamSection);

    tabs1.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active class from all tabs
            tabs1.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Get the tab name
            const tabName = this.textContent.trim();

            // Show/hide content based on selected tab
            if (tabName === 'Profil') {
                profileForm1.style.display = 'block';
                teamSection.style.display = 'none';
            } else if (tabName === 'Team') {
                profileForm1.style.display = 'none';
                teamSection.style.display = 'block';
                renderTeamContent();
            } else if (tabName === 'Sandi') {
                profileForm1.style.display = 'none';
                teamSection.style.display = 'none';
                showToast('Tab Sandi dipilih', 'info');
            }
        });
    });

    // Function to render team content
    function renderTeamContent() {
        teamSection.innerHTML = `
            <div class="team-header">
                <h2>Pilih Akun Team</h2>
                <div class="team-select">
                    <select class="team-dropdown">
                        <option value="">-- Pilih Akun --</option>
                        <option value="Jean" selected>Aim 1 - Jean</option>
                        <option value="John">Aim 2 - John</option>
                        <option value="Jane">Aim 3 - Jane</option>
                    </select>
                </div>
            </div>
    
            <div class="account-section">
                <h3>Username</h3>
                <div class="account-details">
                    <div class="account-field">
                        <label>Username</label>
                        <input type="text" value="Jeanadm1" class="account-input">
                    </div>
                    <div class="account-field">
                        <label>Kata Sandi</label>
                        <input type="text" value="Secret123!" class="account-input">
                    </div>
                </div>
                <p class="account-note">Kamu dapat mengubah nama pengguna dan kata sandi untuk akun karyawan.</p>
            </div>
    
            <div class="task-section">
                <h3>Pilih Tugas yang akan diberikan!</h3>
                <p>Kamu dapat mengubahnya dengan me-klik toggle dibawah menjadi on/off</p>
                
                <div class="task-list">
                    <div class="task-item">
                        <label>Melihat Dashboard</label>
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="task-item">
                        <label>Melihat Transaksi</label>
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="task-item">
                        <label>Melihat Inventori</label>
                        <label class="switch">
                            <input type="checkbox">
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="task-item">
                        <label>Melihat Laporan</label>
                        <label class="switch">
                            <input type="checkbox">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
    
            <div class="team-actions">
                <button class="btn btn-outline">Simpan Perubahan</button>
                <button class="btn btn-primary">Tambah Anggota Team</button>
            </div>
        `;

        // Add additional CSS for the new elements
        const style = document.createElement('style');
        style.textContent = `
            /* Team Dropdown Styles */
            .team-select {
                margin: 10px 0 20px;
            }
    
            .team-dropdown {
                width: 100%;
                padding: 10px;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                font-size: 0.95rem;
                background-color: white;
                cursor: pointer;
            }
    
            .team-dropdown:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
            }
    
            /* Account Input Styles */
            .account-input {
                width: 100%;
                padding: 10px;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                font-size: 0.95rem;
            }
    
            .account-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
            }
    
            /* Rest of the existing team styles remain the same */
            .team-section {
                width: 100%;
                padding: 20px;
            }
    
            .team-header h2 {
                font-size: 1.5rem;
                color:rgb(28, 28, 30);
                margin-bottom: 5px;
            }
    
            .account-section, .task-section {
                background-color: #fff;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
    
            .account-section h3, .task-section h3 {
                font-size: 1.2rem;
                color:rgb(34, 34, 35);
                margin-bottom: 10px;
            }
    
            .account-details {
                display: flex;
                gap: 20px;
                margin-bottom: 15px;
            }
    
            .account-field {
                flex: 1;
            }
    
            .account-field label {
                display: block;
                font-weight: 600;
                margin-bottom: 5px;
                color: #333;
            }
    
            .account-note {
                color: #6b7280;
                font-size: 0.9rem;
            }
    
            .task-list {
                margin-top: 15px;
            }
    
            .task-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #e5e7eb;
            }
    
            .task-item:last-child {
                border-bottom: none;
            }
    
            /* Switch styles */
            .switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
    
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
    
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
            }
    
            .slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
            }
    
            input:checked + .slider {
                background-color: #3b82f6;
            }
    
            input:checked + .slider:before {
                transform: translateX(26px);
            }
    
            .slider.round {
                border-radius: 24px;
            }
    
            .slider.round:before {
                border-radius: 50%;
            }
    
            .team-actions {
                display: flex;
                gap: 15px;
                margin-top: 20px;
                justify-content: flex-end;
            }
    
            @media (max-width: 768px) {
                .account-details {
                    flex-direction: column;
                    gap: 10px;
                }
    
                .team-actions {
                    flex-direction: column;
                }
    
                .team-actions .btn {
                    width: 100%;
                }
            }
        `;

        // Add the styles to the document head
        document.head.appendChild(style);

        // Add event listener for dropdown change
        const teamDropdown = teamSection.querySelector('.team-dropdown');
        if (teamDropdown) {
            teamDropdown.addEventListener('change', function () {
                const selectedTeam = this.value;
                if (selectedTeam) {
                    showToast(`Team ${selectedTeam} dipilih`, 'info');
                    // In a real app, you would load the team's data here
                }
            });
        }

        // Rest of the existing event listeners remain the same
        const toggles = teamSection.querySelectorAll('.switch input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', function () {
                const taskName = this.closest('.task-item').querySelector('label').textContent;
                console.log(`Task ${taskName} is now ${this.checked ? 'enabled' : 'disabled'}`);
            });
        });

        const saveBtn = teamSection.querySelector('.btn-outline');
        if (saveBtn) {
            saveBtn.addEventListener('click', function () {
                // Get the updated values
                const username = teamSection.querySelector('.account-input[type="text"]').value;
                const password = teamSection.querySelector('.account-input[type="password"]').value;

                console.log('Saved changes:', { username, password });
                showToast('Perubahan berhasil disimpan!', 'success');
            });
        }

        const addBtn = teamSection.querySelector('.btn-primary');
        if (addBtn) {
            addBtn.addEventListener('click', function () {
                showToast('Fitur tambah anggota team akan segera tersedia!', 'info');
            });
        }
    }
    teamSection.className = 'team-section';
    teamSection.style.display = 'none';
    profileContent.appendChild(teamSection);

    // Create password section container (initially hidden)
    const passwordSection = document.createElement('div');
    passwordSection.className = 'password-section';
    passwordSection.style.display = 'none';
    profileContent.appendChild(passwordSection);

    tabs1.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active class from all tabs
            tabs1.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Get the tab name
            const tabName = this.textContent.trim();

            // Show/hide content based on selected tab
            if (tabName === 'Profil') {
                profileForm1.style.display = 'block';
                teamSection.style.display = 'none';
                passwordSection.style.display = 'none';
            } else if (tabName === 'Team') {
                profileForm1.style.display = 'none';
                teamSection.style.display = 'block';
                passwordSection.style.display = 'none';
                renderTeamContent();
            } else if (tabName === 'Sandi') {
                profileForm1.style.display = 'none';
                teamSection.style.display = 'none';
                passwordSection.style.display = 'block';
                renderPasswordContent();
            }
        });
    });

    function renderPasswordContent() {
        passwordSection.innerHTML = `
            <div class="password-form">
                <h2>Ubah Kata Sandi</h2>
                <p class="password-note">Untuk keamanan akun Anda, harap jangan bagikan kata sandi Anda kepada orang lain.</p>
                
                <div class="form-group">
                    <label for="currentPassword">Kata Sandi Saat Ini</label>
                    <div class="password-input-container">
                        <input type="password" id="currentPassword" placeholder="Masukkan kata sandi saat ini">
                        <span class="toggle-password">
                            <i class="far fa-eye"></i>
                        </span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="newPassword">Kata Sandi Baru</label>
                    <div class="password-input-container">
                        <input type="password" id="newPassword" placeholder="Masukkan kata sandi baru">
                        <span class="toggle-password">
                            <i class="far fa-eye"></i>
                        </span>
                    </div>
                    <div class="password-strength">
                        <p class="strength-text">Kekuatan kata sandi: <span id="strengthValue">-</span></p>
                        <ul class="password-requirements">
                            <li class="requirement" data-requirement="length">Minimal 8 karakter</li>
                            <li class="requirement" data-requirement="uppercase">Mengandung huruf besar</li>
                            <li class="requirement" data-requirement="number">Mengandung angka</li>
                            <li class="requirement" data-requirement="special">Mengandung karakter khusus</li>
                        </ul>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">Konfirmasi Kata Sandi Baru</label>
                    <div class="password-input-container">
                        <input type="password" id="confirmPassword" placeholder="Konfirmasi kata sandi baru">
                        <span class="toggle-password">
                            <i class="far fa-eye"></i>
                        </span>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-primary" id="savePassword">Simpan Perubahan</button>
                </div>
            </div>
        `;

        // CSS for left-aligned content with eye icon inside input
        const style = document.createElement('style');
        style.textContent = `
            .password-section {
                width: 100%;
                padding: 20px;
            }
            
            .password-form {
                width: 100%;
                text-align: left;
            }
            
            .password-form h2 {
                font-size: 2.0rem;
                color: #1c1c1e;
                margin-bottom: 10px;
                text-align: left;
            }
            
            .password-note {
                color: #6b7280;
                margin-bottom: 20px;
                text-align: left;
                font-size: 1.0rem;
            }
            
            .form-group {
                margin-bottom: 20px;
                text-align: left;
                width: 100%;
            }
            
            .form-group label {
                display: block;
                font-weight: 600;
                margin-bottom: 8px;
                color: #333;
                text-align: left;
                font-size: 1.5rem;
            }
            
            .password-input-container {
                position: relative;
                width: 100%;
                max-width: 1000px;
            }
            
            .password-input-container input {
                width: 100%;
                padding: 10px 35px 10px 10px;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                font-size: 0.95rem;
            }
            
            .password-input-container input:focus {
                outline: none;
                border-color: #3b82f6;
            }
            
            .toggle-password {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                color: #6b7280;
            }
            
            .password-strength {
                margin-top: 10px;
                text-align: left;
                width: 100%;
                max-width: 400px;
            }
            
            .strength-text {
                font-size: 0.8rem;
                color: #6b7280;
                margin: 5px 0;
                text-align: left;
                font-size: 1.0rem;
            }
            
            .password-requirements {
                margin: 5px 0 0 0;
                padding-left: 20px;
                color: #6b7280;
                font-size: 1.0rem;
                text-align: left;
                width: 100%;
            }
            
            .password-requirements li {
                margin-bottom: 3px;
                text-align: left;
            }
            
            .password-requirements li.fulfilled {
                color: #10b981;
            }
            
            .form-actions {
                display: flex;
                justify-content: flex-end;
                margin-top: 20px;
                width: 100%;
            }
            
            @media (max-width: 768px) {
                .password-input-container {
                    max-width: 100%;
                }
                
                .password-strength {
                    max-width: 100%;
                }
            }
        `;
        document.head.appendChild(style);

        // Toggle password visibility
        const togglePasswordButtons = passwordSection.querySelectorAll('.toggle-password');
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function () {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });

        // Rest of the code remains the same...
        const newPasswordInput = passwordSection.querySelector('#newPassword');
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', function () {
                checkPasswordStrength(this.value);
            });
        }

        const savePasswordBtn = passwordSection.querySelector('#savePassword');
        if (savePasswordBtn) {
            savePasswordBtn.addEventListener('click', function (e) {
                e.preventDefault();

                const currentPassword = document.getElementById('currentPassword').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (!currentPassword || !newPassword || !confirmPassword) {
                    showToast('Harap isi semua bidang!', 'error');
                    return;
                }

                if (newPassword !== confirmPassword) {
                    showToast('Kata sandi baru dan konfirmasi tidak cocok!', 'error');
                    return;
                }

                const strength = checkPasswordStrength(newPassword, true);
                if (strength !== 'strong') {
                    showToast('Kata sandi belum memenuhi semua kriteria!', 'error');
                    return;
                }

                fetch('/profile/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ currentPassword, newPassword })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            showToast('Kata sandi berhasil diubah!', 'success');
                            document.getElementById('currentPassword').value = '';
                            document.getElementById('newPassword').value = '';
                            document.getElementById('confirmPassword').value = '';
                            checkPasswordStrength('');
                            setTimeout(() => location.reload(), 1500);
                        } else {
                            showToast(data.message || 'Gagal mengubah kata sandi', 'error');
                            setTimeout(() => location.reload(), 1500);
                        }
                    })
                    .catch(err => {
                        console.error('Password update error:', err);
                        showToast('Terjadi kesalahan saat mengubah kata sandi', 'error');
                        setTimeout(() => location.reload(), 1500);
                    });

                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
                checkPasswordStrength('');
            });
        }
    }

    function checkPasswordStrength(password, updateUI = true) {
        const lengthRequirement = password.length >= 8;
        const uppercaseRequirement = /[A-Z]/.test(password);
        const numberRequirement = /[0-9]/.test(password);
        const specialRequirement = /[^A-Za-z0-9]/.test(password); // karakter selain huruf & angka

        const total = [lengthRequirement, uppercaseRequirement, numberRequirement, specialRequirement].filter(Boolean).length;

        if (updateUI) {
            const strengthText = document.getElementById('strengthValue');
            const requirements = document.querySelectorAll('.password-requirements .requirement');

            requirements.forEach(req => {
                const key = req.dataset.requirement;
                const fulfilled =
                    (key === 'length' && lengthRequirement) ||
                    (key === 'uppercase' && uppercaseRequirement) ||
                    (key === 'number' && numberRequirement) ||
                    (key === 'special' && specialRequirement);

                req.classList.toggle('fulfilled', fulfilled);
            });

            // Reset strength jika input kosong
            if (strengthText) {
                if (password === '') {
                    strengthText.textContent = '-';
                    strengthText.style.color = '#6b7280';
                } else {
                    let label = '-';
                    let color = '#6b7280';
                    if (total <= 1) { label = 'Lemah'; color = '#f87171'; }
                    else if (total === 2) { label = 'Cukup'; color = '#facc15'; }
                    else if (total === 3) { label = 'Baik'; color = '#60a5fa'; }
                    else if (total === 4) { label = 'Kuat'; color = '#10b981'; }

                    strengthText.textContent = label;
                    strengthText.style.color = color;
                }
            }
        }

        return total === 4 ? 'strong' : 'weak';
    }

});