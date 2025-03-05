import express from "express";

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

// Handling post request
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Lakukan proses autentikasi
    res.send(`Login dengan email: ${email}`);
});

app.post('/register', (req, res) => {
    const { email, password, confirm_password } = req.body;
    // Lakukan proses registrasi
    res.send(`Mendaftar dengan email: ${email}`);
});

app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    // Lakukan proses lupa password
    res.send(`Permintaan reset password untuk email: ${email}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
