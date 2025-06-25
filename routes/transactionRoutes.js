import express from 'express';
import transactionController from '../controllers/transactionController.js';
import isAuthenticated from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/transaction', isAuthenticated, transactionController.showTransactionPage);
router.post('/transaction', transactionController.createTransaction);
router.get('/cari-barang', isAuthenticated, transactionController.cariBarangByKode);
router.put('/transaction/status/:id', transactionController.updateStatusPengiriman);
router.delete('/transaction/:id', transactionController.deleteTransaction);
router.get('/transaction/:id/detail', transactionController.getTransactionDetail); // pakai query ?jenis=penjualan atau pembelian
router.put('/transaction/:id', transactionController.updateTransaction);
router.put('/transaction/:id/status', transactionController.updateStatusPengiriman);
router.delete('/transaction/:id', transactionController.deleteTransaction);

export default router;