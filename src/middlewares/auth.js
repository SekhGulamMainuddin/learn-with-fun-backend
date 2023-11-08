const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ msg: "No auth token found" });

    const bearerToken = token.split(" ")[1];
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    if (!verified) return res.status(401).json({ msg: "Token not valid" });

    req.user = verified.id;
    req.token = bearerToken;
    next();
  } catch (e) {
    res.status(403).json({ error: e.message });
  }
};

module.exports = auth;
