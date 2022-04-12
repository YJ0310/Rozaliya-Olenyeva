const mongoose = require(`mongoose`);

module.exports = mongoose.model(`xp_list`, new mongoose.Schema({
    id: {
        type: String,
        unique:true
    },
    name: String,
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    bonus: {
        type: Number,
        default: 0
    },
    daily_timestamp: {
        type: Number,
        default: 0
    }
}));