const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../schemas/userSchema')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../helpers/jwtHelpers')
/*
--------------------------------------------------------------------------------
New User Logic
--------------------------------------------------------------------------------
*/
const signUp = asyncHandler(async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        response.status(400)
        throw new Error('Please fill in all required fields')
    }

    const user = await User.findOne({ email: email })
    if (user) {
        response.status(400)
        throw new Error("A user with this email address already exists.")
    }

    const salt = await bcrypt.genSalt(10)

    const enqryptedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
        name,
        email,
        password: enqryptedPassword,
        refreshTokens: []
    })
    if (newUser) {
        response
            .status(201)
            .json({
                message: "You have successfully created an account!",
            })
    }
    else {
        throw new Error("Something went wrong")
    }
})
/*
--------------------------------------------------------------------------------
LogIn Logic
--------------------------------------------------------------------------------
*/
const signIn = asyncHandler(async (request, response) => {
    // Grab cookies from request if they exists 
    const cookies = request.cookies;
    // Grab the email and password from the request body
    const { email, password } = request.body;
    // Check if email and password exist in the request body
    if (!email || !password) {
        response.status(400)
        throw new Error('Please fill in all required fields.')
    }
    // Check the format of the email address
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        response.status(400)
        throw new Error('Please enter a valid email address.')
    }
    // Try to find user with this email in the database
    const user = await User.findOne({ email })
    // If user does not exist, return error
    if (!user) {
        response.status(400)
        throw new Error('There is no user with this email address.')
    }
    // Compare the password with the encrypted password in the database
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        response.status(401)
        throw new Error('Incorrect password.')
    }
    // Generate the access token
    const accessToken = generateAccessToken(user.email)
    // Generate the refresh token
    const newRefreshToken = generateRefreshToken(user.email)
    const newRefreshTokenArray =
        // Check if there is a refresh token in the cookies
        !cookies?.refreshToken
            ? user.refreshTokens
            : user.refreshTokens.filter(token => token !== cookies.refreshToken)
    // Delete the old refresh token cookie
    if (cookies?.refreshToken) response.clearCookie('refreshToken', cookies.refreshToken, { httpOnly: true, sameSite: 'none', secure: true })
    // Update the refresh token array
    user.refreshTokens = [...newRefreshTokenArray, newRefreshToken]
    // Save changes in the database
    await user.save()

    response.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 86400000 })
    response.status(200)
    response.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        accessToken
    })
})
/*
--------------------------------------------------------------------------------
LogOut Logic
--------------------------------------------------------------------------------
*/
const signOut = asyncHandler(async (request, response) => {
    const cookies = request.cookies;
    // Check if refresh token exists in cookies
    if (!cookies?.refreshToken) return response.sendStatus(204);// No content
    // Store the refresh token in variable
    const refreshToken = cookies.refreshToken;
    // Try to find the user with this refresh token
    const user = await User.findOne({ refreshTokens: refreshToken });
    // Check if user exists
    if (!user) {
        // If user does not exist, just delete the refresh token cookie and return 204 No content status
        response.clearCookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true })
        return response.sendStatus(204);
    }
    // If user exists, filter out the old refresh token from the array of refresh tokens in database
    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken)
    // Save changes in the database
    await user.save()
    // Delete the refresh token cookie and return 204 No content status
    response.clearCookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true })
    response.sendStatus(204)
})

const getUser = asyncHandler(async (request, response) => {
    const { _id, name, email } = await User.findOne({ email: request.email })
    response.status(200).json({
        user: {
            id: _id,
            name,
            email
        }
    })
})

module.exports = {
    signIn,
    signUp,
    signOut,
    getUser,
}