const { Router } = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const vehicleController = require('../controllers/vehicleController');

const router = Router();

router.post('/', requireAuth, vehicleController.createVehicle);

module.exports = router;
