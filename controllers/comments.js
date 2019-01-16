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

exports.addNewComment = (req, res, next) => {
  const newComment = { article_id: req.params.article_id, ...req.body };
  connection('comments')
    .insert(newComment)
    .returning('*')
    .then(([comment]) => {
      // console.log(comment);
      if (!comment) return Promise.reject({ status: 404, message: `unable to post to ${req.params.article_id} check that article id exists` });
      return res.status(201).send(comment);
    })
    .catch(next);
};
