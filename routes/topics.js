const topicsRouter = require('express').Router();
const {
  sendTopics, addTopic, sendArticlesByTopic, addNewArticle,
} = require('../controllers/topics');
const { handle405 } = require('../errors');


topicsRouter.route('/')
  .get(sendTopics)
  .post(addTopic)
  .all(handle405);

topicsRouter.route('/:topic/articles')
  .get(sendArticlesByTopic)
  .post(addNewArticle)
  .all(handle405);

module.exports = topicsRouter;
