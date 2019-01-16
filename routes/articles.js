const articlesRouter = require('express')();
const {
  sendAllArticles, sendOneArticle, updateVotes, deleteArticle,
} = require('../controllers/articles');
const {
  sendAllComments, addNewComment, updateCommentVotes, deleteComment,
} = require('../controllers/comments');
const { handle405 } = require('../errors');

articlesRouter.route('/')
  .get(sendAllArticles)
  .all(handle405);

articlesRouter.route('/:article_id')
  .get(sendOneArticle)
  .patch(updateVotes)
  .delete(deleteArticle)
  .all(handle405);

articlesRouter.route('/:article_id/comments')
  .get(sendAllComments)
  .post(addNewComment)
  .all(handle405);

articlesRouter.route('/:article_id/comments/:comment_id')
  .patch(updateCommentVotes)
  .delete(deleteComment)
  .all(handle405);


module.exports = articlesRouter;
