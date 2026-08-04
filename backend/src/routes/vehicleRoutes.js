const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const vehicleController = require('../controllers/vehicleController');

const router = Router();

router.post('/', requireAuth, requireAdmin, vehicleController.createVehicle);
router.get('/', requireAuth, vehicleController.listVehicles);
router.get('/low-stock', requireAuth, vehicleController.lowStockVehicles);
router.get('/search', requireAuth, vehicleController.searchVehicles);
router.get('/:id', requireAuth, vehicleController.getVehicleById);
router.put('/:id', requireAuth, requireAdmin, vehicleController.updateVehicle);
router.delete('/:id', requireAuth, requireAdmin, vehicleController.deleteVehicle);
router.post('/:id/purchase', requireAuth, vehicleController.purchaseVehicle);
router.post('/:id/restock', requireAuth, requireAdmin, vehicleController.restockVehicle);

module.exports = router;
