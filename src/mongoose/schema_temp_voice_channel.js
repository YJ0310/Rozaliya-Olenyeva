const { default: mongoose } = require("mongoose");

module.exports = mongoose.model(`temp_voice_channel_list`, new mongoose.Schema({
    owner_id: {
        type: String,
        unique: true
    },
    owner_name: String,
    channel_id: {
        type: String,
        unique: true
    },
    channel_name: String,
    admin_id: Array,
    admin_name: Array,
    expired_timestamp: Number
}))