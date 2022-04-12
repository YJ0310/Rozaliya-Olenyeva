module.exports = {
    command_fail_interaction(interaction) {
        interaction.reply({ content: `There's and issue when running the command. Please try again later or contact the developer`, ephemeral: true });
    }
}