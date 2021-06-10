const validator = require('validator');
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле "image" должно быть валидным url-адресом.',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле "trailer" должно быть валидным url-адресом.',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле "thumbnail" должно быть валидным url-адресом.',
    },
  },
});

module.exports = mongoose.model('movie', movieSchema);
