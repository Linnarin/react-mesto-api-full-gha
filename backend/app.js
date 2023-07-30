const express = require('express');

const cors = require('cors');

const mongoose = require('mongoose');

const app = express();
app.use(cors());

const { errors } = require('celebrate');

const cookieParser = require('cookie-parser');

const router = require('./routes/index');

// const cors = require('./middlewares/cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const error = (err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
};

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use(cookieParser());

app.use(requestLogger);

// app.use(cors);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(error);
app.listen(3000);
