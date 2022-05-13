// import var from discord.js
const discord = require(`discord.js`);

// new var "client"
const client = new discord.Client({

    // set intent, 98303 means have all permissions
    intents: 98303
})

// export the client var
module.exports = client;

// import var from config.json
const { token, guild_id } = require(`./config.json`);

// import var from filesystem (fs)
const fs = require(`fs`);

// new var
const handler_file = fs.readdirSync(`./src/handler`).filter(name => name.endsWith(`.js`));

// for loop
for (const file of handler_file) {
    try {
        (async () => {

            // run files in handler
            await require(`./src/handler/${file}`)(fs, client);
        })();
    } catch (err) {
        console.error(err);
    }
}

// code for host in replit
// import var from http
const http = require('http');

// create server
http.createServer(function (req, res) {
    res.write("I'm alive"); res.end();
}).listen(8080); // listen port 8080


// login the application
client.login(token);