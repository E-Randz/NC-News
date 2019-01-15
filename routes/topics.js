const topicsRouter = require('express').Router();
const {
  sendTopics, addTopic, sendArticlesByTopic, addNewArticle,
} = require('../controllers/topics');

topicsRouter.route('/')
  .get(sendTopics)
  .post(addTopic);

topicsRouter.route('/:topic/articles')
  .get(sendArticlesByTopic)
  .post(addNewArticle);

module.exports = topicsRouter;
