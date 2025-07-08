const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({ mssg: "Unauthorized access, please login to continue" });
    }
    try {
        const token_val = token.split(' ')[1];
        const decoded = jwt.verify(token_val, process.env.SECRET_KEY);
        req.user = decoded;  // Attach user info to request
        next();
    } catch (err) {
        return res.status(403).send({ mssg: "Invalid or expired token" });
    }
}

module.exports = verifyToken;
