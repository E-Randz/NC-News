const usersRouter = require('express').Router();
const { sendAllUsers, sendOneUser, sendUserArticles } = require('../controllers/users.js');
const { handle405 } = require('../errors');

usersRouter.route('/')
  .get(sendAllUsers)
  .all(handle405);

usersRouter.route('/:username')
  .get(sendOneUser)
  .all(handle405);

usersRouter.route('/:username/articles')
  .get(sendUserArticles)
  .all(handle405);

module.exports = usersRouter;
