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
    .catch(err => res.json(err));
};

module.exports = { sendTopics, addTopic };
