
const { member_role_id } = require(`../../../config.json`);

const { MessageComponentInteraction, ButtonInteraction, MessageActionRow, MessageButton } = require("discord.js");
const { default: mongoose } = require("mongoose");
const client = require("../../..");
const { command_fail_interaction } = require("../../function/command_fail");
module.exports = {
    name: `temp_channel`,
    description: `temporary channel settings`,
    category: `common`,
    async execute(interaction, options) {
        try {

            const temp_voice_channel_list = await require(`../../mongoose/schema_temp_voice_channel`);
            if (!interaction.member.voice.channel) {
                interaction.editReply({ content: `Please connect any voice channel in this server before using this command.`, ephemeral: true });
                return;
            }
            let temp_category = await require(`../../../config.json`).channels.find(x => {return x?.key === `temp_voice_channel_category`})
            temp_category = temp_category.channel_id;
            module.exports = temp_category;
            if (options.getSubcommand() === `open`) {
                const channel_name = await options.getString(`channel_name`) ?? `${interaction.user.tag} ch.`;
                try {
                    const member_channel = await temp_voice_channel_list.findOne({
                        owner_id: interaction.user.id,
                        owner_name: interaction.user.tag
                    });
                    if (member_channel) return interaction.editReply({ content: `You already open a temp channel`, ephemeral: true });
                    const temp_channel = await interaction.guild.channels.create(channel_name, {
                        parent: temp_category,
                        type: `GUILD_VOICE`,
                        userLimit: 2
                    }).then(async channel => {
                        await channel.lockPermissions();
                        await channel.permissionOverwrites.edit(interaction.member, {
                            'CONNECT': true
                        })
                        await interaction.member.voice.setChannel(channel)
                        await temp_voice_channel_list.create({
                            owner_id: interaction.user.id,
                            owner_name: interaction.user.tag
                        })
                        return channel;
                    });
                    await temp_voice_channel_list.findOneAndUpdate({ owner_id: interaction.user.id }, {
                        channel_id: temp_channel.id,
                        channel_name: temp_channel.name,
                    });
                    try {

                        interaction.editReply({ content: `channel opened`, ephemeral: true });
                    } catch (error) {
                        console.error(error)

                    }
                } catch (error){
                    console.error(error);
                    return command_fail_interaction(interaction);
                }
            };
            if (options.getSubcommand() === `close`) {
                const channel_list = await require(`../../mongoose/schema_temp_voice_channel`);
                const channel_data = await channel_list.findOne({ owner_id: interaction.user.id });
                // if no data
                if (!channel_data) return interaction.editReply({ content: `You don't have the temp channel`, ephemeral: true });
                const channel = await interaction.guild.channels.cache.get(channel_data.channel_id);
                try {
                    await channel.delete();
                    await channel_data.delete();
                    try {

                        interaction.editReply({ content: `channel deleted`, ephemeral: true });
                    } catch (error) {
                        console.error(error)

                    }
                } catch (error) {
                    console.error(error);
                    command_fail_interaction(interaction);
                }
            }
            if (options.getSubcommand() === `give`) {
                return interaction.editReply({ content: `this command is under maintainance`, ephemeral: true });
                // command close
                const giver = interaction.user;
                const taker = options.getMember(`user`).user;
                if (taker.bot) return interaction.editReply({ content: `Can't transfer temp channel to bot`, ephemeral: true });
                await temp_voice_channel_list.findOne({ owner_id: taker.id }).then(async x => {
                    if (x) { return interaction.editReply({ content: `You can't give someone who already have a temp channel`, ephemeral: true }) };
                    const channel_data = await temp_voice_channel_list.findOne({ owner_id: giver.id });
                    if (!channel_data) return interaction.editReply({ content: `You don't have a temp channel`, ephemeral: true });
                    try {
                        const button = new MessageActionRow({
                            components: [
                                new MessageButton({
                                    custom_id: `accept_button`,
                                    label: `accept`,
                                    style: `SUCCESS`,
                                }),
                                new MessageButton({
                                    custom_id: `reject_button`,
                                    label: `reject`,
                                    style: `DANGER`,
                                })
                            ]
                        })
                        taker.dmChannel.send({ content: `Hello, ${giver.tag} want to transfer his/her temp channel ownership to you. Please click the accept button in 1 minutes to complete the transferation`, components: [button] }).then(async (message) => {
                            interaction.editReply({ content: `Pending...`, ephemeral: true });
                            message.awaitMessageComponent(x => x.user.id === taker.id, { time: 2000 })
                                .then(async interaction_button => {
                                    if (interaction_button.customId === `accept_button`) {
                                        try {
                                            channel_data.owner_id = taker.id;
                                            channel_data.owner_name = taker.tag;
                                            await channel_data.save();
                                            interaction_button.reply({ content: `Transferation completed`, ephemeral: true });
                                            return interaction.channel.send({ content: `Channel gave`, ephemeral: true });
                                        } catch (error) {
                                            console.error(error);
                                            command_fail_interaction(interaction);
                                        }
                                    }
                                    else {
                                        interaction_button.reply({ content: `Transferation cancelled`, ephemeral: true });
                                        return interaction.channel.send({ content: `Transferation fail since taker reject`, ephemeral: true });
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                    message.edit({ content: `Transferation cancelled` });
                                    return interaction.channel.send({ content: `Transferation cancelled since the receiver don't accept`, ephemeral: true });
                                }
                                )
                        })
                    } catch (error) {
                        console.error(error);
                        return command_fail_interaction(interaction);
                    }
                });

            }
            if (options.getSubcommand() === `size`) {
                const size = options.getInteger(`number`)
                const channel_list = await require(`../../mongoose/schema_temp_voice_channel`);
                const channel_data = await channel_list.findOne({ owner_id: interaction.user.id });
                // if no data
                if (!channel_data) return interaction.editReply({ content: `You don't have the temp channel`, ephemeral: true });
                const channel = await interaction.guild.channels.cache.get(channel_data.channel_id);
                await channel.setUserLimit(size);
                try {

                    return interaction.editReply({ content: `User limit for <#${channel.id}> has set to ${size}`, ephemeral: true });
                } catch (error) {
                    console.error(error)

                }
            }
            if (options.getSubcommand() === `private`) {
                const private_permission_roles = await require(`../../../config.json`).temp_channel_settings.private;
                if (private_permission_roles.length > 0) {
                    const member_permission = interaction.member.roles.cache.filter(role => private_permission_roles.includes(role.id));
                    if (member_permission.length = 0) return interaction.editReply({ content: `You don't have this permission to run this command`, ephemeral: true });
                }
                const private = options.getBoolean(`enable`);
                const channel_list = await require(`../../mongoose/schema_temp_voice_channel`);
                const channel_data = await channel_list.findOne({ owner_id: interaction.user.id });
                // if no data
                if (!channel_data) return interaction.editReply({ content: `You don't have the temp channel`, ephemeral: true });
                const channel = await interaction.guild.channels.cache.get(channel_data.channel_id);
                if (private === true) {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                        "CONNECT": false
                    });
                    try {

                        return interaction.editReply({ content: `Enable private mod for <#${channel.id}>`, ephemeral: true });
                    } catch (error) {
                        console.error(error)

                    }
                }
                if (private === false) {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                        "CONNECT": true
                    });
                    try {

                        return interaction.editReply({ content: `Disable private mod for <#${channel.id}>`, ephemeral: true });
                    } catch (error) {
                        console.error(error)

                    }
                }
            }
            if (options.getSubcommand() === `secret`) {
                const secret_permission_roles = await require(`../../../config.json`).temp_channel_settings.secret;
                if (secret_permission_roles.length > 0) {
                    const member_permission = interaction.member.roles.cache.filter(role => secret_permission_roles.includes(role.id));
                    if (member_permission.length = 0) return interaction.editReply({ content: `You don't have this permission to run this command`, ephemeral: true });
                }
                const secret = options.getBoolean(`enable`);
                const channel_list = await require(`../../mongoose/schema_temp_voice_channel`);
                const channel_data = await channel_list.findOne({ owner_id: interaction.user.id });
                // if no data
                if (!channel_data) return interaction.editReply({ content: `You don't have the temp channel`, ephemeral: true });
                const channel = await interaction.guild.channels.cache.get(channel_data.channel_id);
                const member_role = await interaction.guild.roles.cache.get(member_role_id) ?? interaction.guild.roles.everyone;
                if (secret === true) {
                    await channel.permissionOverwrites.edit(member_role, {
                        "VIEW_CHANNEL": false
                    });
                    try {
                        return interaction.editReply({ content: `Enable secret mod for <#${channel.id}>`, ephemeral: true });

                    } catch (error) {
                        console.error(error)

                    }
                }
                if (secret === false) {
                    await channel.permissionOverwrites.edit(member_role, {
                        "VIEW_CHANNEL": true
                    });
                    try {
                        return interaction.editReply({ content: `Disable secret mod for <#${channel.id}>`, ephemeral: true });

                    } catch (error) {
                        console.error(error)

                    }
                }
            }
            if (options.getSubcommand() === `allow_user`) {
                const allow_user_permission_roles = await require(`../../../config.json`).temp_channel_settings.allow_user;
                if (allow_user_permission_roles.length > 0) {
                    const member_permission = interaction.member.roles.cache.filter(role => allow_user_permission_roles.includes(role.id));
                    if (member_permission.length = 0) return interaction.editReply({ content: `You don't have this permission to run this command`, ephemeral: true });
                }
                const channel_list = await require(`../../mongoose/schema_temp_voice_channel`);
                const channel_data = await channel_list.findOne({ owner_id: interaction.user.id });
                // if no data
                if (!channel_data) return interaction.editReply({ content: `You don't have the temp channel`, ephemeral: true });
                const channel = await interaction.guild.channels.cache.get(channel_data.channel_id);
                let amount = [];
                const permission = options.getBoolean(`enable`);
                for (i = 1; i <= 10; i++) {
                    const member = options.getMember(`user${i}`);
                    if (!member) break;
                    const member_role = await interaction.guild.roles.cache.get(member_role_id) ?? interaction.guild.roles.everyone;
                    if (permission === true) {
                        await channel.permissionOverwrites.edit(member, {
                            "CONNECT": true,
                            "VIEW_CHANNEL": true
                        });
                    }
                    if (permission === false) {
                        await channel.permissionOverwrites.edit(member, {
                            "CONNECT": false,
                            "VIEW_CHANNEL": false
                        });
                    }
                    amount++;
                }
                let action;
                if (permission === true) action = `Enable`;
                if (permission === false) action = `Disable`;
                try {
                    return interaction.editReply({ content: `${action} permission for ${amount} member(s)`, ephemeral: true });

                } catch (error) {
                    console.error(error)

                }
            }
        } catch (error) {
            console.error(error)

        }
    }
}