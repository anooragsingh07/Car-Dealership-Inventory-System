const vehicleRepository = require('../repositories/vehicleRepository');

const REQUIRED_FIELDS = ['make', 'model', 'category', 'price', 'quantity'];

function validateVehicleInput(body) {
  const errors = [];
  for (const field of REQUIRED_FIELDS) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      errors.push(`${field} is required`);
    }
  }
  if (errors.length > 0) return errors;

  if (Number(body.price) < 0) errors.push('price must be non-negative');
  if (Number(body.quantity) < 0) errors.push('quantity must be non-negative');

  return errors;
}

async function createVehicle(req, res) {
  const errors = validateVehicleInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  const { make, model, category, price, quantity } = req.body;
  const vehicle = await vehicleRepository.create({ make, model, category, price, quantity });

  return res.status(201).json(vehicle);
}

module.exports = { createVehicle };
