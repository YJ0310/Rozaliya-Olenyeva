module.exports = {
    name: `hello_world`,
    description: `hello world`,
    category: `common`,
    execute(interaction) {
        interaction.editReply({ content: `hello`, ephemeral: true });
    }
}