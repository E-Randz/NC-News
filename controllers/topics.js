const connection = require('../db/connection');

const sendTopics = (req, res, next) => {
  connection('topics')
    .select('*')
    .then((topics) => {
      res.status(200).json({ topics });
    })
    .catch(next);
};

const addTopic = (req, res, next) => {
  const newTopic = req.body;
  connection('topics')
    .insert(newTopic)
    .returning('*')
    .then((topic) => {
      res.status(201).json({ topic });
    })
    .catch(next);
};

const sendArticlesByTopic = (req, res, next) => {
  const { limit = 10, sort_by = 'created_at', order = 'desc' } = req.query;
  connection('articles')
    .select('articles.*')
    .where(req.params)
    .limit(limit)
    .orderBy(sort_by, order)
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id')
    .then((articles) => {
      if (!articles.length) return Promise.reject({ status: 404, message: 'articles not found' });
      return res.status(200).send({ articles });
    })
    .catch(next);
};
module.exports = { sendTopics, addTopic, sendArticlesByTopic };
