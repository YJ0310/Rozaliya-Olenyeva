const { command_fail_interaction } = require("../../function/command_fail");
const { get_config_data } = require("../../function/config");
const { guild_f } = require("../../function/guild");

module.exports = {
    name: `suggest_mod`,
    description: `reply the suggestion`,
    category: `moderator`,
    async execute(interaction, options) {
        try {

            const suggestion_admin_channel = await get_config_data(`channels`, `suggestion_admin_channel`)
            const suggestion_channel = await get_config_data(`channels`, `suggestion`)
            const guild = await guild_f();
            if (options.getString(`suggestion`) === null) return interaction.reply({ content: `Please insert a valid id, try to find the id that provided in <#${suggestion_admin_channel.channel_id}>`, ephemeral: true });
            const suggestion_embed = await guild.channels.fetch(suggestion_channel.channel_id).then(async (channel) => { return channel.messages.fetch(options.getString(`suggestion`)).then(message => { return message }) });
            const reason = options.getString(`reason`) ?? `no reason`;
            let settings = {};
            if (options.getString(`decision`) === `accept`) {
                settings = {
                    color: `GREEN`,
                    title: `Accept`,
                }
            }
            if (options.getString(`decision`) === `reject`) {
                settings = {
                    color: `RED`,
                    title: `Reject`,
                }
            }
            if (options.getString(`decision`) === `consider`) {
                settings = {
                    color: `FFAA00`,
                    title: `Consider`,
                }
            }
            const new_embeds = suggestion_embed.embeds[0]
                .setColor(settings.color)
                .setFields([{
                    name: `<t:${Math.floor(Date.now() / 1000)}:R>\n${interaction.user.tag}: ${settings.title}`,
                    value: reason
                }])
            try {
                await suggestion_embed.edit({
                    embeds: [new_embeds]
                })
                return interaction.reply({ content: `Embed set`, ephemeral: true });
            } catch (error) {
                console.error(error);
                return command_fail_interaction(interaction);
            }
        } catch (error) {
            console.error(error)

        }
    }
};