const connection = require('../db/connection');

exports.sendAllComments = (req, res, next) => {
  const { article_id } = req.params;
  connection('comments')
    .select('comments.username as author', 'comments.article_id', 'comments.body', 'comments.votes', 'comments.created_at')
    .where('comments.article_id', '=', article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
