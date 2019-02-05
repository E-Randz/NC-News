const app = require('express')();
var cors = require('cors');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const {
  handle400, handle422, handle404, handle500,
} = require('./errors');

app.use(cors());

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400);
app.use(handle404);
app.use(handle422);
app.use(handle500);

module.exports = app;
