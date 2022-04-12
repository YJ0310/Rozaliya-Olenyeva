const { MessageEmbed } = require("discord.js");
const client = require("../../..");

module.exports = {
    name: `help`,
    description: `show the command list`,
    async execute(interaction) {
        let command_list = [];
        // await interaction.client.commands.
        await [`moderator`, `common`, `xp`].forEach(async element => {
            command_list.push(`\*\*${element}\*\*`);
            client.commands.forEach(async (command) => {
                if (command.category === element) {
                    command_list.push(`\`${command.name}\` - \t ${command.description}`);
                }
            })
            command_list.push(` `);
        });
        try {
            interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        title: `Command list`,
                        description: command_list.join(`\n`),
                        color: interaction.member.roles.color?.hexColor ?? `#FFFFFF`
                    })
                ],
                ephemeral: true
            });
        }
        catch {
            error => {
                console.error(error);
            }
        }
        return
    }
};