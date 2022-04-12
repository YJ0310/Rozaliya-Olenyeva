module.exports = {
    name: `hello_world`,
    description: `hello world`,
    category: `common`,
    execute(interaction) {
        interaction.reply({ content: `hello`, ephemeral: true });
    }
}