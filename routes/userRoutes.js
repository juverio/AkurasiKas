import express from 'express';
import {
  showProfile,
  showNotFound, updateProfile, changePassword
} from '../controllers/userController.js';
import upload from '../middleware/uploadMiddleware.js';
import { uploadPhoto } from '../controllers/uploadController.js';
import { deletePhoto } from '../controllers/uploadController.js';

import isAuthenticated  from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', isAuthenticated, showProfile);
router.post('/upload', upload.single('photo'), uploadPhoto);
router.delete('/delete-photo', deletePhoto);
router.post('/update', updateProfile);
router.post('/change-password', changePassword);

// fallback jika halaman tidak ditemukan
router.use(showNotFound);

export default router;