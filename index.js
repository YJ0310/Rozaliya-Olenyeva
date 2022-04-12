const discord = require(`discord.js`);
const client = new discord.Client({
    intents: 98303
})
module.exports = client;

const { token, guild_id } = require(`./config.json`);
const fs = require(`fs`);
const handler_file = fs.readdirSync(`./src/handler`).filter(name => name.endsWith(`.js`));
for (const file of handler_file) {
    try {
        (async () => {
            await require(`./src/handler/${file}`)(fs, client);
        })();
    } catch (err) {
        console.error(err);
    }
}

const http = require('http');
http.createServer(function (req, res) {
    res.write("I'm alive"); res.end();
}).listen(8080);



client.login(token);