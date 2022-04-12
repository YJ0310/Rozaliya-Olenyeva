const { MessageEmbed } = require(`discord.js`);

module.exports = {
    name: `daily`,
    description: `collect daily rewards`,
    category: `xp`,
    async execute(interaction, options) {
        const daily_xp_amount_range = await require(`../../../config.json`).daily_xp_amount;
        const { min_value, max_value } = daily_xp_amount_range
        const daily_xp_amount = Math.floor(Math.random() * (max_value - min_value)) + min_value;
        const xp_list = await require(`../../mongoose/schema_xp_list`);
        let member_xp_list = await xp_list.findOne({ id: interaction.user.id });
        if (!member_xp_list) {
            member_xp_list = await new xp_list({
                id: interaction.user.id
            })
        }
        // check the daily_timestamp
        if (Date.now() < member_xp_list.daily_timestamp) 
        try {

            interaction.editReply({ content: `You already collect your reward. Please try it at <t:${Math.floor(member_xp_list.daily_timestamp / 1000)}:R>`, ephemeral: true });
        } catch (error) {
            console.error(error)
        }
        return
        member_xp_list.xp += daily_xp_amount;
        member_xp_list.daily_timestamp = Date.now() + (1000 * 3600 * 20);
        member_xp_list.save();
        try { 
            interaction.editReply({
                ephemeral: true,
                embeds: [
                    new MessageEmbed({
                        title: `Daily Xp`,
                        description: daily_xp_amount,
                        fields: [{
                            name: `Daily Quote`,
                            value: `quote`
                        }],
                        color: interaction.member.roles.color?.hexColor ?? `#FFFFFF`
                    })
                ]
            });
        } catch (error) {
            console.error(error)

        }
        return
    }
}