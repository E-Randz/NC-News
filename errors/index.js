exports.handle400 = (err, req, res, next) => {
  const errCodes = ['42703'];
  console.log(err);
  if (errCodes.includes(err.code)) res.status(400).send({ message: err.toString() });
  else next(err);
};
