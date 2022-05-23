const express = require('express');
const router = express.Router();
const { signIn, signUp, signOut, getUser } = require('../controllers/userController');
const { protectRoute } = require('../middleware/authMiddleware');

router.post('/signin', signIn);

router.post('/signup', signUp);

router.get('/signout', signOut);

router.get('/', protectRoute, getUser);

module.exports = router