const movieRouter = require('express').Router();
const {
  getMovies, deleteMovieById, createMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);

movieRouter.delete('/movieId', deleteMovieById);

movieRouter.post('/', createMovie);

module.exports = movieRouter;
