const mongoose = require(`mongoose`);

module.exports = mongoose.model(`to_do_list`, new mongoose.Schema({
    id: {
        type: String,
        unique:true
    },
    name: String,
    quote: {
        type: String,
        default: `There is no failure except in no longer trying`
    },
    tasks: {
        type: Array,
        default: [
            {task: `Insert \`new task\` to set a new task`},
            {task: `Insert \`5 edit task\` to edit the task`},
            {task: `Insert \`5\` to complete the task`},
            {task: `Press the \`help\` button`},
        ]
    },
    clear_timestamp: {
        type: Number,
        default: 0
    }
}));