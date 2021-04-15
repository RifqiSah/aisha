import { get } from 'superagent';

module.exports = {
    name: 'cron',
    desc: 'Menjalankan cron job milik Alriftech.',
    enable: true,
    regex: false,
    help: false,
    public: false,
    role: ['433870492378595329'],
    aliases: ['cr'],
    usage: '[nama]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        message.delete();
        const msgs = await message.channel.send(`Menunggu *cron* \`${args}\` ...`);

        await get(`https://alriftech.com/cron/${args}`)
            .then((res) => {
                msgs.edit(`Sukses *cron* \`${args}\`! Respon:\`\`\`${res.text}\`\`\``).then((msg: any) => msg.delete({ timeout: 5000 }));
            })
            .catch((err) => {
                client.logger.error(err);
            });
    },
};
