const { MessageAttachment, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const complete_to_do_list_xp = require(`../../../config.json`).to_do_list.complete_to_do_list_xp;


module.exports = {
    name: `todo`,
    description: `to do list`,
    category:  `common`,
    async execute(interaction, options) {
        try {
            

        // const schema
        const to_do_list_schema = await require(`../../mongoose/schema_to_do_list`);

        // find user data
        let to_do_list = await to_do_list_schema.findOne({ id: interaction.user.id });

        // check whether user data is available
        if (!to_do_list) {
            to_do_list = await new to_do_list_schema({
                id: interaction.user.id,
                name: interaction.user.tag,
            })
        };

        // update user name
        to_do_list.name = interaction.user.tag;

        // save the data
        to_do_list.save();

        // map the to_do_list.task
        let tasks = to_do_list.tasks.map((task, index) => {
            if (task.complete && task.complete === true) {
                return `${index + 1} [ √ ] - ${task.task}`;
            }
            return `${index + 1} [ ] - ${task.task}`
        }).join(`\n`);

        // make the list
        let embed = {
            description: [
                `\*\*${to_do_list.quote}\*\*`,
                `\`\`\``,
                tasks,
                `\`\`\``
            ]
        }

        // output to do list panel
        try {
            interaction.editReply({content: `Done`})
            const to_do_list_panel = await interaction.channel.send({
                ephemeral: false,
                embeds: [
                    new MessageEmbed({
                        title: `${to_do_list.name}'s Todolist`,
                        description: embed.description.join(`\n`),
                        color: interaction.member.roles.color?.hexColor ?? `#FFFFFF`
                    })
                ],
                fetchReply: true,
                components: [
                    new MessageActionRow({
                        components: [

                            new MessageButton({
                                label: `help`,
                                style: `SECONDARY`,
                                customId: `help`
                            }),

                            new MessageButton({
                                label: `change_quote`,
                                style: `SECONDARY`,
                                customId: `quote`
                            }),

                            new MessageButton({
                                label: `refresh`,
                                style: `PRIMARY`,
                                customId: `refresh`
                            }),

                            new MessageButton({
                                label: `clear`,
                                style: `DANGER`,
                                customId: `clear`
                            }),

                            new MessageButton({
                                label: `cancel`,
                                style: `DANGER`,
                                customId: `cancel`
                            }),
                        ]
                    })
                ]
            });

            // check the interaction
            interaction.client.on(`interactionCreate`, async interaction => {
                if (interaction.isCommand() && (to_do_list_panel.channel.messages.cache.get(to_do_list_panel.id))) {
                    return to_do_list_panel.delete();
                }
            });

            // collect message
            const collector = to_do_list_panel.channel.createMessageCollector({ filter(x) { return x.author.id === interaction.user.id } })
            collector.on(`collect`, async message => {

                // get the data again
                to_do_list = await to_do_list_schema.findOne({ id: interaction.user.id });


                // check the message delete?
                if (!to_do_list_panel.channel.messages.cache.get(to_do_list_panel.id)) return;

                // check the message
                const content = message.content; // the content
                const args = content.trim().split(/ +/) // the arguments []

                // delete task?
                let delete_task = false;
                if (args[0].toLowerCase() === `c`) { args.shift(); delete_task = true; }; //c?
                const number = parseInt(args.shift());
                const task = args.join(` `) ?? null;

                // check number valid?
                if (number && (number < 1 || number > 12)) return message.reply(`Invalid number, number must between 1 and 12`);

                // stop edit/delete completed task
                if (number && (to_do_list.tasks[number - 1]?.complete && to_do_list.tasks[number - 1].complete === true) && !(args.length === 0 && delete_task === false && number)) return message.reply(`Can't set or delete completed task`);


                // command for set 
                if (args.length > 0) {
                    to_do_list.tasks[number - 1] = await { task: args.join(` `) };
                }

                // auto mode
                if (!number) {
                    await to_do_list.tasks.push({ task: message.content });
                }

                // command for complete
                if (args.length === 0 && delete_task === false && number) {

                    // get data
                    const xp_list_schema = await require(`../../mongoose/schema_xp_list`);

                    // find user data
                    let xp_list = await xp_list_schema.findOne({ id: interaction.user.id });

                    // data?
                    if (!xp_list) {
                        xp_list = await new xp_list_schema({
                            id: interaction.user.id
                        })
                    }

                    // update user tag
                    xp_list.name = interaction.user.tag;

                    // check complete?
                    let task_complete = to_do_list.tasks[number - 1]
                    if (!task_complete) return message.reply(`Invalid task`);
                    if (task_complete?.complete && task_complete.complete === true) {
                        // edit data
                        task_complete.complete = false;
                        // get xp
                        xp_list.xp -= complete_to_do_list_xp;
                    }
                    else {
                        // edit data
                        task_complete.complete = true;

                        // get xp
                        xp_list.xp += complete_to_do_list_xp;

                    }

                    // return the data
                    xp_list.save();
                    to_do_list.tasks[number - 1] = task_complete;
                }


                // command for delete
                if (args.length === 0 && delete_task === true && number) {
                    await to_do_list.tasks.splice(number - 1, 1);
                }

                // filter the blank data
                to_do_list.tasks = to_do_list.tasks.filter(x => { return x });

                // save the data
                if (to_do_list.tasks.length > 5) return message.reply(`You can only have 5 slots only. Press the help button under the panel to find how to get more slots`);
                to_do_list.save();

                // map the to_do_list.task
                tasks = to_do_list.tasks.map((task, index) => {
                    if (task.complete && task.complete === true) {
                        return `${index + 1} [ √ ] - ${task.task}`;
                    }
                    return `${index + 1} [ ] - ${task.task}`
                }).join(`\n`);

                // make the list
                embed = await {
                    description: [
                        `\*\*${to_do_list.quote}\*\*`,
                        `\`\`\``,
                        tasks,
                        `\`\`\``
                    ]
                }

                // set the to do list panel
                await to_do_list_panel.embeds[0].setDescription(embed.description.join(`\n`))

                // edit the to do list panel
                await to_do_list_panel.edit({
                    embeds: to_do_list_panel.embeds
                })

                // delete message
                await message.delete();

            })

            // collect button
            const button_collector = to_do_list_panel.createMessageComponentCollector({ filter(x) { return x.user.id === interaction.user.id } })
            button_collector.on(`collect`, async button_interaction => {

                button_interaction.deferReply({ephemeral: true});


                // input button command
                const buttonId = button_interaction.customId

                // help button
                if (buttonId === `help`) {

                    // description
                    let help_embeds = {
                        description: [
                            `\`\`\``,
                            `\*\*Arguments Infomation\*\*`,
                            `[] => mandatory argument`,
                            `<> => optional argument`,
                            ``,
                            `\*\*Task Information\*\*`,
                            `Normal version => 5 tasks`,
                            `Pro version => up to 12 tasks`,
                            ``,
                            `\*\*How to get Pro version?\*\* `,
                            `Get the specific roles in your server :>`,
                            `\`\`\``,
                        ],
                        fields: [
                            {
                                name: `Set a tasks`,
                                value: `<number> [your tasks]`
                            },
                            {
                                name: `Delete a tasks`,
                                value: `c [number]`
                            },
                            {
                                name: `Complete/Uncomplete a tasks (Complete task will get ${complete_to_do_list_xp})`,
                                value: `[number]`
                            },
                        ]
                    }

                    // output
                    try {
                        button_interaction.editReply({
                            ephemeral: true,
                            embeds: [
                                new MessageEmbed({
                                    title: `To do List Command List`,
                                    description: help_embeds.description.join(`\n`),
                                    fields: help_embeds.fields,
                                    color: interaction.member.roles.color?.hexColor ?? `#FFFFFF`
                                })
                            ]
                        });

                    } catch (error) {
                        console.error(error)

                    }
                }


                // cancel button
                if (buttonId === `cancel`) {

                    // delete the panel
                    return to_do_list_panel.delete();
                }

                // refresh button
                if (buttonId === `refresh`) {

                    // get data
                    let to_do_list = await to_do_list_schema.findOne({ id: interaction.user.id });


                    // save data
                    to_do_list.save();

                    // map the to_do_list.task
                    let tasks = to_do_list.tasks.map((task, index) => {
                        if (task.complete && task.complete === true) {
                            return `${index + 1} [ √ ] - ${task.task}`;
                        }
                        return `${index + 1} [ ] - ${task.task}`
                    }).join(`\n`);

                    // make the list
                    let embed = {
                        description: [
                            `\*\*${to_do_list.quote}\*\*`,
                            `\`\`\``,
                            tasks,
                            `\`\`\``
                        ]
                    }


                    try {
                        // refresh the panel
                        await to_do_list_panel.edit({
                            embeds: [to_do_list_panel.embeds[0].setDescription(embed.description.join(`\n`))]
                        })
                        button_interaction.editReply({
                            content: `refreshed`,
                            ephemeral: true
                        });
                    } catch (error) {
                        console.error(error);
                    }
                }

                // clear button
                if (buttonId === `clear`) {

                    // check the cooldown
                    if (to_do_list.clear_timestamp > Date.now()) return button_interaction.editReply({
                        content: `You already cleared your to do list. Please try again after <t:${Math.floor((to_do_list.clear_timestamp) / 1000)}:R>`,
                        ephemeral: true
                    });


                    // ask clear mode
                    const clear_mode_selection = await button_interaction.editReply({
                        content: `Please choose a mode you want in 30 seconds`,
                        components: [
                            new MessageActionRow({
                                components: [new MessageSelectMenu({
                                    customId: `clear_mode`,
                                    placeholder: `Please select a mode`,
                                    options: [
                                        {
                                            label: `clear finish`,
                                            value: `finish`
                                        },
                                        {
                                            label: `clear all`,
                                            value: `all`
                                        }
                                    ]

                                })]
                            })
                        ],
                        ephemeral: true,
                        fetchReply: true
                    });

                    // collector
                    const clear_mode_selection_collector = clear_mode_selection.createMessageComponentCollector({ filter(x) { return x.user.id === interaction.user.id }, max: 1, time: 30000 });
                    clear_mode_selection_collector.on(`collect`, async clear_mode_selection_interaction => {


                        // clear finish mode
                        if (clear_mode_selection_interaction.values[0] === `finish`) {

                            // clear finish
                            to_do_list.tasks = await to_do_list.tasks.filter(x => { return (!x.complete || x.complete === false) });
                        }

                        // clear all mode
                        if (clear_mode_selection_interaction.values[0] === `all`) {

                            // clear all
                            to_do_list.tasks = [];

                        }

                        // set cooldown
                        to_do_list.clear_timestamp = Date.now() + (1000 * 3600 * 20);

                        // save data
                        to_do_list.save();

                        // output
                        try {
                            // get data
                            let to_do_list = await to_do_list_schema.findOne({ id: interaction.user.id });


                            // save data
                            to_do_list.save();

                            // map the to_do_list.task
                            let tasks = to_do_list.tasks.map((task, index) => {
                                if (task.complete && task.complete === true) {
                                    return `${index + 1} [ √ ] - ${task.task}`;
                                }
                                return `${index + 1} [ ] - ${task.task}`
                            }).join(`\n`);

                            // make the list
                            let embed = {
                                description: [
                                    `\*\*${to_do_list.quote}\*\*`,
                                    `\`\`\``,
                                    tasks,
                                    `\`\`\``
                                ]
                            }


                            // refresh the panel
                            await to_do_list_panel.edit({
                                embeds: [to_do_list_panel.embeds[0].setDescription(embed.description.join(`\n`))]
                            })
                            await clear_mode_selection_interaction.editReply({
                                content: `clear ${clear_mode_selection_interaction.values[0]}`,
                                ephemeral: true
                            });
                        } catch (error) {
                            await clear_mode_selection_interaction.editReply({
                                content: `fail to refresh the panel`,
                                ephemeral: true
                            });
                        }
                    })
                }

                // change quote button
                if (buttonId === `quote`) {

                    // delete current panel to avoid error
                    await to_do_list_panel.delete();

                    // send message to collect input
                    const change_quote_reply = await button_interaction.editReply({
                        ephemeral: true,
                        content: `Please insert your new quote in 30 seconds or type \`cancel\` to cancel.`,
                        fetchReply: true
                    });

                    // message collector
                    const quote_collector = change_quote_reply.channel.createMessageCollector({ filter(x) { return x.author.id === interaction.user.id }, time: 30000, max: 1 });


                    // message collect event  
                    quote_collector.once(`collect`, async quote_message => {

                        // check the message
                        if (quote_message.content.toLowerCase() === `cancel`) {
                            await quote_message.reply({
                                embeds: [
                                    new MessageEmbed({
                                        title: `Command cancelled`,
                                        color: interaction.member.roles.color?.hexColor ?? `#FFFFFF`
                                    })
                                ], ephemeral: true
                            });
                            return quote_message.delete();
                        }

                        // get data
                        to_do_list = await to_do_list_schema.findOne({ id: interaction.user.id });

                        // change data
                        to_do_list.quote = quote_message.content;


                        // save the data
                        to_do_list.save();

                        // output
                        await quote_message.reply({
                            content: `Quote change to ${quote_message.content}`,
                            ephemeral: true
                        });

                        // delete the message
                        await quote_message.delete();




                    })
                }

            })
        } catch (error) {
            console.error(error)

        }
        return;
    } catch (error) {
        console.error(error)
        
    }

    }
};

// Start
// Get user
// Get database
// make the canva
// show the canva (ephemeral = false);
// awaitmessage
// add task => "<your task>"
    // finish task => "[number]"
    // edit task => "[number] <your task>"
    // clear finish => button
    // clear all button => button
    // get help => button
    // close => button
    // (all react will be message edit)