const {moderator_reason} = require(`../../../config.json`);
let warn_reason = [];
let ban_reason = [];
moderator_reason.warn_reason.map(async (element, index) => {
    warn_reason.push({
        name: element,
        value: element
    })
})
moderator_reason.ban_reason.map(async (element, index) => {
    ban_reason.push({
        name: element,
        value: element
    })
})

module.exports = {
    name: `mod`,
    description: `moderator`,
    options: [
        {
            type: `SUB_COMMAND`,
            name: `warn`,
            description: `warn someone`,
            options: [
                {
                    type: `USER`,
                    name: `user`,
                    description: `select a member`,
                    required: true
                },
                {
                    type: `STRING`,
                    name: `reason`,
                    description: `reason`,
                    choices: warn_reason
                }
            ]
        },
        {
            type: `SUB_COMMAND`,
            name: `unwarn`,
            description: `unwarn someone`,
            options: [
                {
                    type: `USER`,
                    name: `user`,
                    description: `select a user`,
                    required: true
                }
            ]
        },
        {
            type: `SUB_COMMAND`,
            name: `ban`,
            description: `ban someone`,
            options: [
                {
                    type: `USER`,
                    name: `user`,
                    description: `select a user`
                },
                {
                    type: `STRING`, 
                    name: `user_id`,
                    description: `insert user id`
                },
                {
                    type: `STRING`,
                    name: `reason`,
                    description: `reason`,
                    choices: ban_reason
                },
            ]
        },
        {
            type: `SUB_COMMAND`,
            name: `unban`,
            description: `unban someone`,
            options: [
                {
                    type: `STRING`, 
                    name: `user_id`,
                    description: `insert user id`
                },
                {
                    type: `STRING`,
                    name: `reason`,
                    description: `reason`
                },
            ]
        },
        {
            type: `SUB_COMMAND`,
            name: `warn_list`,
            description: `show the warnlist`,
            options: [
                {
                    type: `USER`, 
                    name: `user`,
                    description: `select a user`
                }
            ]
        }
    ]
}