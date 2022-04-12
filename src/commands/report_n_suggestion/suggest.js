const { MessageActionRow, MessageButton, MessageEmbed, Interaction } = require("discord.js");
const { command_fail_interaction } = require("../../function/command_fail");
const { send_report_n_suggestions } = require("../../function/send_report_n_suggestion");

module.exports = {
    name: `suggest`,
    description: `suggest`,
    async execute(interaction, options) {
        interaction.user.createDM({ force: true }).then(async dm_channel => {
            try {
                interaction.editReply({
                    content: `Please insert your suggestions in 5 minutes or type "cancel" to cancel the command`,
                    ephemeral: true,
                    fetchReply: true,
                }).then(async message => {
                    const collect = message.channel.createMessageCollector({ filter(x) { return x.author.id === interaction.user.id }, time: 5 * 60000, max: 1 });

                    collect.on(`collect`, async args => {
                        if (args.content.toLowerCase() === `cancel`) {
                            args.delete();
                            return dm_channel.send({embeds: [
                                new MessageEmbed({
                                    title: `Command cancelled`,
                                    color: interaction.member.roles.color?.hexColor ?? `#FFFFFF`
                                })
                            ]});
                        }
                        dm_channel.send({
                            embeds: [
                                new MessageEmbed({
                                    title: `Please comfirm your suggesstion in 1 minutes`,
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
                                            await send_report_n_suggestions(args_deleted, `suggestion`)
                                            await comfirmation.delete()
                                            comfirmation_interaction.editReply({ content: `suggestion comfirmed`, ephemeral: true });
                                        }
                                        if (comfirmation_interaction.customId === `check_cancel`) {
                                            await comfirmation.delete()
                                            comfirmation_interaction.editReply({ content: `suggestion cancelled`, ephemeral: true });
                                        }
                                        return;
                                    })
                                    .catch(async error => {
                                        console.error(error);
                                        comfirmation.reply({ content: `suggestion cancelled`, ephemeral: true });
                                        return;
                                    })
                            })
                    })
                    collect.on(`end`, async args => {
                        if (args.size > 0) return;
                        message.edit({ content: `Command cancelled`, ephemeral: true });
                        return;
                    })


                })
                return;
            } catch (error) {
                console.error(error);
                command_fail_interaction(interaction);
            }
        })
    }
}
