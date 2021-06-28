const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMessage = err.message || 'Произошла ошибка сервера';
  res.status(statusCode).send({ message: errMessage });
  next();
};

module.exports = errorHandler;
