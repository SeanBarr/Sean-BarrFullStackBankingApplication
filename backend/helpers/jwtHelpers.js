const jwt = require('jsonwebtoken')


// node  > require('crypto').randomBytes(64).toString('hex')

const generateAccessToken = (email) => {
    return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' })
}

const generateRefreshToken = (email) => {
    return jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
}

module.exports = { generateAccessToken, generateRefreshToken }