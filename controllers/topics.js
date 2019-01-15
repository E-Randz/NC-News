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
  connection('articles')
    .select('articles.*')
    .where(req.params)
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id')
    .then((articles) => {
      console.log(articles);
      if (!articles.length) return Promise.reject({ status: 404, message: 'topic not found' })
      res.status(200).send({ articles });
    })
    .catch(next);
};
module.exports = { sendTopics, addTopic, sendArticlesByTopic };
