const { guild_f } = require("./guild");

module.exports = {
    /**
     * @param {*} member 
     * @param {Array} permission_roles_id 
     */
    async permission_required_role(member, permission_roles_id) {
        const guild = await guild_f();
        const member_role = member.roles.cache.filter(role => permission_roles_id.includes(role.id));
        if(member_role.size === 0) return;
        return member_role;
    },
    async no_permission_reply(interaction) {
        interaction.editReply({content: `you don't have this permission`, ephemeral: true});
    }
};