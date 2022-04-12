const { command_fail_interaction } = require("../../function/command_fail");

module.exports = {
    name: `delete_message`,
    description: `delete message`,
    category: `moderator`,
    async execute(interaction, options) {
        if (options.getBoolean(`all`) === true) {
            interaction.reply({ content: `The command will take several minutes...`, ephemeral: true });
            await interaction.channel.bulkDelete(100, true).then(() => {
                setTimeout(() => {
                    interaction.channel.send({ content: `All the messages deleted`, ephemeral: true }).then(message => {
                        setTimeout(() => {
                            message.delete();
                        }, 1000);
                    });
                    return;
                }, 1000);
            })
            return;
        }
        try {
            const amount = options.getInteger(`amount`);
            if(!amount) return interaction.reply({content: `Please insert a valid amount`, ephemeral: true});
            interaction.reply({ content: `The command will take several minutes...`, ephemeral: true });
            await interaction.channel.bulkDelete(amount, true).then(() => {
                setTimeout(() => {
                    interaction.channel.send({ content: `${amount} message(s) deleted`, ephemeral: true }).then(message => {
                        setTimeout(() => {
                            message.delete();
                        }, 1000);
                    });
                    return;
                }, 1000);
            })
        } catch {
            command_fail_interaction(interaction);
            console.error;
        }


    }
}