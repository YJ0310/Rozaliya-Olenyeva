module.exports = (fs, client) => {
    const event_folder = fs.readdirSync(`./src/events`).filter(name => name.endsWith(`.js`));
    for (const event_file of event_folder) {
        const event = require(`../events/${event_file}`);
        if (event.once === true) {
            client.once(`${event_file.split(`.`)[0]}`, (...args) => event.execute(...args));
        }
        else
            client.on(`${event_file.split(`.`)[0]}`, (...args) => event.execute(...args));
    }
}