const { MessageEmbed } = require("discord.js");
const {starting_level_xp, xp_between_level} = require(`../../../config.json`);

module.exports = {
    name: `leaderboard`,
    description: `show the leaderboard`,
    category: `xp`,
    async execute(interaction, options) {
        const xp_lists = await require(`../../mongoose/schema_xp_list`);
        const member_lists = await xp_lists.find({}).sort({xp: -1});
        const member = interaction.member;
        const user = member.user;
        const member_data = member_lists.find( element => element.id === member.id);
        const rank = member_lists.indexOf(member_data) + 1;
        const page = options.getInteger(`page`) ?? Math.floor(rank / 10) + 1;
        // check whether the page is valid
        if(page > Math.floor(member_lists.length / 10) + 1) 
        try {
            
            return interaction.editReply({content: `Invalid page`, ephemeral: true});
        } catch (error) {
            console.error(error)
            
        }
        let pages = [];
        for (let index = 0; index < member_lists.length; index+=10) {
            pages.push(member_lists.slice(index, index + 9));
        }
        let leaderboard = [];
        pages[page - 1].forEach(async (member_lists_personal, ranking) => {
            const name = member_lists_personal.name;
            const rank = ranking + 1 + ((page - 1) * 10);
            const xp = Math.floor(member_lists_personal.xp);
            const level = member_lists_personal.level;
            const current_xp = Math.floor(xp - (((level - 1) / 2) * (2 * (starting_level_xp) + (level - 2) * xp_between_level)));
            const next_level_xp = ((starting_level_xp) + (level - 1) * xp_between_level);
            leaderboard.push(`${rank}. ${name}\nlevel: ${level}\nxp: ${current_xp}/${next_level_xp}`)
        });
        const embed = new MessageEmbed()
        .setAuthor({name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL({dynamic:true})})
        .setTitle(`Leaderboard (page ${page})`)
        .setDescription(leaderboard.join(`\n\n`))
        .setColor(interaction.member.roles.color?.hexColor ?? `#FFFFFF`)
        try {
            
            interaction.editReply({embeds: [embed], ephemeral: true});
        } catch (error) {
            console.error(error)
            
        }
    }
}