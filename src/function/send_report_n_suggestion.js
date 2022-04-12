const { guild_f } = require("./guild");
const { channels } = require(`../../config.json`);
const { MessageEmbed } = require("discord.js");
const { get_config_data } = require("./config");

module.exports = {
    /**
     * 
     * @param {*} args 
     * @param {String} type "report" or "suggestion"
     */
    async send_report_n_suggestions(args, type) {
        const user = args.author;
        const content = args.content;
        const guild = await guild_f();
        const options = await channels.find(element => element.key === type);
        const channel = await guild.channels.cache.get(options.channel_id);
        // ready to send the channel
        let fields = [];
        if(type === `suggestion`) {
            fields = [{
                name: `Pending`,
                value: `Waiting for the decision of the admin`
            }]
        }
        const message = await channel.send({
            embeds: [
                new MessageEmbed({
                    title: options.title,
                    description: args.content,
                    color: options.color,
                    author: {
                        name: args.author.tag,
                        iconURL: args.author.displayAvatarURL({ dynamic: true })
                    },
                    fields: fields
                })
            ]
        })
        // react
        await message.react(`⬆`);
        await message.react(`⬇`);
    }
}