const client = require(`../../index`);
const { token, guild_id } = require(`../../config.json`);
const { connect, schema_warnlist, schema_warn_record, connect_close } = require("../mongoose/mongoose");
const { temp_channel_check, five_seconds_check } = require("../function/voice_channel_check");
const { level } = require("../function/level");
const { check_warn_record } = require("../function/warn_record");
const {level_roles} = require("../function/level_roles");
async function guild_f () {
    const guild = await client.guilds.cache.get(guild_id);
    return guild;
}
module.exports = {
    once: true,
    async execute() {
        await connect();
        const warnlist = require(`../mongoose/schema_warnlist`);
        const warn_record = require(`../mongoose/schema_warn_record`);
        const guild = await guild_f();
        await guild.members.fetch().then((members) => {
            members.forEach(member => {
                if (member.user.bot) return;
                member.createDM();
                console.log(`${member.user.tag} dm opened`);
            });
        })

        client.user.setActivity(`bot for testing`, { type: `WATCHING` });

        await guild.commands.set(client.slashes).then(x => {console.log(`slash command for ${guild.name} set`)});

        
        await require(`../../testing`)();
        console.log(`bot ready`);
        
        // for add function
        temp_channel_check();
        five_seconds_check();
        level();
        level_roles();
        check_warn_record();
    },
    ok() {
        console.log(`ok`);
    }
}