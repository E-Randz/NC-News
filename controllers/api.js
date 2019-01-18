const endpoints = {
  '/api': {
    GET: 'serving a list of endpoints and available methods',
  },
  '/api/topics': {
    GET: 'serving an array of topics objects',
    POST: 'add a new topic to the database. requires a \'slug\' and a \'description\'',
  },
  '/api/topics/:topic/articles': {
    GET: 'serving an array of article objects for a given topic',
    POST: 'add a new article to the database. requires a \'title\', \'body\' and a \'username\'',
  },
  '/api/articles': {
    GET: 'serving an array of articles objects',
  },
  '/api/articles/:article_id': {
    GET: 'serving an article object with a given article id',
    PATCH: 'update vote count of article. requires an ?inc_votes=<number> query',
    DELETE: 'delete an article',
  },
  '/api/articles/:article_id/comments': {
    GET: 'serving an array of comments objects with a given article id',
    POST: 'add a new comment to the article. requires a \'body\' and a \'username\'',
  },
  '/api/articles/:article_id/comments/:comment_id': {
    PATCH: 'update comments object requires an ?inc_votes=<number> query',
    DELETE: 'delete a comment',
  },
  '/api/users': {
    GET: 'serving an array of users objects',
  },
  '/api/users/:username': {
    GET: 'serving a user object with a given username',
  },
};

exports.sendEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};
