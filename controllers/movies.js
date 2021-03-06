const {
  NotFoundErr,
  BadRequestErr,
  ForbiddenErr,
} = require('../errors');

const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundErr('Фильм не найден');
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenErr('Вы не можете удалять фильмы других пользователей');
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .then((deletedMovie) => res.send(deletedMovie));
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    id,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    id,
    owner,
  })
    .then((movie) => res.send({
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      country: movie.country,
      director: movie.director,
      description: movie.description,
      year: movie.year,
      duration: movie.duration,
      _id: movie._id,
      image: movie.image.url,
      createdAt: movie.createdAt,
      owner: movie.owner,
      trailerLink: movie.trailerLink,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      next(err);
    });
};
