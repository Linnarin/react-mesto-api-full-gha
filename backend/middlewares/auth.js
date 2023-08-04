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
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
  } catch (err) {
    return next(new AuthError('Неправильные почта или пароль'));
  }

  return next();
};

module.exports = { auth };
