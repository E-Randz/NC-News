const topicsRouter = require('express').Router();
const { sendTopics, addTopic } = require('../controllers/topics');

topicsRouter.route('/')
  .get(sendTopics)
  .post(addTopic);

module.exports = topicsRouter;
