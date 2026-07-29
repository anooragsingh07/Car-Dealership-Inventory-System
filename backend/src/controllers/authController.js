const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

function validateRegisterInput({ email, password }) {
  const errors = [];
  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  return errors;
}

async function register(req, res) {
  const errors = validateRegisterInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  const { email, password } = req.body;

  if (await userRepository.emailExists(email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser({ email, passwordHash, role: 'user' });

  return res.status(201).json({ id: user.id, email: user.email, role: user.role });
}

module.exports = { register };
