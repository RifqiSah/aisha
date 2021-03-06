import { get } from 'superagent';

module.exports = {
    name: 'look',
    desc: 'Melihat HTML dari sebuah URL.',
    enable: true,
    regex: false,
    help: false,
    public: true,
    role: [],
    aliases: ['see'],
    usage: '[link]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        message.delete();
        const msgs = await message.channel.send(`Menunggu *respon* \`${args}\` ...`);

        await get(`http://sea.dragonnest.com/news/notice/all/${args}`)
            .then((res) => {
                msgs.edit(`Respon:\`\`\`${res.text.slice(635, 1000)}\`\`\``).then((msg: any) => msg.delete({ timeout: 60000 }));
            })
            .catch((err) => {
                client.logger.error(err);
            });
    },
};
