const jwt = require("jsonwebtoken");
require('dotenv').config(); 

// verify token middleware
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized, token not found");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    process.env.CURRENT_USER = decoded.id;
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized, invalid token");
  }
};
