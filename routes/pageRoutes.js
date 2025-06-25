import express from 'express';
import {
  showHome,
  showNotFound
} from '../controllers/pageController.js';

import isAuthenticated  from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', isAuthenticated, showHome);

// fallback jika halaman tidak ditemukan
router.use(showNotFound);

export default router;
