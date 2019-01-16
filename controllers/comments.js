const connection = require('../db/connection');

exports.sendAllComments = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', order = 'desc', p = 1,
  } = req.query;
  const { article_id } = req.params;
  const offset = (p - 1) * limit;
  connection('comments')
    .select('comments.username as author', 'comments.article_id', 'comments.body', 'comments.votes', 'comments.created_at')
    .where('comments.article_id', '=', article_id)
    .limit(limit)
    .offset(offset)
    .orderBy(sort_by, order)
    .then((comments) => {
      if (!comments.length) return Promise.reject({ status: 404, message: 'Article ID could not be found' });
      return res.status(200).send({ comments });
    })
    .catch(next);
};
