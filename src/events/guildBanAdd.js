module.exports = {
    async execute (ban) {
        const warn_record_list = await require(`../mongoose/schema_warn_record`);
        const ban_member_record = await warn_record_list.find({user_id: ban.user.id});
        await ban_member_record.forEach(async x => {await x.delete();});
    }
};