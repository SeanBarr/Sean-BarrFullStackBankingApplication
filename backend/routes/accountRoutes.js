const express = require('express');
const router = express.Router();
const { getAccounts, createAccount, updateAccount, deleteAccount } = require('../controllers/accountController');
const { protectRoute } = require('../middleware/authMiddleware');

router.route('/')
    .put(protectRoute, updateAccount)
    .delete(protectRoute, deleteAccount)
router.route('/:owner')
    .get(protectRoute, getAccounts)
    .post(protectRoute, createAccount)

module.exports = router