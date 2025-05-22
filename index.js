import express from "express";
import bcrypt from "bcrypt";
import session from "express-session";
import dotenv from "dotenv";
import db from "./database/db.js"; // jika kamu masih pakai koneksi manual
import sequelize from "./models/model.js";
import User from "./models/User.js";

// Load .env
dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET || "secret_key_default", // pastikan di .env ada SESSION_SECRET
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 // 1 jam
  }
}));

// Coba koneksi database
try {
  await sequelize.authenticate();
  console.log("✅ Sequelize connected to MySQL...");
  await sequelize.sync(); // { force: true } kalau perlu drop ulang
  console.log("✅ Database synchronized.");
} catch (error) {
  console.error("❌ Gagal konek DB:", error.message);
  process.exit(1); // hentikan server kalau DB gagal konek
}

// -------------------- Routes --------------------

app.get("/", (req, res) => res.render("index"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/forgot-password", (req, res) => res.render("forgot-password"));
app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login"); // auth check
  res.render("dashboard");
});
app.get("/transaction", (req, res) => res.render("transaction"));
app.get("/profile", (req, res) => res.render("profile"));
app.get("/laporan", (req, res) => res.render("laporan"));
app.get("/faq", (req, res) => res.render("faq"));
app.get("/blog", (req, res) => res.render("blog"));
app.get("/detail-blog", (req, res) => res.render("detailblog"));
app.get("/aboutus", (req, res) => res.render("aboutus"));
app.get("/inventori", (req, res) => res.render("inventori"));

// ----------- Auth: Login ----------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.send("Email tidak ditemukan.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send("Password salah.");

    req.session.user = { id: user.id, email: user.email };
    res.redirect("/dashboard");
  } catch (err) {
    res.send("Gagal login: " + err.message);
  }
});

// ----------- Auth: Register ----------
app.post("/register", async (req, res) => {
  const { email, password, confirm_password } = req.body;
  if (password !== confirm_password) return res.send("Password tidak cocok.");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });
    res.send("Pendaftaran berhasil!");
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.send("Email sudah digunakan.");
    } else {
      res.send("Gagal mendaftar: " + err.message);
    }
  }
});

// ----------- Forgot Password ----------
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  res.send(`Permintaan reset password untuk email: ${email}`);
});

// ---------------- Start Server ----------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
