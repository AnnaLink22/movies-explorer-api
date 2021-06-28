require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  NotFoundErr,
  ConflictErr,
  BadRequestErr,
} = require('../errors');
const User = require('../models/user');

module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundErr('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.send({
      name: user.name, _id: user._id, email: user.email,
    }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!password) {
    throw new BadRequestErr('Поле "password" должно быть заполнено');
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => res.send({
          name: user.name, email: user.email, _id: user._id,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestErr(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
          }
          if (err.name === 'MongoError' && err.code === 11000) {
            next(new ConflictErr('Пользователь с таким email уже существует'));
          }
          next(err);
        });
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send({
          name: user.name, email: user.email, _id: req.user._id,
        });
      }
      throw new NotFoundErr('Запрашиваемый пользователь не найден');
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
