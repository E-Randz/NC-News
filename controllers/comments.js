const connection = require('../db/connection');

exports.sendAllComments = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', order = 'desc', p = 1,
  } = req.query;
  const { article_id } = req.params;
  const offset = (p - 1) * limit;
  connection('comments')
    .select('comments.username as author', 'comments.body', 'comments.votes', 'comments.created_at', 'comments.comment_id')
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
      return res.status(201).send({ comment });
    })
    .catch(next);
};

exports.updateCommentVotes = (req, res, next) => {
  const { comment_id, article_id } = req.params;
  let { inc_votes } = req.body;
  if (!inc_votes) inc_votes = 0;
  if (/[^\-0-9]+/.test(inc_votes)) next({ status: 400, detail: 'vote increment/ decrement should be a number' });
  connection('comments')
    .where('comments.comment_id', '=', comment_id)
    .andWhere('comments.article_id', '=', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([comment]) => {
      if (!comment) return Promise.reject({ status: 404, message: 'comment could not be found' });
      return res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id, article_id } = req.params;
  connection('comments')
    .where('comment_id', comment_id)
    .andWhere('comments.article_id', '=', article_id)
    .del()
    .returning('*')
    .then(([comment]) => {
      if (!comment) return Promise.reject({ status: 404, message: 'Cannot delete. Article or Comment ID does not exist' });
      return res.status(204).send();
    })
    .catch(next);
};
