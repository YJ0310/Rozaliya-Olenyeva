let ten_users = [];
ten_users.push({
    type: "BOOLEAN",
    name: "enable",
    description: "true for enable, false for disable",
    required: "true"
})
for (i = 1; i <= 10; i++) {
    const data = {
        type: "USER",
        name: `user${i}`,
        description: `user${i}`,
        required: "false"
    }
    if (i === 1) data.required = true
    ten_users.push(data)
}

module.exports = {
    name: `temp_channel`,
    description: `temporary channel settings`,
    options: [
        {
            type: 1,
            name: `open`,
            description: `open a temporary channel`,
            options: [
                {
                    type: 3,
                    name: `channel_name`,
                    description: `your channel name`,
                    required: false
                }
            ]

        },
        {
            type: `SUB_COMMAND`,
            name: `close`,
            description: `close your temporary channel`
        },
        {
            type: `SUB_COMMAND`,
            name: `give`,
            description: `transfer the ownership to others who don't have temp channel`,
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
            type: "SUB_COMMAND",
            name: "private",
            description: "enable / disable private mode",
            options: [
                {
                    type: "BOOLEAN",
                    name: "enable",
                    description: "true for enable, false for disable",
                    required: "true"
                }
            ]
        },
        {
            type: "SUB_COMMAND",
            name: "secret",
            description: "enable / disable secret mode",
            options: [
                {
                    type: "BOOLEAN",
                    name: "enable",
                    description: "true for enable, false for disable",
                    required: "true"
                }
            ]
        },
        {
            type: "SUB_COMMAND",
            name: "allow_user",
            description: "allow some user to join your channel",
            options: ten_users
        },
        {
        type: "SUB_COMMAND",
        name: "size",
        description: "limit user for the channel",
        options: [
            {
            type: "INTEGER",
            name: "number",
            description: "number of the limit user",
            required: "true",
            minValue: 1,
            maxValue: 20
            }
        ]
        }       
    ]
}