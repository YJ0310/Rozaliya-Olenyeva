const { Collection } = require("discord.js");

module.exports = (fs, client) => {
    client.commands = new Collection
    const command_folder = fs.readdirSync(`./src/commands`);
    for (const folder of command_folder) {
        const command_file = fs.readdirSync(`./src/commands/${folder}`).filter(name => name.endsWith(`.js`));
        for (const file of command_file) {
            const command = require(`../commands/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
}
}