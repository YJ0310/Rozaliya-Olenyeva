const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { command_fail_interaction } = require("../../function/command_fail");
const { guild_f } = require("../../function/guild");

module.exports = {
    name: `mod`,
    description: `moderator`,
    category: `moderator`,
    async execute(interaction, options) {
        try {

            if (options.getSubcommand() === `warn`) {
                const user = options.getMember(`user`)?.user;
                if (!user) return interaction.reply({ content: `Invalid member`, ephemeral: true });
                const moderator = interaction.user;
                const reason = options.getString(`reason`) || `no reason`;
                try {
                    // record the warning list
                    const warn_record_data = await require(`../../mongoose/schema_warn_record`);
                    await warn_record_data.create({
                        user_id: user.id,
                        user_tag: user.tag,
                        moderator_id: moderator.id,
                        moderator_tag: moderator.tag,
                        reason: reason,
                        timestamp: Date.now()
                    });
                    try {
                        interaction.reply({ content: `warn successfully`, ephemeral: true });

                    } catch (error) {
                        console.error(error)

                    }
                }

                catch (error) {
                    console.error(error);
                }
            }
            if (options.getSubcommand() === `unwarn`) {
                const user = options.getMember(`user`).user;
                const warn_list = await require(`../../mongoose/schema_warnlist`);
                const warn_record = await require(`../../mongoose/schema_warn_record`);
                const member_warn_record = await warn_record.find({ user_id: user.id, ban: false });
                if (member_warn_record.length === 0) return interaction.reply({ content: `This member doesn't have any warning`, ephemeral: true });
                let member_warn_record_list = [];
                await member_warn_record.forEach(async x => {
                    member_warn_record_list.push({
                        label: x.reason,
                        value: x.reason,
                    });
                })
                await member_warn_record_list.push({
                    label: `cancel`,
                    value: `cancel`
                })
                const select_delete_warn = await interaction.reply({
                    content: `Please select a warning in 30 seconds`,
                    ephemeral: true,
                    fetchReply: true,
                    components: [
                        new MessageActionRow({
                            components: [new MessageSelectMenu({
                                customId: `warn_select_menu`,
                                placeholder: `Please select a warn`,
                                options: member_warn_record_list
                            })]
                        })
                    ]
                });
                await select_delete_warn.awaitMessageComponent({ filter(x) { return x.user.id === interaction.user.id }, time: 30 * 1000 })
                    .then(async interaction_select_delete_warn => {
                        if (interaction_select_delete_warn.values[0] === `cancel`) return interaction_select_delete_warn.reply({ content: `command cancelled`, ephemeral: true });
                        const select_member_warn_record = await member_warn_record.find(x => { return x.reason === interaction_select_delete_warn.values[0] });
                        await select_member_warn_record.delete();
                        return interaction_select_delete_warn.reply({ content: `unwarn ${user.tag} successfully`, ephemeral: true });
                    })
                    .catch(() => {
                        return;
                    })
                return;
            }
            if (options.getSubcommand() === `ban`) {
                const member = options.getMember(`user`);
                const reason = options.getString(`reason`) || `no reason`;
                let id;
                if (member) {
                    try {
                        await member.ban({ reason: reason });
                        id = member.id;
                    } catch (error) {
                        console.error(error);
                        command_fail_interaction(interaction);
                    }
                } else {
                    const member_id = options.getString(`user_id`);
                    if (!member_id) return interaction.reply({ content: `Please select a user`, ephemeral: true });
                    const guild = await guild_f();
                    try {
                        await guild.members.ban(member_id, { reason: reason });
                        id = member_id;
                    } catch (error) {
                        console.error(error);
                        command_fail_interaction(interaction)
                    }
                }
                // record
                const moderator = interaction.user;
                const warn_record_data = await require(`../../mongoose/schema_warn_record`);
                await warn_record_data.create({
                    user_id: id,
                    user_tag: member?.user?.tag ?? `no tag`,
                    moderator_id: moderator.id,
                    moderator_tag: moderator.tag,
                    reason: reason,
                    timestamp: Date.now(),
                    ban: true
                })

                // delete warn list
                const warn_list = await require(`../../mongoose/schema_warnlist`);
                try {
                    await warn_list.findOneAndDelete({ id: user.id });
                } catch (error) {
                    console.error(error);
                }
                return interaction.reply({ content: `ban successfully`, ephemeral: true });
            }

            if (options.getSubcommand() === `unban`) {
                const id = options.getString(`user`);
                const guild = await guild_f();
                const reason = options.getString(`reason`) || `no reason`;
                try {
                    await guild.members.unban(id, reason);
                    interaction.reply({ content: `unban successfully`, ephemeral: true });
                } catch (error) {
                    console.error(error);
                    command_fail_interaction(interaction);
                }
            }
            if (options.getSubcommand() === `warn_list`) {
                const schema_warn_list = await require(`../../mongoose/schema_warnlist`);
                const warn_list = await schema_warn_list.find({ warns: { $gt: 0 } }).sort({ warns: -1 });
                if (options.getMember(`user`)) {
                    const user = options.getMember(`user`).user;
                    const schema_warn_record = await require(`../../mongoose/schema_warn_record`);
                    const user_record = await schema_warn_record.find({ user_id: user.id, ban: false }).sort({ timestamp: 1 });
                    if (user_record.length === 0) return interaction.reply({ content: `This member doesn't have any warning`, ephemeral: true });
                    let user_record_embed = [];
                    await user_record.map(async (element, index) => {
                        user_record_embed.push(`${index + 1}. ${element.reason}\nmoderator: ${element.moderator_tag}\ntimestamp: ${element.timestamp}`)
                    })
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new MessageEmbed({
                                title: `Warn record for ${user.tag}`,
                                description: user_record_embed.join(`\n\n`),
                                color: interaction.member.roles.color?.hexColor ?? `#FFFFFF`
                            })
                        ]
                    });
                }
                let warn_list_embed = [];
                await warn_list.map(async (element, index) => {
                    warn_list_embed.push(`${index + 1}. ${element.name}\nwarns: ${element.warns}`);
                });
                if (warn_list_embed.length === 0) return interaction.reply({ content: `Nobody got warned`, ephemeral: true });
                return interaction.reply({
                    ephemeral: true,
                    embeds: [
                        new MessageEmbed({
                            title: `Warn List`,
                            description: warn_list_embed.join(`\n\n`),
                            color: interaction.member.roles.color?.hexColor ?? `#FFFFFF`
                        })
                    ]
                });
            }
        } catch (error) {
            console.error(error)

        }
    }
}