const errorHandler = (error, request, response, next) => {
    const statusCode = response.statusCode ? response.statusCode : 500;
    response.status(statusCode)
    response.json({ message: error.message })
}

module.exports = { errorHandler };