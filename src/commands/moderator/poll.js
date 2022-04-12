const admin_mode_role = [];



const { MessageEmbed, Guild } = require(`discord.js`);
const { get_config_data } = require("../../function/config");

module.exports = {
    name: `poll`,
    description: `make a poll`,
    category: `common`,
    async execute(interaction, options) {
        try {
            
        if (!options) return;
        (async () => {
            let data = [];
            let answer = [`question`];
            let d;
            for (let i = 0; i < 10; i++) {
                answer.push(`choice${i + 1}`);
            };
            answer.forEach(x => {
                d = options.getString(x);
                if (d !== null) {
                    data.push(d);
                }
            })
            let channel = await get_config_data(`channels`, `poll_channel`).then(async x => {
                return interaction.guild.channels.cache.get(x.channel_id);
            });
            if(options.getBoolean(`default_channel`) === true) {
                channel = interaction.channel
            }
            // check whether the user can access the admin mode
            let adminKey = options.getBoolean(`admin`) || false;
            if(admin_mode_role.length > 0) {
                await admin_mode_role.forEach(async element => {
                    if(interaction.member.roles.cache.get(element) && adminKey === true)
                    adminKey = true
                })
            }
            const question = data.shift();
            const emoji = [
                `1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`, `7️⃣`, `8️⃣`, `9️⃣`, `🔟`
            ]
            const embed = new MessageEmbed()
                .setTitle(`Polls by ${interaction.member.nickname || interaction.user.username}`)
                .setDescription(`\*\*${question}\*\*\n\n${data.map((x, i) => `${emoji[i]} ${x}`).join(`\n`)}`)
                .addField(`Common Mode`, `Just for collecting idea`)
                .setColor(interaction.member.roles.color?.hexColor ?? `#FFFFFF`);
                if(adminKey && adminKey === true) {
                    embed.setFields([{
                        name: `Admin Mode`,
                        value: `Collect idea for the server`
                    }])
                }
            try {
                const msg = await channel.send({ embeds: [embed] });
                const reply = await interaction.reply({ content: `Poll Send`, ephemeral: true })
                let i = 0;
                while (i < data.length) {
                    await msg.react(`${emoji[i]}`);
                    i++;
                }
            } catch (err) {
                console.error(err);
            }
        })();
    } catch (error) {
        console.error(error)
        
    }
    }
}