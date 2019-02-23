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
    .then(([topic]) => {
      res.status(201).json({ topic });
    })
    .catch(next);
};

const sendArticlesByTopic = (req, res, next) => {
  const { limit = 10, p = 1 } = req.query;
  let { sort_by = 'created_at', order = 'desc' } = req.query;

  const checkSort = ['article_id', 'title', 'votes', 'topic', 'username', 'created_at'];
  const checkOrder = ['asc', 'desc'];
  if (!checkSort.includes(sort_by)) sort_by = 'created_at';
  if (!checkOrder.includes(order)) order = 'desc';
  if (!/[0-9]+/.test(limit) || !/-*[0-9]/.test(p)) return next({ status: 400, message: 'invalid limit or page number' });
  const offset = (p - 1) * limit;
  let article_count;
  return connection('articles')
    .count('articles.article_id as count')
    .where(req.params)
    .then(([{ count }]) => {
      article_count = +count;
      return connection('articles')
        .select('articles.article_id', 'title', 'articles.votes', 'topic', 'articles.username as author', 'articles.created_at')
        .where(req.params)
        .limit(limit)
        .orderBy(sort_by, order)
        .offset(offset)
        .leftJoin('comments', 'comments.article_id', 'articles.article_id')
        .count('comments.comment_id as comment_count')
        .groupBy('articles.article_id');
    })
    .then((articles) => {
      if (!articles.length) return Promise.reject({ status: 404, message: 'articles not found' });
      return res.status(200).send({ articles, article_count });
    })
    .catch(next);
};

const addNewArticle = (req, res, next) => {
  const newArticle = { topic: req.params.topic, ...req.body };
  connection('articles')
    .insert(newArticle)
    .returning('*')
    .then(([article]) => {
      // console.log(article);
      if (!article) return Promise.reject({ status: 404, message: `unable to post to ${req.params.topic} check that topic exists` });
      return res.status(201).send({ article });
    })
    .catch(next);
};
module.exports = {
  sendTopics, addTopic, sendArticlesByTopic, addNewArticle,
};
