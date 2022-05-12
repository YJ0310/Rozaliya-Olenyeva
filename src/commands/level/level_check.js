const Canvacord = require(`canvacord`);
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { starting_level_xp, xp_between_level } = require(`../../../config.json`);

module.exports = {
    name: `level`,
    description: `check your level`,
    category: `xp`,
    async execute(interaction, options) {
        try {
            const member = options.getMember(`user`) ?? interaction.member;
            const user = member.user;
            const xp_list = await require(`../../mongoose/schema_xp_list`);
            const member_list = await xp_list.find({});
            member_list.sort((a, b) => { return b.xp - a.xp; });
            const member_data = member_list.find(element => element.id === user.id);
            // solution for if no data
            if (!member_data)
                try {
                    return interaction.editReply({ content: `No data`, ephemeral: true });

                } catch (error) {
                    console.error(error)

                }
            // rank
            const rank = (member_list.indexOf(member_data)) + 1;
            const level = member_data.level
            const xp_current = Math.floor(member_data.xp - (((level - 1) / 2) * (2 * (starting_level_xp) + (level - 2) * xp_between_level)));
            const xp_for_next_level = ((starting_level_xp) + (level - 1) * xp_between_level);
            // const embed = new MessageEmbed()
            //     .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            //     .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            //     .setTitle(`Level ${level}`)
            //     .setFields([
            //         {
            //             name: `xp`,
            //             value: `${xp_current} / ${xp_for_next_level}`,
            //         },
            //         {
            //             name: `rank`,
            //             value: `${rank}`
            //         }
            //     ])
            //     .setColor(interaction.member.roles.color?.hexColor ?? `#FFFFFF`);
            const color = member.roles.color?.hexColor ?? `#FFFFFF`;
            const rank_picture = new Canvacord.Rank()
                .setAvatar(user.displayAvatarURL({ dynamic: true, format: `png` }))
                .setCurrentXP(xp_current, color)
                .setRequiredXP(xp_for_next_level, color)
                .setProgressBar(color, `COLOR`)
                .setUsername(user.username, color)
                .setLevel(level)
                .setRank(rank)
                .setRankColor(color)
                .setLevelColor(color)
                .setDiscriminator(user.discriminator, color)
            rank_picture.build()
                .then(data => {
                    const attachment = new MessageAttachment(data);
                    try {
                        interaction.editReply({
                            files: [attachment],
                            ephemeral: true
                        });

                    } catch (error) {
                        console.error(error)
                    }
                    return
                });
        } catch (error) {
            console.error(error)
        }

    }
}