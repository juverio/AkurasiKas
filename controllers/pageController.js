export const showHome = (req, res) => {
  // if (!req.session.user) return res.redirect('/auth/login');
  res.render('dashboard', { user: req.session.user });
};

export const showNotFound = (req, res) => {
  res.status(404).render('404');
};

export const showLanding = (req, res) => {
  res.render('index', { title: 'Selamat Datang' });
};