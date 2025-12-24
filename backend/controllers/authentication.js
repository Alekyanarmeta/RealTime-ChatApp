const jwt = require("jsonwebtoken");

async function Authentication(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }


    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || process.env.Token_Secret;

    if (!secret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }


    const decoded = await jwt.verify(token, secret);
    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = Authentication;
