const articlesRouter = require('express')();
const { sendAllArticles, sendOneArticle, updateVotes } = require('../controllers/articles');

articlesRouter.route('/')
  .get(sendAllArticles);

articlesRouter.route('/:article_id')
  .get(sendOneArticle)
  .patch(updateVotes);

module.exports = articlesRouter;
