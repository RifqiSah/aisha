import { get } from 'superagent';

module.exports = {
    name: 'look',
    desc: 'Melihat HTML dari sebuah URL.',
    enable: true,
    regex: false,
    help: false,
    role: ['433870492378595329'],
    aliases: ['see'],
    usage: '[link]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        message.delete();
        const msgs = await message.channel.send(`Menunggu *respon* \`${args}\` ...`);

        await get(`http://sea.dragonnest.com/news/notice/all/${args}`)
            .then((res) => {
                msgs.edit(`Respon:\`\`\`${res.text.slice(635, 1000)}\`\`\``).then((msg: any) => { msg.delete({ timeout: 60000 }); });
            })
            .catch((err) => {
                client.logger.error(err);
                msgs.edit(`Uh oh, error tidak terduga:\`\`\`${err.status}: ${err.message}\`\`\``).then((msg: any) => { msg.delete({ timeout: 10000 }); });
            });
    },
};
