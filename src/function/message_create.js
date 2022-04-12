const { MessageEmbed, MessageSelectMenu } = require("discord.js");
const { channels } = require(`../../config.json`)
const { guild_f } = require("./guild");
;
let embed = new MessageEmbed()
    .setColor(`#FFFFFF`)
const embed_setup = (user, title = null, description = null, color) => {
    embed
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
    if (title !== null) {
        embed.setTitle(title);
    }
    if (description !== null) {
        embed.setTitle(description);
    }
    embed.setColor(color ?? `#FFFFFF`)
};
async function DM_For_Help_category_f() {
    const guild = await guild_f();
    const category_data = await channels.find(x => x.key === `dm_for_help_category`);
    const category = await guild.channels.cache.get(category_data.channel_id);
    return category;
}

module.exports = {
    async guild_message(message) {
        const guild = await guild_f();
        const user = await guild.members.fetch(message.channel.name).then(async (x) => {
            return x.user;
        });
        if (!user) {
            return message.reply({ content: `Invalid member`, ephemeral: false });
        }
        // check whether the user is a bot
        if (user.bot) return message.reply({ content: `Invalid member`, ephemeral: true });
        user.dmChannel.send(message.content).then(async () => {
            try {
                message.react(`✅`);
            } catch (error) {
                console.error(error);
            }
        });
    },
    async dm_message(message) {
        const user = message.author;
        const guild = await guild_f();
        const DM_for_help_category = await DM_For_Help_category_f();
        // check whether the user is our member or not
        const member = await guild.members.fetch(user.id).then(async (x) => {
            return x;
        });
        if (!member) return message.reply({ content: `You are not our server member. If you are, kindly contact the developers`, ephemeral: true });

        // open a channel for the user or find the channel if got
        let staff_channel = await guild.channels.cache.find(channel => channel.name === user.id);
        if (!staff_channel) {
            staff_channel = await guild.channels.create(user.id, {
                parent: DM_for_help_category,
                topic: `Created for helping ${user.tag}`
            }).then(new_channel => { return new_channel });
            staff_channel.lockPermission = true;
            embed_setup(
                user,
                `Information`,
                null,
                "BLUE"
            );
            const nickname = member.nickname ?? `-`
            embed.setFields([
                {
                    name: `Username`,
                    value: `\`\`\`${user.username}\`\`\``,
                    inline: true
                },
                {
                    name: `Tag`,
                    value: `\`\`\`${user.tag}\`\`\``,
                    inline: true
                },
                {
                    name: `Nick name`,
                    value: `\`\`\`${nickname}\`\`\``
                },
                {
                    name: `User ID`,
                    value: `\`\`\`${user.id}\`\`\``
                },
                {
                    name: `Open from`,
                    value: `\`\`\`User\`\`\``
                }
            ]);
            staff_channel.send({ embeds: [embed], ephemeral: false });
        }

        // send the message to the server
        staff_channel.send(message.content).then(async () => {
            try {
                message.react(`✅`);
            } catch (error) {
                console.error(error);
            }
        });
    },
    DM_For_Help_category_f,
    embed_setup
}