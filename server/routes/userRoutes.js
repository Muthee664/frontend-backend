const express = require('express');
const {
  createUser,
  getUsers,
  deleteUser,
  updateUserScore,
  getUserById
} = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// User routes
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/score', updateUserScore);
router.delete('/users/:id', deleteUser);

// Auth routes
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

module.exports = router;
