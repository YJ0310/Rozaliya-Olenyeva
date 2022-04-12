const { command_fail_interaction } = require("../function/command_fail");
const { permissions } = require(`../../config.json`);
const { user } = require("../..");

module.exports = {
    async execute(interaction) {
        if (interaction.user.bot) return;

        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction?.command?.name);
            if (!command) {
                interaction.editReply({ content: `Invalid command`, ephemeral: true });;
                return;
            }
            const options = interaction.options;
            
            
            // check the permission (if got)
            const permission_roles = permissions.find(element => element?.key === command.name);
            if (permission_roles && permission_roles.roles.size > 0) {
                const member_role = interaction.member.roles.cache.filter(role => {return permission_roles.roles.includes(role.id)});
                if (member_role.size === 0 && !interaction.memberPermissions.has(`ADMINISTRATOR`)) return interaction.editReply({content: `You don't have this permission`, ephemeral: true});;
            }
            
            // check the channel permission
            if(!interaction.member.permissionsIn(interaction.channel).has([`VIEW_CHANNEL`,`SEND_MESSAGES`])) return interaction.editReply({content: `You don't have the permission to use this command in this channel. Please use another channel`, ephemeral: true});
            
            try {
                await interaction.deferReply({ephemeral:true});
                command.execute(interaction, options)
            } catch (err) {
                console.error(err);
                command_fail_interaction(interaction);
            }
        }
    }
}