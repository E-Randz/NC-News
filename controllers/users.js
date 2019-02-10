const connection = require('../db/connection');

exports.sendAllUsers = (req, res, next) => {
  connection('users')
    .select('*')
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.sendOneUser = (req, res, next) => {
  const { username } = req.params;
  connection('users')
    .select('*')
    .where('users.username', '=', username)
    .then(([user]) => {
      if (!user) return Promise.reject({ status: 404, message: 'user with the provided username does not exist' });
      return res.status(200).send({ user });
    })
    .catch(next);
};

exports.sendUserArticles = (req, res, next) => {
  const { username } = req.params;
  connection('articles')
    .select('*')
    .where('articles.username', '=', username)
    .then((articles) => {
      if (!articles.length) return Promise.reject({ status: 404, message: 'no articles for this user' });
      return res.status(200).send({ articles });
    })
    .catch(next);
};
