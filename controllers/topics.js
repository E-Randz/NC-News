const connection = require('../db/connection');

const sendTopics = (req, res, next) => {
  console.log('hi');
  res.send('hi');
};

module.exports = { sendTopics };
