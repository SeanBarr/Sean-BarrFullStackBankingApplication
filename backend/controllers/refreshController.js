const jwt = require('jsonwebtoken');
const User = require('../schemas/userSchema')
const { generateAccessToken, generateRefreshToken } = require('../helpers/jwtHelpers')
const asyncHandler = require('express-async-handler')

const refreshAccessToken = asyncHandler(async (request, response) => {
    const cookies = request.cookies;
    // Check if refresh token exists in cookies
    if (!cookies?.refreshToken) return response.sendStatus(401);

    // Store the refresh token in variable

    const refreshToken = cookies.refreshToken;

    // Delete the old refresh token cookie

    response.clearCookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true })

    // Check if user with this refresh token exists

    const user = await User.findOne({ refreshTokens: refreshToken });

    // Check if user exists
    if (!user) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (error, decoded) => {
                if (error) return response.sendStatus(403); // Forbidden
                //  Detect refresh token reuse
                const compromisedUser = await User.findOne({ email: decoded.email });
                compromisedUser.refreshTokens = [];
                await compromisedUser.save();
            })
        return response.sendStatus(403); // Forbidden
    }
    // If user exists, filter out the old refresh token from the array of refresh tokens in database
    const newRefreshTokenArray = user.refreshTokens.filter(token => token !== refreshToken)
    // Validate the refresh token
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (error, decoded) => {
            if (error) {
                user.refreshTokens = [...newRefreshTokenArray];
                await user.save();
            }
            if (error || user.email !== decoded.email) return response.sendStatus(403); // Forbidden
            // Generate new access token
            const accessToken = generateAccessToken(user.email);
            // Generate new refresh token
            const newRefreshToken = generateRefreshToken(user.email);
            user.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
            // Save changes to the user in the database
            await user.save();
            response.status(201)
            // Create secure cookie with the new refresh token
            response.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 86400000 })
            // Send the new access token as json
            response.json({ accessToken })
        })
})

module.exports = { refreshAccessToken };