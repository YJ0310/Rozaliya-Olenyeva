module.exports = {
    name: `suggest_mod`,
    description: `respond to the suggestion`,
    options: [
        {
        type: "STRING",
        name: "suggestion",
        description: "choose a suggestion (must be in id form)",
        required: "true"
        },
        {
        type: "STRING",
        name: "decision",
        description: "select a decision",
        required: "true",
        choices: [
            {
                name: `accept`,
                value: `accept`,
            },
            {
                name: `reject`,
                value: `reject`,
            },
            {
                name: `consider`,
                value: `consider`,
            },
        ]
        },
        {
        type: "STRING",
        name: "reason",
        description: "reason",
        required: "false"
        }
    ]
};