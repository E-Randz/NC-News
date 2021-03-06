const connection = require('../db/connection');

exports.sendAllArticles = (req, res, next) => {
  const { limit = 10, p = 1 } = req.query;
  let { sort_by = 'created_at', order = 'desc' } = req.query;
  const checkSort = ['article_id', 'title', 'votes', 'topic', 'author', 'created_at'];
  const checkOrder = ['asc', 'desc'];
  if (!checkSort.includes(sort_by)) sort_by = 'created_at';
  if (!checkOrder.includes(order)) order = 'desc';
  if (!/[0-9]+/.test(limit) || !/-*[0-9]/.test(p)) return next({ status: 400, message: 'invalid limit or page number' });
  const offset = (p - 1) * limit;
  let article_count;
  return connection('articles')
    .count('articles.article_id as count')
    .then(([{ count }]) => {
      article_count = +count;
      return connection('articles')
        .select('articles.username as author', 'title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'topic')
        .leftJoin('comments', 'comments.article_id', 'articles.article_id')
        .count('comments.comment_id as comment_count')
        .groupBy('articles.article_id')
        .limit(limit)
        .offset(offset)
        .orderBy(sort_by, order);
    })
    .then((articles) => {
      res.status(200).send({ articles, article_count });
    })
    .catch(next);
};

exports.sendOneArticle = (req, res, next) => {
  const { article_id } = req.params;
  connection('articles')
    .select('articles.username as author', 'title', 'articles.article_id', 'articles.body', 'articles.votes', 'articles.created_at', 'topic')
    .where('articles.article_id', '=', article_id)
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id')
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404, message: 'article could not be found' });
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateVotes = (req, res, next) => {
  const { article_id } = req.params;
  let { inc_votes } = req.body;
  if (!inc_votes) inc_votes = 0;
  if (/[^\-0-9]+/.test(inc_votes)) return next({ status: 400, detail: 'vote increment/ decrement should be a number' });
  return connection('articles')
    .where('articles.article_id', '=', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404, message: 'article could not be found' });
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  connection('articles')
    .where('article_id', article_id)
    .del()
    .returning('*')
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404, message: 'Cannot delete. Article ID does not exist' });
      return res.status(204).send();
    })
    .catch(next);
};
