const express = require('express');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const cors = require('cors');

const userRouter = require('./routes/users');

const movieRouter = require('./routes/movies');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const errorHandler = require('./middlewares/error-handler');

const { NotFoundErr } = require('./errors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  validateCreateUserBody,
  validateLoginBody,
} = require('./middlewares/validation');

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.options('*', cors());

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.post('/signup', validateCreateUserBody, createUser);

app.post('/signin', validateLoginBody, login);

app.use('/users', auth, userRouter);

app.use('/movies', auth, movieRouter);

app.use('*', auth, (req, res, next) => {
  next(new NotFoundErr('Ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
