let requiredChoice = [
    {
        type: `STRING`,
        name: `question`,
        description: `your question`,
        required: true
    }
];

[`first`, `second`, `third`, `forth`, `fifth`, `sixth`, `seventh`, `eighth`, `ninth`, `tenth`].forEach((x, i) => {
    let choice = {
        type: `STRING`,
        name: `choice${i + 1}`,
        description: `your ${x} choice`
    }
    const first2 = [`first`, `second`];
    if (first2.includes(x)) {
        choice.required = true;
    }
    requiredChoice.push(choice)
})
requiredChoice.push(
    {
        type: `BOOLEAN`,
        name: `default_channel`,
        description: `send the poll in default channel? if false the poll will be sent in poll channel`,

    }, {
    type: `BOOLEAN`,
    name: `admin`,
    description: `want to make this polls as admin mode?`,
}
)

module.exports = {
    name: `poll`,
    description: `make a poll`,
    options: requiredChoice
}