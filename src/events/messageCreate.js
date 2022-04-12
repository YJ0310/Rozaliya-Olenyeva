const { MessageEmbed } = require("discord.js");
const { guild_message, dm_message, DM_For_Help_category_f } = require("../function/message_create");

module.exports = {
    async execute(message) {
        if (message.author.bot) return;
        const DM_for_help_category = await DM_For_Help_category_f();
        if (message.inGuild() === true && message.channel.parent === DM_for_help_category && message.channel.id !== `918740673111420978`) {
            guild_message(message);
            return;
        }
        if (message.inGuild() === false) {
            dm_message(message);
            return;
        }
    }
}