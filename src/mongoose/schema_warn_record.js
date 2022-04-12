const mongoose = require(`mongoose`);
const Schema = new mongoose.Schema({
    timestamp: Date,
    user_id: String,
    user_tag: String,
    moderator_id: String,
    moderator_tag: String,
    reason: String,
    ban: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model(`warn_record`, Schema);