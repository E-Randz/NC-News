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
