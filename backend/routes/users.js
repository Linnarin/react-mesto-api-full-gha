const express = require('express');

const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const validation = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUserById);
router.get('/:id', validation.validateUserId, getUserById);
router.patch('/me', validation.validateUpdateUser, updateUser);
router.patch('/me/avatar', validation.validateUserAvatar, updateAvatar);

module.exports = router;
