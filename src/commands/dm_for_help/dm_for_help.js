const { MessageEmbed } = require("discord.js");
const { DM_For_Help_category_f, embed_setup } = require("../../function/message_create");


module.exports = {
    name: `dm`,
    description: `dm for help`,
    category: `moderator`,
    async execute(interaction, options) {
        if (options.getSubcommand() === `close`) {
            const DM_for_help_category = await DM_For_Help_category_f()
            if (interaction.channel.parent !== DM_for_help_category || interaction.channel.name === `modmail`) {
                try {
                    interaction.reply({ content: `Invalid channel`, ephemeral: true });
                }
                catch {
                    error => {
                        console.error(error);
                    }
                }
                return 
            }
            interaction.channel.delete();
        }
        if (options.getSubcommand() === `open`) {
            // find the user
            const member = await options.getMember(`member`)
            const user = member.user;
            // check whether the user is a bot
            if (user.bot) {
                try {
                    interaction.reply({ content: `Invalid member`, ephemeral: true });
                }
                catch {
                    error => {
                        console.error();
                    }
                }
                return
            }
            // create a dm channel
            const { guild } = interaction;
            const DM_for_help_category = await DM_For_Help_category_f()
            // check whether the server have the channel
            let staff_channel = await guild.channels.cache.find(channel => channel.name === user.id);
            if (staff_channel) {
                try {
                    interaction.reply({ content: `Channel already opened <#${staff_channel.id}>`, ephemeral: true });
                }
                catch {
                    error => {
                        console.error();
                    }
                }
                return
            }
            staff_channel = await guild.channels.create(user.id, {
                parent: DM_for_help_category,
                topic: `Created for helping ${user.tag}`
            }).then(new_channel => { return new_channel });
            staff_channel.lockPermission = true;
            let embed = new MessageEmbed();
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
                    value: `\`\`\`Staff\`\`\``
                }
            ]);
            staff_channel.send({ embeds: [embed], ephemeral: false });

            // respond
            try {
                interaction.reply({ content: `Channel opened <#${staff_channel.id}>`, ephemeral: true });
            }
            catch {
                error => {
                    console.error();
                }
            }

        }
    }
};