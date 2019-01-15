const connection = require('../db/connection');

exports.sendAllArticles = (req, res, next) => {
  const {
    limit = 10, sort_by = 'created_at', order = 'desc', p = 1,
  } = req.query;
  const offset = (p - 1) * limit;
  connection('articles')
    .select('articles.username as author', 'title', 'articles.article_id', 'articles.body', 'articles.votes', 'articles.created_at', 'topic')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id')
    .limit(limit)
    .offset(offset)
    .orderBy(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
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
  const { inc_votes } = req.body;
  connection('articles')
    .where('articles.article_id', '=', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404, message: 'article could not be found' });
      return res.status(200).send({ article });
    })
    .catch(next);
};
