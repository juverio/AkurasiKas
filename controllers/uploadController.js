import { User } from '../models/index.js';
import fs from 'fs';
import path from 'path';

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah' });
    }

    // Path publik yang bisa diakses browser
    const photoUrl = `/uploads/${req.file.filename}`;

    // Simpan ke session user
    req.session.user.photo = photoUrl;

    // Jika ingin simpan ke database juga:
    await User.update({ photo: photoUrl }, { where: { email: req.session.user.email } });

    res.json({ success: true, photoUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat upload' });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const user = req.session.user;

    if (!user || !user.photo) {
      return res.status(400).json({ success: false, message: 'Tidak ada foto untuk dihapus.' });
    }

    // Ambil nama file dari URL
    const filename = path.basename(user.photo); // misal /uploads/abc.jpg → abc.jpg
    const filePath = path.join('public', 'uploads', filename);

    // Hapus file dari sistem
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Gagal menghapus file:', err);
        return res.status(500).json({ success: false, message: 'Gagal menghapus file di server.' });
      }

      // Kosongkan foto di session
      req.session.user.photo = null;

      // Jika kamu simpan ke database:
      await User.update({ photo: null }, { where: { user_id: user.user_id } });

      return res.json({ success: true, message: 'Foto berhasil dihapus.' });
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus foto.' });
  }
};