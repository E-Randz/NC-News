exports.handle400 = (err, req, res, next) => {
  const errCodes = ['42703'];
  if (errCodes.includes(err.code)) res.status(400).send({ message: err.detail || err.toString() });
  else next(err);
};

exports.handle422 = (err, req, res, next) => {
  const errCodes = ['23505'];
  if (errCodes.includes(err.code)) res.status(422).send({ message: err.detail || err.toString() });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ message: err.message });
};
