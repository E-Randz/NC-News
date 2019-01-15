const articlesRouter = require('express')();
const { sendAllArticles } = require('../controllers/articles');

articlesRouter.route('/')
  .get(sendAllArticles);

module.exports = articlesRouter;
