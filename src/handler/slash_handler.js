const client = require(`../../index`);
const fs = require(`fs`);
const { Collection } = require("discord.js");
client.slashes = new Collection();

module.exports = () => {
    const slash_folder = fs.readdirSync(`./src/slashes`);
    for (const folder of slash_folder) {
        const slash_file = fs.readdirSync(`./src/slashes/${folder}`).filter(file => file.endsWith(`.js`));
        for (const file of slash_file) {
            const slash = require(`../slashes/${folder}/${file}`);
            client.slashes.set(slash.name, slash);
        }
    }
};