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

function validateUpdateInput(body) {
  const errors = [];
  if (body.price !== undefined && Number(body.price) < 0) errors.push('price must be non-negative');
  if (body.quantity !== undefined && Number(body.quantity) < 0) errors.push('quantity must be non-negative');
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

async function listVehicles(req, res) {
  const vehicles = await vehicleRepository.findAll();
  return res.status(200).json(vehicles);
}

async function searchVehicles(req, res) {
  const { make, model, category, minPrice, maxPrice } = req.query;
  const vehicles = await vehicleRepository.search({ make, model, category, minPrice, maxPrice });
  return res.status(200).json(vehicles);
}

async function updateVehicle(req, res) {
  const errors = validateUpdateInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  const vehicle = await vehicleRepository.update(req.params.id, req.body);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  return res.status(200).json(vehicle);
}

async function deleteVehicle(req, res) {
  const vehicle = await vehicleRepository.remove(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  return res.status(200).json({ message: 'Vehicle deleted' });
}

async function purchaseVehicle(req, res) {
  const vehicle = await vehicleRepository.purchase(req.params.id);

  if (!vehicle) {
    const exists = await vehicleRepository.findById(req.params.id);
    if (!exists) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    return res.status(409).json({ error: 'Vehicle is sold out' });
  }

  return res.status(200).json(vehicle);
}

async function restockVehicle(req, res) {
  const { amount } = req.body;

  if (amount === undefined || amount === null || amount === '' || Number(amount) <= 0) {
    return res.status(400).json({ error: 'A positive amount is required' });
  }

  const vehicle = await vehicleRepository.restock(req.params.id, Number(amount));
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  return res.status(200).json(vehicle);
}

module.exports = {
  createVehicle,
  listVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
};
