const { guild_f } = require("../function/guild");


module.exports = {
    async level_roles() {
        setInterval(async () => {
            try {
                const xp_list = await require(`../mongoose/schema_xp_list`);
                const guild = await guild_f();
                // check the roles
                const { level_roles } = require(`../../config.json`);
                await xp_list.find().then(async members_data => {
                    members_data.forEach(async member_data => {
                        const member = await guild.members.fetch(member_data.id).catch(error => {console.error(error);});
                        if(!member) return xp_list.findOne({id: member_data.id}).remove();
                        for (const level_role of level_roles) {
                            const role = await guild.roles.cache.get(level_role.role);
                            // check the role can assign
                            if (member_data.level >= level_role.key && !member.roles.cache.has(role.id)) {
                                // try assign the role
                                try {
                                    await member.roles.add(role, `level up`);
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                            // check the role can deassign
                            if (((member_data.level < level_role.key) || (level_role.max_level && (member_data.level > level_role.max_level))) && (member.roles.cache.has(role.id))) {
                                // try deassign the role
                                try {
                                    await member.roles.remove(role, `level down`);
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                            await member_data.save();
                        }
                    });
                });
            } catch (error) {
                console.error(error)
            }
        }, 10000);

    }
}