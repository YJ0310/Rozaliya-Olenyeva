const client = require(`.`);
const { ok } = require("./src/events/ready");
const { guild_id } = require(`./config.json`);
const { temp_channel_id } = require("./src/function/voice_channel_check");
const { MessageButton, MessageActionRow, Interaction, MessageAttachment } = require("discord.js");
const { guild_f } = require("./src/function/guild");
const Canva = require(`canvas`);
const testing_channel_id = `958279724369592320`;

module.exports = async () => {
    try {
    //     const height = 1920;
    //     const width = 1080;
    //     const testing = Canva.createCanvas(width, height);
    //     const ctx = testing.getContext(`2d`);
    //     const gura_pic = await Canva.loadImage(`./src/picture/testing/gawr_gura_1080p.png`);
    //     ctx.fillRect(0, 0, width, height)
    //     ctx.globalAlpha = 0.8
    //     ctx.drawImage(gura_pic, 0, 0, width, height);
    //     ctx.fillStyle = `black`;
    //     ctx.globalAlpha = 0.5
    //     const frame = 100;
    //     ctx.fillRect(frame, frame, width - 2 * (frame), height - 2 * (frame));
    //     let y = frame + 200;
    //     for (let i = 0; i < 12; i++) {
    //         const task_placeholder = 80;
    //         const task_placeholder_space = 40;
    //         ctx.globalAlpha = 0.8;
    //         ctx.lineWidth = 10
    //         ctx.strokeRect(frame + 50, y, width - 2 * (frame + 50), task_placeholder);
    //         y += task_placeholder + task_placeholder_space;
    //     }
    //     ctx.font = `100pt Arial`
    //     ctx.fillStyle = `white`
    //     ctx.globalAlpha = 1
    //     ctx.textAlign = `center`
    //     ctx.fillText(`To do List`, width / 2, frame + 150)


    //     const guild = await guild_f();
    //     const testing_channel = await guild.channels.cache.get(testing_channel_id);
    //     await testing_channel.send({
    //         files: [
    //             new MessageAttachment(testing.toBuffer())
    //         ]
    //     })
    }
    catch (error) { console.error(error) };
}

