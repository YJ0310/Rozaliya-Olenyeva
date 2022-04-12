module.exports = {
    name: `dm`,
    description: `dm for help`,
    options: [
        {
            type: 1,
            name: `open`,
            description: `open a dm channel`,
            options: [
                {
                    type: 6,
                    name: `member`,
                    description: `choose a member`,
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: `close`,
            description: `close a channel`
        }
    ]
};