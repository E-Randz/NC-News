const {
  articleData, topicData, userData, commentData,
} = require('../data');
const { fixUserAndDate, formatCommentData } = require('../utils');

exports.seed = function (knex, Promise) {
  return knex('topics').insert(topicData)
    .then(() => knex('users').insert(userData))
    .then(() => {
      const formattedArticleData = fixUserAndDate(articleData);
      return knex('articles').insert(formattedArticleData).returning('*');
    })
    .then((articles) => {
      const formattedCommentData = formatCommentData(commentData, articles);
      return knex('comments').insert(formattedCommentData);
    })
    .catch((err) => {
      throw err;
    });
};
