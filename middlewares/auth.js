const jwt = require("jsonwebtoken");

const config = require("../utils/config");

const handleAuthError = (res) => {
  res.status(400).send({ message: "Authorization Error " });


};

const extractBearerToken = (header) => header.replace("Bearer ", "");


module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);

  let payload;

  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);

  }


  req.user = payload; // adding the payload to the Request object

  return next(); // passing the request further along
};
