import { User } from '../models/index.js';
import bcrypt from 'bcrypt';

export const showProfile = async (req, res) => {
  try {
    const sessionUser = req.session.user;

    if (!sessionUser || !sessionUser.name) {
      return res.redirect('/auth/login');
    }

    // Ambil user dari database berdasarkan nama
    const user = await User.findOne({ where: { name: sessionUser.name } });

    if (!user) {
      return res.status(404).send('User tidak ditemukan');
    }

    res.render('profile', {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat memuat profil');
  }
};

export const updateProfile = async (req, res) => {
  try {
    const sessionUser = req.session.user;
    const { name, email } = req.body;

    if (!sessionUser) {
      return res.status(401).json({ success: false, message: 'Tidak ada sesi aktif' });
    }

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Nama dan email wajib diisi' });
    }

    const updated = await User.update(
      { name, email },
      { where: { name: sessionUser.name } }
    );

    if (updated[0] === 1) {
      // Update session user juga
      req.session.user.name = name;
      req.session.user.email = email;

      return res.json({ success: true, message: 'Profil berhasil diperbarui' });
    } else {
      return res.status(400).json({ success: false, message: 'Profil tidak ditemukan atau tidak berubah' });
    }
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const sessionUser = req.session.user;
    if (!sessionUser) {
      return res.status(401).json({ success: false, message: 'Tidak ada sesi aktif.' });
    }

    const user = await User.findOne({ where: { name: sessionUser.name } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Kata sandi saat ini salah.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { name: sessionUser.name } });

    res.json({ success: true, message: 'Kata sandi berhasil diperbarui.' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengubah kata sandi.' });
  }
};

export const showNotFound = (req, res) => {
  res.status(404).render('404');
};