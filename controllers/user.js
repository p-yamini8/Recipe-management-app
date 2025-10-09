
const User = require('../models/user');
const Follow = require('../models/follow');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
require('dotenv').config();

// ✅ Signup — first registered user becomes admin
exports.signup = async (req, res) => {
  try {
    const { name, email, number, password } = req.body;

    if (!name || !email || !password || !number) {
      return res.status(400).json({ message: 'Enter all details' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Check if this is the first user in the system
    const userCount = await User.count();
    const isAdmin = userCount === 0; // first user → admin

    const user = await User.create({
      name,
      email,
      number,
      password: hashedPassword,
      isAdmin,
    });

    return res.status(201).json({
      message: isAdmin
        ? 'User signup success — You are the first user and have been made admin'
        : 'User signup success',
    });
  } catch (err) {
    console.log('Signup error:', err);
    return res.status(500).json({ message: 'Error during signup' });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const user = await User.findOne({ where: { email } });
// if (user.banned) {
//   return res.status(403).json({ message: "Your account has been banned." });
// }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET
    );

    res.json({
      message: 'Login success',
      token,
      name: user.name,
      id: user.id,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get All Users with Follow Status
exports.getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
    });

    const following = await Follow.findAll({
      where: { followerId: currentUserId },
    });

    const followingIds = following.map((f) => f.followingId);

    const result = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isFollowing: followingIds.includes(u.id),
    }));

    res.json(result);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};