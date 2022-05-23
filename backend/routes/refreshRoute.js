const express = require('express');
const router = express.Router();
const { refreshAccessToken } = require('../controllers/refreshController');

router.get('/', refreshAccessToken);

module.exports = router