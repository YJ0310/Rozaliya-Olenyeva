const { MessageActionRow, MessageButton, MessageEmbed, Interaction } = require("discord.js");
const { command_fail_interaction } = require("../../function/command_fail");
const { send_report_n_suggestions } = require("../../function/send_report_n_suggestion");

module.exports = {
    name: `report`,
    description: `report`,
    async execute(interaction, options) {
        interaction.user.createDM({ force: true }).then(async dm_channel => {
            try {
                interaction.reply({
                    content: `Please insert your report in 5 minutes or type "cancel" to cancel the command`,
                    ephemeral: true,
                    fetchReply: true,
                }).then(async message => {
                    const collect = message.channel.createMessageCollector({ filter(x) { return x.author.id === interaction.user.id }, time: 5 * 60000, max: 1 });

                    collect.on(`collect`, async args => {
                        if (args.content.toLowerCase() === `cancel`) {
                            args.reply({embeds: [
                                new MessageEmbed({
                                    title: `Command cancelled`,
                                    color: interaction.member.roles.color?.hexColor ?? `#FFFFFF`
                                })
                            ], ephemeral: true});
                            return setTimeout(() => {
                                args.delete();
                            }, 5000); 
                        }
                        dm_channel.send({
                            embeds: [
                                new MessageEmbed({
                                    title: `Please comfirm your report in 1 minutes`,
                                    description: args.content,
                                    color: interaction.member.roles.color?.hexColor ?? `#FFFFFF`
                                })
                            ],
                            ephemeral: true,
                            components: [
                                new MessageActionRow({
                                    components: [
                                        new MessageButton({
                                            custom_id: `check_comfirm`,
                                            label: `comfirm`,
                                            style: `SUCCESS`
                                        }),
                                        new MessageButton({
                                            custom_id: `check_cancel`,
                                            label: `cancel`,
                                            style: `DANGER`
                                        })
                                    ]
                                })
                            ],
                            fetchReply: true
                        })
                            .then(async comfirmation => {
                                const args_deleted = await args.delete();
                                comfirmation.awaitMessageComponent({ time: 60000 })
                                    .then(async comfirmation_interaction => {
                                        if (comfirmation_interaction.customId === `check_comfirm`) {
                                            // send function
                                            await send_report_n_suggestions(args_deleted, `report`)
                                            await comfirmation_interaction.reply({ content: `report comfirmed`, ephemeral: true });
                                            await comfirmation.delete()
                                        }
                                        if (comfirmation_interaction.customId === `check_cancel`) {
                                            await comfirmation_interaction.reply({ content: `report cancelled`, ephemeral: true });
                                            await comfirmation.delete()
                                        }
                                        return;
                                    })
                                    .catch(async error => {
                                        console.error(error);
                                        comfirmation.reply({ content: `report cancelled`, ephemeral: true });
                                        return;
                                    })
                            })
                    });


                })
                return;
            } catch (error) {
                console.error(error);
                command_fail_interaction(interaction);
            }
        })
    }
}
