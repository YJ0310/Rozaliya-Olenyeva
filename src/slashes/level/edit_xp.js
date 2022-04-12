module.exports = {
    name: `xp`,
    description: `modify xp`,
    options: [
        {
            type: `SUB_COMMAND`,
            name: `edit`,
            description: `edit someone's xp`,
            options: [
                {
                    type: `USER`,
                    name: `user`,
                    description: `select a user`,
                    required: true
                },
                {
                    type: `INTEGER`,
                    name: `give`,
                    description: `give xp`,
                    minValue: 1
                },
                {
                    type: `INTEGER`,
                    name: `remove`,
                    description: `remove xp`,
                    minValue: 1
                }
            ]
        },
        {
            type: `SUB_COMMAND`,
            name: `clear`,
            description: `clear someone's xp`,
            options: [
                {
                    type: `USER`,
                    name: `user`,
                    description: `select a user`,
                    required: true
                },
            ]
        }
    ]
}