const usersRouter = require('express').Router();
const { sendAllUsers, sendOneUser } = require('../controllers/users.js');
const { handle405 } = require('../errors');

usersRouter.route('/')
  .get(sendAllUsers)
  .all(handle405);

usersRouter.route('/:username')
  .get(sendOneUser)
  .all(handle405);

module.exports = usersRouter;
