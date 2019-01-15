const connection = require('../db/connection');

exports.sendAllArticles = (req, res, next) => {
  const { limit = 10 } = req.params;

  connection('articles')
    .select('articles.username as author', 'title', 'articles.article_id', 'articles.body', 'articles.votes', 'articles.created_at', 'topic')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id')
    .limit(limit)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
