const articlesRouter = require('express')();
const {
  sendAllArticles, sendOneArticle, updateVotes, deleteArticle,
} = require('../controllers/articles');
const { sendAllComments } = require('../controllers/comments');

articlesRouter.route('/')
  .get(sendAllArticles);

articlesRouter.route('/:article_id')
  .get(sendOneArticle)
  .patch(updateVotes)
  .delete(deleteArticle);

articlesRouter.route('/:article_id/comments')
  .get(sendAllComments);


module.exports = articlesRouter;