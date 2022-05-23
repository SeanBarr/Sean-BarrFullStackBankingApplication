const { allowedOrigins } = require('../config/corsConfig');

const credidentialsHandler = (request, response, next) => {
    const origin = request.headers.origin;
    if (allowedOrigins.includes(origin)) {
        response.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credidentialsHandler;