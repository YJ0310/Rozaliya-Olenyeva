const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: `level_role`,
    description: `give/remove a level_role`,
    category: `xp`,
    async execute(interaction, options) {
        try {
            let roles = [];
            const { level_special_roles } = require(`../../../config.json`);
            await level_special_roles.forEach(async level_special_role_id => {
                const level_special_role = await interaction.guild.roles.cache.get(level_special_role_id?.role);
                if (!level_special_role) return;
                roles.push({
                    label: level_special_role.name,
                    value: level_special_role.id
                });
            })
            const select_role = await interaction.reply({
                content: `Please select a role you want in 30 seconds`,
                ephemeral: true,
                fetchReply: true,
                components: [
                    new MessageActionRow({
                        components: [
                            new MessageSelectMenu({
                                customId: `select_a_role`,
                                placeholder: `Select a role`,
                                options: roles
                            })
                        ]
                    })
                ]
            });
            const user_selection_interaction = await select_role.awaitMessageComponent({ filter(reply_interaction) { return reply_interaction.user.id === interaction.user.id }, time: 30000, max: 1 }).catch(error => console.error(error));
            if (!user_selection_interaction) return;
            const role_require_id = await level_special_roles.find(x => { return x?.role === user_selection_interaction.values[0] });
            if (role_require_id.key && !interaction.member.roles.cache.get(role_require_id.key)) return user_selection_interaction.reply({ content: `You don't have the role`, ephemeral: true });
            if (options.getBoolean(`enable`) === true) {
                try {
                    interaction.member.roles.add(user_selection_interaction.values[0]);
                    return user_selection_interaction.reply({ content: `Role assigned`, ephemeral: true });
                } catch (error) {
                    console.error(error)
                }
            }
            if (options.getBoolean(`enable`) === false) {
                try {
                    interaction.member.roles.remove(user_selection_interaction.values[0]);
                    return user_selection_interaction.reply({ content: `Role deassigned`, ephemeral: true });
                } catch (error) {
                    console.error(error)
                }

            }
        } catch (error) {
            console.error(error)

        }
    }
};