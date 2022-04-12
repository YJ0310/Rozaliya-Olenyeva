const client = require("../..");
const { guild_f } = require("./guild");

module.exports = {
    async check_warn_record() {
        setInterval(async () => {
            const warn_record_list = await require(`../mongoose/schema_warn_record`);
            const warn_list = await require(`../mongoose/schema_warnlist`);
            const guild = await guild_f();
            await guild.members.fetch().then(x => {
                x.forEach(async member => {
                    const member_warns = await warn_record_list.find({ user_id: member.id, ban: false });
                    // find member warn list
                    let member_warn_list = await warn_list.findOne({ id: member.id });
                    if (!member_warn_list) member_warn_list = await new warn_list({ id: member.id, name: member.user.tag })
                    member_warn_list.name = member.user.tag;
                    member_warn_list.warns = await member_warns.length;
                    await member_warn_list.save();
                    // check whether the warn >= 3
                    const ban_member = await warn_list.findOne({ id: member.id, warns: { $gte: 3 } });
                    if (ban_member) {
                        try {
                            await guild.members.ban(ban_member.id, { reason: `3 warnings` });
                            await warn_record_list.create({
                                user_id: ban_member.id,
                                user_tag: ban_member.name,
                                moderator_id: client.user.id,
                                moderator_tag: client.user.tag,
                                reason: `3 warnings`,
                                ban: true,
                                timestamp: Date.now()
                            })
                            await ban_member.delete()
                        } catch (error) {
                            console.error(error);
                        }

                        // record ban
                    }
                })
            })
        }, 5000);
    }
};