const usersRouter = require('express').Router();
const { sendAllUsers } = require('../controllers/users.js');

usersRouter.route('/')
  .get(sendAllUsers);

module.exports = usersRouter;
