// import var from discord.js
const { MessageEmbed, Interaction, CommandInteraction, CommandInteractionOptionResolver } = require("discord.js");

// import var from other files
const { DM_For_Help_category_f, embed_setup } = require("../../function/message_create");


module.exports = {
    name: `dm`,
    description: `dm for help`,
    category: `moderator`,
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {CommandInteractionOptionResolver} options 
     * @returns 
     */
    async execute(interaction, options) {

        // command for "/dm close"
        if (options.getSubcommand() === `close`) {

            // input var
            const DM_for_help_category = await DM_For_Help_category_f()

            // filter the invalid channel
            if (interaction.channel.parent !== DM_for_help_category || interaction.channel.name === `modmail`) {
                try {
                    interaction.editReply({ content: `Invalid channel`, ephemeral: true });
                }
                catch {
                    error => {
                        console.error(error);
                    }
                }
                return 
            }
            // delete the channel
            interaction.channel.delete();
        }

        // command for "/dm open"
        if (options.getSubcommand() === `open`) {

            // find the user (input)
            const member = await options.getMember(`member`)

            // var user
            const user = member.user;

            // filter bot
            if (user.bot) {
                try {

                    // output for error
                    interaction.editReply({ content: `Invalid member`, ephemeral: true });
                }
                catch {
                    error => {
                        console.error();
                    }
                }
                return
            }

            // var guild and category
            const { guild } = interaction;
            const DM_for_help_category = await DM_For_Help_category_f()

            // check whether the server have the channel
            let staff_channel = await guild.channels.cache.find(channel => channel.name === user.id);
            if (staff_channel) {
                try {
                    // output for error
                    interaction.editReply({ content: `Channel already opened <#${staff_channel.id}>`, ephemeral: true });
                }
                catch {
                    error => {
                        console.error();
                    }
                }
                return
            }

            // create channel
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
                interaction.editReply({ content: `Channel opened <#${staff_channel.id}>`, ephemeral: true });
            }
            catch {
                error => {
                    console.error();
                }
            }

        }
    }
};