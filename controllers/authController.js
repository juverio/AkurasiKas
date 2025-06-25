import { User } from '../models/index.js';
import bcrypt from 'bcrypt';

// Tampilkan halaman login
export const showLogin = (req, res) => {
  res.render('login', { error: null });
};

// Tampilkan halaman register
export const showRegister = (req, res) => {
  res.render('register', { error: null });
};

// Proses login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Password salah.' });
    }

    req.session.user = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return res.status(200).json({ success: true, message: 'Login berhasil' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// Proses register
export const register = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email sudah digunakan.' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ success: false, message: 'Password tidak cocok.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return res.status(200).json({ success: true, message: 'Registrasi berhasil. Silakan login.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat registrasi.' });
  }
};

// Logout
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
};
