const app = require('express')();
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use('/api', apiRouter);

module.exports = app;
