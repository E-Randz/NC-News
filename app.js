const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const { handle400, handle422, handle404 } = require('./errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400);
app.use(handle404);
app.use(handle422);

module.exports = app;
