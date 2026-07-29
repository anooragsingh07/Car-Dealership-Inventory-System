const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser({ email, passwordHash, role: 'user' });

  return res.status(201).json({ id: user.id, email: user.email, role: user.role });
}

module.exports = { register };
