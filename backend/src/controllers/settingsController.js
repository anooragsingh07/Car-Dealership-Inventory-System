const settingsRepository = require('../repositories/settingsRepository');

async function getLowStockThreshold(req, res) {
  const threshold = await settingsRepository.getLowStockThreshold();
  return res.status(200).json({ threshold });
}

async function setLowStockThreshold(req, res) {
  const { threshold } = req.body;

  if (threshold === undefined || threshold === null || threshold === '') {
    return res.status(400).json({ error: 'Threshold is required' });
  }

  const value = Number(threshold);
  if (!Number.isInteger(value) || value <= 0) {
    return res.status(400).json({ error: 'Threshold must be a positive integer' });
  }

  const updated = await settingsRepository.setLowStockThreshold(value);
  return res.status(200).json({ threshold: updated });
}

module.exports = { getLowStockThreshold, setLowStockThreshold };
