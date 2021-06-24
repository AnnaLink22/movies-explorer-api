const movieRouter = require('express').Router();
const {
  getMovies, deleteMovieById, createMovie,
} = require('../controllers/movies');
const { validateDeleteMovieById, validateCreateMovieBody } = require('../middlewares/validation');

movieRouter.get('/', getMovies);

movieRouter.delete('/:movieId', validateDeleteMovieById, deleteMovieById);

movieRouter.post('/', validateCreateMovieBody, createMovie);

module.exports = movieRouter;
