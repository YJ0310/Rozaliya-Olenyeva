const { MessageEmbed } = require("discord.js");


module.exports = {
    name: `check_warn_record`,
    description: `check your warn record`,
    category: `common`,
    async execute(interaction, options) {
        try {
            const user = interaction.user;
            const schema_warn_record = await require(`../../mongoose/schema_warn_record`);
            const user_record = await schema_warn_record.find({ user_id: user.id, ban: false }).sort({ timestamp: 1 });
            if (user_record.length === 0) return interaction.editReply({ content: `Hurray! You don't have any warning!`, ephemeral: true });
            let user_record_embed = [];
            await user_record.map(async (element, index) => {
                user_record_embed.push(`${index + 1}. ${element.reason}\nmoderator: ${element.moderator_tag}\ntimestamp: ${element.timestamp}`)
            })
            try {

                return interaction.editReply({
                    ephemeral: true,
                    embeds: [
                        new MessageEmbed({
                            title: `Warn record for ${user.tag}`,
                            description: user_record_embed.join(`\n\n`),
                            color: interaction.member.roles.color?.hexColor ?? `#FFFFFF`
                        })
                    ]
                });
            } catch (error) {
                console.error(error)

            }
        } catch(error) {
                console.error(error)
        
            }
        }
};