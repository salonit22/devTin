const jwt = require('jsonwebtoken');
const user = require('../models/user');

const userAuth = async (req,res,next)=>{
    try {
        const token = req.cookies.jwtToken;
        if (!token) {
            return res.status(401).send({ error: "Access denied. No token provided." });
        }
        const decoded = jwt.verify(token, 'secretKey');
         const userInfo = await user.findOne({ email: decoded.email });
        req.user = userInfo;
        next();
    } catch (err) {
        res.status(400).send({ error: "Invalid token." });
    }
}

module.exports = {
    userAuth
}