const connection = require('../db/connection');

const sendTopics = (req, res, next) => {
  connection('topics')
    .select('*')
    .then((topics) => {
      res.status(200).json({ topics });
    })
    .catch(next);
};

module.exports = { sendTopics };
