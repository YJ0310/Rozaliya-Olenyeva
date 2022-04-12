module.exports = {
    name: `xp`,
    description: `modify xp`,
    category: `moderator`,
    async execute(interaction, options) {
        if (options.getSubcommand() === `edit`) {
            const give = options.getInteger(`give`) ?? 0;
            const remove = options.getInteger(`remove`) ?? 0;
            const xp_lists = await require(`../../mongoose/schema_xp_list`);
            const member = options.getMember(`user`);
            if (member.user.bot) 
            try {
                
                return interaction.editReply({ content: `User can't be bot`, ephemeral: true });
            } catch (error) {
                console.error(error)
                
            }
            let member_data = await xp_lists.findOne({ id: member.id });
            if (!member_data) {
                member_data = new xp_lists({
                    id: member.id,
                    name: member.user.tag,
                });
            }
            member_data.xp += give;
            member_data.xp -= remove;
            // avoid the xp < 0;
            if (member_data.xp < 0) member_data.xp = 0;
            member_data.save();
            try {
                interaction.editReply({ content: `edit completed`, ephemeral: true });
            } catch (error) {
                console.error(error)
                
            }
        }
        if (options.getSubcommand() === `clear`) {
            const xp_lists = await require(`../../mongoose/schema_xp_list`);
            const member = options.getMember(`user`);
            (member.user.bot) 
            try {
                
                return interaction.editReply({ content: `User can't be bot`, ephemeral: true });
            } catch (error) {
                console.error(error)
                
            }
            let member_data = await xp_lists.findOne({ id: member.id });
            if (!member_data) {
                member_data = new xp_lists({
                    id: member.id,
                    name: member.user.tag,
                });
            }
            member_data.xp = 0;
            member_data.save();
            try {
                interaction.editReply({ content: `cleared`, ephemeral: true });
            } catch (error) {
                console.error(error)
                
            }
        }
    }
}