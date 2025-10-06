const User = require('../model/user');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user_id: user._id });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await User.findOne({
      $or: [
        { username: new RegExp(`^${usernameOrEmail}$`, 'i') },
        { email: new RegExp(`^${usernameOrEmail}$`, 'i') }
      ]
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatched = await user.comparePassword(password);
    if (!isMatched) return res.json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
