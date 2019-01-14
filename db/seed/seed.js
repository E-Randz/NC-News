const { articleData, topicData, userData, commentData } = require('../data');

exports.seed = function (knex, Promise) {
  return knex('topics').insert(topicData)
    .then(() => {
      return knex('users').insert(userData).returning('*');
    })
    .then((users) => {
      return knex('articles').insert(articleData);
    })
    .then((articles) => {
      return knex('comments').insert(commentData);
    });
};
