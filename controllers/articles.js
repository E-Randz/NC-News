const connection = require('../db/connection');

exports.sendAllArticles = (req, res, next) => {
  connection('articles')
    .select('author as username')
    .then((username) => {
      console.log(username);
    })
    .cat
};
