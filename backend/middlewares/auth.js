const jwt = require('jsonwebtoken');
const AuthError = require('../utils/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new AuthError('Неправильные почта или пароль'));
  }
  const token = authorization.replace(bearer, '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'strong_password');
    req.user = payload;
  } catch (err) {
    return next(new AuthError('Неправильные почта или пароль'));
  }

  return next();
};

module.exports = auth;

/*
const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'strong_password');
  } catch (err) {
    next(new AuthError('Неверный логин или пароль'));
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
};

module.exports = { auth };
*/
