import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import sequelize from './models/index.js';

import pageRoutes from './routes/pageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import profileRouter from './routes/userRoutes.js';

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 },
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/user', userRoutes);
app.use('/home', pageRoutes);
app.use('/auth', authRoutes);
app.use('/type', transactionRoutes);
app.use('/inventori', inventoryRoutes);
app.use('/profile', profileRouter);

// DB Connect & Sync
try {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('✅ Connected to DB and synced.');
} catch (err) {
  console.error('❌ DB connection failed:', err.message);
}

app.get("/", (req, res) => {
  res.render("index", { user: req.session.user || "" });
});

// app.get("*", (req, res) => {
//   res.render("404");
// });

app.get("/faq", (req, res) => res.render("faq", { user: req.session.user || "" }));
app.get("/blog", (req, res) => res.render("blog", { user: req.session.user || "" }));
app.get("/detail-blog", (req, res) => res.render("detailblog", { user: req.session.user || "" }));
app.get("/aboutus", (req, res) => res.render("aboutus", { user: req.session.user || "" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ready at http://localhost:${PORT}`));

// import express from "express";
// import bcrypt from "bcrypt";
// import session from "express-session";
// import dotenv from "dotenv";
// import db from "./database/db.js"; // jika kamu masih pakai koneksi manual
// import sequelize from "./models/index.js";
// import models from "./models/User.js";
// const { Pembelian, Penjualan, Transaksi, User, Inventori, DetailPembelian, DetailPenjualan } = models;

// // Load .env
// dotenv.config();

// const app = express();

// app.set("view engine", "ejs");
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static("public"));
// app.use(session({
//   secret: process.env.SESSION_SECRET || "secret_key_default", // pastikan di .env ada SESSION_SECRET
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     maxAge: 1000 * 60 * 60 // 1 jam
//   }
// }));

// // Coba koneksi database
// try {
//   await sequelize.authenticate();
//   console.log("✅ Sequelize connected to MySQL...");
//   await sequelize.sync(); // { force: true } kalau perlu drop ulang
//   console.log("✅ Database synchronized.");
// } catch (error) {
//   console.error("❌ Gagal konek DB:", error.message);
//   process.exit(1); // hentikan server kalau DB gagal konek
// }

// app.use((req, res, next) => {
//   res.locals.user = req.session.user || null;
//   next();
// });

// // -------------------- Routes --------------------

// app.get("/", (req, res) => res.render("index", { user: req.session.user || "" }));
// app.get("/login", (req, res) => res.render("login"));
// app.get("/register", (req, res) => res.render("register"));
// app.get("/forgot-password", (req, res) => res.render("forgot-password"));

// app.get("/dashboard", (req, res) => {
//   if (!req.session.user) return res.redirect("/login"); // auth check
//   res.render("dashboard");
// });

// app.get("/transaction", async (req, res) => {
//   if (!req.session.user) return res.redirect("/login");

//   const selectedType = req.query.type || 'pembelian';
//   const currentPage = parseInt(req.query.page) || 1;
//   const limit = 10;
//   const offset = (currentPage - 1) * limit;

//   try {
//     let transaksi = [];
//     let totalData = 0;

//     if (selectedType === 'pembelian') {
//       transaksi = await Pembelian.findAll({
//         include: [Transaksi, User],
//         limit,
//         offset,
//         order: [['tanggal_pembelian', 'DESC']]
//       });
//       totalData = await Pembelian.count();
//     } else {
//       transaksi = await Penjualan.findAll({
//         include: [Transaksi, User],
//         limit,
//         offset,
//         order: [['tanggal_penjualan', 'DESC']]
//       });
//       totalData = await Penjualan.count();
//     }

//     const totalPages = Math.ceil(totalData / limit);

//     res.render("transaction", {
//       selectedType,
//       transactions: transaksi,
//       currentPage,
//       totalPages,
//       startDate: req.query.startDate || "",
//       endDate: req.query.endDate || "",
//       user: req.session.user
//     });
//   } catch (err) {
//     console.error("❌ Gagal mengambil transaksi:", err.message);
//     res.status(500).send("Terjadi kesalahan saat mengambil data transaksi");
//   }
// });

// app.get("/transaction/pembelian/:id", async (req, res) => {
//   const pembelian_id = req.params.id;

//   try {
//     const pembelian = await Pembelian.findByPk(pembelian_id, {
//       include: [
//         { model: DetailPembelian, include: [Inventori] },
//         { model: Transaksi },
//         { model: User }
//       ]
//     });

//     if (!pembelian) return res.status(404).send("Data pembelian tidak ditemukan.");

//     res.render("detail-pembelian", { pembelian });
//   } catch (err) {
//     console.error("❌ Gagal load detail pembelian:", err.message);
//     res.status(500).send("Terjadi kesalahan.");
//   }
// });

// app.get("/transaction/penjualan/:id", async (req, res) => {
//   const penjualan_id = req.params.id;

//   try {
//     const penjualan = await Penjualan.findByPk(penjualan_id, {
//       include: [
//         { model: DetailPenjualan, include: [Inventori] },
//         { model: Transaksi },
//         { model: User }
//       ]
//     });

//     if (!penjualan) return res.status(404).send("Data penjualan tidak ditemukan.");

//     res.render("detail-penjualan", { penjualan });
//   } catch (err) {
//     console.error("❌ Gagal load detail penjualan:", err.message);
//     res.status(500).send("Terjadi kesalahan.");
//   }
// });

// app.get("/profile", (req, res) => res.render("profile"));
// app.get("/laporan", (req, res) => res.render("laporan"));
// app.get("/faq", (req, res) => res.render("faq"));
// app.get("/blog", (req, res) => res.render("blog"));
// app.get("/detail-blog", (req, res) => res.render("detailblog"));
// app.get("/aboutus", (req, res) => res.render("aboutus"));
// app.get("/inventori", (req, res) => res.render("inventori"));

// // ----------- Auth: Login ----------
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(401).json({ success: false, message: 'Email tidak ditemukan.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch) {
//       req.session.user = { id: user.id, name: user.name, email: user.email };
//       return res.json({ success: true });
//     } else {
//       return res.status(401).json({ success: false, message: 'Password salah.' });
//     }
//   } catch (err) {
//     return res.status(500).json({ success: false, message: 'Gagal login: ' + err.message });
//   }
// });

// // ----------- Auth: Register ----------
// app.post('/register', async (req, res) => {
//   const { name, email, password, confirm_password } = req.body;

//   if (password !== confirm_password) {
//     return res.status(400).json({ success: false, message: "Password tidak cocok." });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.create({
//       name,
//       email,
//       password: hashedPassword
//       // role tidak diisi saat register
//     });

//     res.json({ success: true, message: "Pendaftaran berhasil!" });
//   } catch (err) {
//     if (err.nama === 'SequelizeUniqueConstraintError') {
//       res.status(400).json({ success: false, message: "Email sudah digunakan." });
//     } else {
//       res.status(500).json({ success: false, message: "Gagal mendaftar: " + err.message });
//     }
//   }
// });

// // ----------- Forgot Password ----------
// app.post("/forgot-password", (req, res) => {
//   const { email } = req.body;
//   res.send(`Permintaan reset password untuk email: ${email}`);
// });

// // ---------------- Start Server ----------------

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on port ${PORT}`);
// });