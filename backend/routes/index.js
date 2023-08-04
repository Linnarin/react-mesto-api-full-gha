const express = require('express');
const { auth } = require('../middlewares/auth');
const validation = require('../middlewares/validation');
const NotFound = require('../utils/NotFound');

const router = express.Router();

const {
  createUser, loginUser,
} = require('../controllers/users');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/signup', validation.validateCreateAndLoginUser, createUser);
router.use('/signin', validation.validateCreateAndLoginUser, loginUser);

router.use(auth);

router.use('/users', usersRouter);

router.use('/cards', cardsRouter);

router.use('/*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
