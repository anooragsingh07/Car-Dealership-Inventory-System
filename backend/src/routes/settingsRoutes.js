const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const settingsController = require('../controllers/settingsController');

const router = Router();

router.get('/low-stock-threshold', requireAuth, settingsController.getLowStockThreshold);
router.put('/low-stock-threshold', requireAuth, requireAdmin, settingsController.setLowStockThreshold);

module.exports = router;
