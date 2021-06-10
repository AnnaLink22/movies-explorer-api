const userRouter = require('express').Router();

const {
  validateUpdateUserBody,
} = require('../middlewares/validation');

const {
  updateUser, getMyUser,
} = require('../controllers/users');

userRouter.get('/me', getMyUser);

userRouter.patch('/me', validateUpdateUserBody, updateUser);

module.exports = userRouter;
