const mongoose = require('mongoose');
const AccountSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Account', AccountSchema);