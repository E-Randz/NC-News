const endpoints = {
  '/api/topics': 'serving an array of topics objects',
  '/api/topics/:topic/articles': 'serving an array of article objects for a given topic',
  '/api/articles': 'serving an array of articles objects',
  '/api/articles/:article_id': 'serving an article object with a given article id',
  '/api/articles/:article_id/comments': 'serving an array of comments objects with a given article id',
  '/api/articles/:article_id/comments/:comment_id': 'serving a comments object with a given article id and comment id',
  '/api/users': 'serving an array of users objects',
  '/api/users/:username': 'serving a user object with a given username',
};

exports.sendEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};
