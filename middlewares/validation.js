const { celebrate, Joi } = require('celebrate');

const validator = require('validator');

const validateCreateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateDeleteMovieById = celebrate({
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
});

const validateCreateMovieBody = celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required().min(2).max(100),
    nameEN: Joi.string().required().min(2).max(100),
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(60),
    description: Joi.string().required().min(2),
    year: Joi.string().required().min(2).max(10),
    duration: Joi.number().required(),
    id: Joi.number().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "image" должно быть валидным url-адресом.');
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "trailer" должно быть валидным url-адресом.');
    }),
  }),
});

const validateUpdateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  validateCreateUserBody,
  validateUpdateUserBody,
  validateLoginBody,
  validateDeleteMovieById,
  validateCreateMovieBody,
};
