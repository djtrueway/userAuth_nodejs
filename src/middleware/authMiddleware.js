const jwt = require("jsonwebtoken");

const secretKey = "yourSecretKey";

const authenticate = (req, res, next) => {
  const token = req.cookies.authToken;
  console.log(token);

  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).send("Unauthorized: Invalid token");
      }
      req.userId = decoded.userId;
      next();
    });
  } else {
    res.status(401).send("Unauthorized: Token not found");
  }
};

module.exports = { authenticate };
