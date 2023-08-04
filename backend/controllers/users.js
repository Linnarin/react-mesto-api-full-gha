const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const BadRequest = require('../utils/BadRequest');
const NotFound = require('../utils/NotFound');
const UnAuthorized = require('../utils/AuthError');
const Conflict = require('../utils/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })

        .then(() => res.status(200).send({
          name, about, avatar, email,
        }))
        .catch((error) => {
          if (error.code === 11000) {
            next(new Conflict('Пользователь с таким электронным адресом уже зарегистрирован'));
          } else if (error.name === 'ValidationError') {
            next(new BadRequest('Невалидные данные'));
          } else {
            next(error);
          }
        });
    })
    .catch((error) => {
      next((error));
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnAuthorized('Неправильные почта или пароль');
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new UnAuthorized('Неправильные почта или пароль');
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          return res.send({ JWT: token });
        });
    })
    .catch((error) => {
      next(error);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequest('Невалидные данные'));
      }
      return next(error);
    });
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      throw new NotFound('Пользователь с указанным id не найден');
    })
    .catch((error) => {
      next(error);
    });
};

const getUserById = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) throw new NotFound('Пользователь с указанным id не найден');
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Невалидные данные'));
      }
      return next(error);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) throw new NotFound('Пользователь с указанным id не найден');
      res.status(200).send(updatedUser);
    })
    .catch((error) => {
      next(error);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) throw new NotFound('Пользователь с указанным id не найден');
      res.status(200).send(updatedUser);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Невалидные данные'));
      }
      return next(error);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  loginUser,
  getUserInfo,
};

/*
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 10;

const JWT_SECRET = 'strong_password';

const BadRequest = require('../utils/BadRequest');

const ConflictError = require('../utils/ConflictError');

const NotFound = require('../utils/NotFound');

const AuthError = require('../utils/AuthError');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неверный логин или пароль');
      } else {
        return bcrypt
          .compare(password, user.password)
          .then((isValidUser) => {
            if (isValidUser) {
              const token = jwt.sign({ _id: user._id }, JWT_SECRET);
              res.cookie('jwt', token, {
                maxAge: 3600 * 24 * 7,
                httpOnly: true,
              });
              const {
                _id, name, about, avatar,
              } = user;
              res.send({
                _id, name, about, avatar, email,
              });
            } else {
              throw new AuthError('Неверный логин или пароль');
            }
          })
          .catch(next);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { password } = req.body;

  bcrypt.hash(password, SALT_ROUNDS).then((hash) => {
    User.create({
      ...req.body,
      password: hash,
    })
      .then((user) => {
        const {
          _id, name, about, avatar, email,
        } = user;
        res.status(201).send({
          _id, name, about, avatar, email,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(
            new BadRequest(
              'Переданы некорректные данные при создании пользователя',
            ),
          );
        } else if (err.code === 11000) {
          next(
            new ConflictError('Пользователь с таким email уже существует'),
          );
        } else {
          next(err);
        }
      });
  });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.params.id ? req.params.id : req.user._id;

  User.findById(userId)
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequest('Переданы некорректные данные пользователя'),
        );
      } else {
        next(err);
      }
    });
};

const updateUserData = (Name, data, req, res, next) => {
  Name.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  updateUserData(User, { name, about }, req, res, next);
};

const updateUsersAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUserData(User, { avatar }, req, res, next);
};

module.exports = {
  createUser,
  getUsers,
  getCurrentUser,
  updateUser,
  updateUsersAvatar,
  login,
};
*/
