import express from 'express';
import isAuthenticated from '../middleware/authMiddleware.js';
import inventoryController from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/inventory', isAuthenticated, inventoryController.showInventoryPage);
router.get('/:kode_barang', inventoryController.getDetailInventori);
router.post('/create', inventoryController.createInventori);
router.put('/update/:kode_barang', inventoryController.updateInventori);
router.delete('/delete/:kode_barang', inventoryController.deleteInventori);
router.post('/delete-multiple', inventoryController.deleteMultipleInventori);
router.post('/export', inventoryController.exportInventori);

export default router;