const { guild_f } = require("../function/guild");


module.exports = {
    async level() {
        setInterval(async () => {
            const { xp_between_level, starting_level_xp } = require(`../../config.json`);
            const xp_list = await require(`../mongoose/schema_xp_list`);
            const guild = await guild_f();
            guild.members.fetch().then(async members => {
                members.forEach(async member => {
                    // filter the bot
                    if (member.user.bot) return;
                    // check the level for every members
                    await xp_list.findOne({ id: member.id }).then(async member_data => {
                        if (!member_data) {
                            member_data = await new xp_list({
                                id: member.id,
                                name: member.user.tag
                            });
                        }
                        let xp = Math.floor(member_data.xp);
                        let level = 1;
                        while (xp >= ((level / 2) * ((2 * starting_level_xp) + (level - 1) * xp_between_level))) {
                            level++;
                        };
                        if (member_data.level !== level) {
                            if (member_data.level < level) {
                                try {
                                    member.user.dmChannel.send(`Congradulations, you are now level ${level}`);
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                            member_data.level = level;
                        }
                        await member_data.save();
                    });
                });

            });
            // sort the data with xp
            await xp_list.find().sort({ id: -1 });
        }, 5000);

    }
}