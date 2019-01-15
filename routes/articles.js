const articlesRouter = require('express')();
const { sendAllArticles, sendOneArticle } = require('../controllers/articles');

articlesRouter.route('/')
  .get(sendAllArticles);

articlesRouter.route('/:article_id')
  .get(sendOneArticle);

module.exports = articlesRouter;
