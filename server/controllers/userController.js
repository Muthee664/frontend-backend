const User = require('../models/userModel'); // Assuming you have a User model defined in models/User.js
const bcrypt = require('bcryptjs');

// Helper function for validation
const validateUserInput = (data) => {
  const errors = {};
  if (!data.firstName) errors.firstName = 'First name is required';
  if (!data.lastName) errors.lastName = 'Last name is required';
  if (!data.username) errors.username = 'Username is required';
  if (!data.email) errors.email = 'Email is required';
  if (!data.password) errors.password = 'Password is required';
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

exports.createUser = async (req, res) => {
  const { firstName, lastName, username, email, password, confirmPassword } = req.body;
  const errors = validateUserInput({ firstName, lastName, username, email, password, confirmPassword });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users. Please try again later.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user. Please check the user ID and try again.' });
  }
};

exports.updateUserScore = async (req, res) => {
  const { score } = req.body;
  if (typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid score value. It should be a number.' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { score },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating score. Please try again later.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user. Please try again later.' });
  }
};
