const client = require("../..");
const { guild_id } = require(`../../config.json`);
const { guild_f } = require("../function/guild");
const { get_config_data } = require("./config");
const temp_channel_data = get_config_data(`channels`, `temp_voice_channel`);
const temp_channel_id = temp_channel_data.channel_id;

module.exports = {
    temp_channel_id,
    temp_channel_check() {
        setInterval(async () => {
            // delete the nobody channel
            await client.guilds.fetch(guild_id).then(async guild => {
                const channels_data = await get_config_data(`channels`, `temp_voice_channel_category`);
                const channels_id = channels_data.channel_id;
                const channels = await guild.channels.cache.filter(channel => { return channel.parentId === channels_id });
                channels.forEach(async channel => {
                    const temp_channel_data = await get_config_data(`channels`, `temp_voice_channel`);
                    if (!channel.isVoice()) return;
                    if (channel.members.size > 0) return;
                    if (channel.id === temp_channel_data.channel_id) return;
                    setTimeout(async () => {
                        if (channel.members.size > 0) return;
                        channel.delete(`closing temp channel`);
                        try {
                            const temp_voice_channel_list = await require(`../mongoose/schema_temp_voice_channel`);
                            await temp_voice_channel_list.findOneAndDelete({ channel_id: channel.id });
                        } catch (error) {
                            console.error(error);
                        }
                    }, 1000);
                });
            })
            // delete the null data in mongodb
            const temp_voice_channel_list = await require(`../mongoose/schema_temp_voice_channel`);
            temp_voice_channel_list.find()
                .then(async temp_voice_channels_data => {
                    temp_voice_channels_data.forEach(async temp_voice_channel_data => {
                        const guild = await guild_f();
                        guild.channels.fetch(temp_voice_channel_data.channel_id)
                            .then()
                            .catch(async error => {
                                await temp_voice_channel_data.delete()
                            })
                    })
                })
                .catch(error => { console.error(error); });
        }, 3000);
    },
    async five_seconds_check() {
        setInterval(async () => {
            const xp_list = await require(`../mongoose/schema_xp_list`);
            const guild = await guild_f();
            guild.channels.cache.filter(channel => channel.isVoice()).forEach(async channel => {
                channel.members.forEach(async member => {
                    // filter the bot
                    if (member.user.bot) return;
                    let member_data = await xp_list.findOne({ id: member.id });
                    if (!member_data) {
                        member_data = new xp_list({
                            id: member.id,
                            name: member.user.tag,
                        });
                    };
                    // check the voice channel bonus
                    let channel_bonus = 0;
                    const { voice_channel_xp_bonus } = require(`../../config.json`);
                    const member_channel = await voice_channel_xp_bonus.find(x => { return x.channels?.includes(member.voice.channel.parentId) || x.channels?.includes(member.voice.channel.id); });
                    if (!member_channel) return;
                    channel_bonus = member_channel.key;
                    member_data.xp += await (((5 / 60) * (member_data.bonus + 1)) * channel_bonus * 2);
                    await member_data.save();
                });
            });
        }, 5000);
    },
};
