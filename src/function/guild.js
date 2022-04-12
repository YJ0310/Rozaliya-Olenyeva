const client = require("../..");
const { guild_id } = require(`../../config.json`);

module.exports =
{
    guild_f() {
        const guild = client.guilds.fetch(guild_id).then(element => {
            return element;
        });
        return guild;
    }
}