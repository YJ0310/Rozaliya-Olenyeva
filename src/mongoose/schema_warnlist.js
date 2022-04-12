const mongoose = require(`mongoose`);
const Schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    warns: Number
});

module.exports = mongoose.model(`warn_list`, Schema);
