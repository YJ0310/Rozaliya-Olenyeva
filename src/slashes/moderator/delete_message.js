module.exports = {
    name: `delete_message`,
    description: `delete message`,
    options: [
        {
            type: 5,
            name: `all`,
            description: `pick "true" if you want to delete all the message`,
        },
        {
            type: 4,
            name: `amount`,
            description: `amount of message you want to delete`,
            minValue:1,
            maxValue:100
        }
    ]
}