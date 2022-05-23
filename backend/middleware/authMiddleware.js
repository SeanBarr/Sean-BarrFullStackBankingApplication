const jwt = require('jsonwebtoken');

const protectRoute = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return response.sendStatus(401)
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) return response.sendStatus(403); // 
        request.email = decoded.email;
        next();
    })
}

module.exports = { protectRoute };