import { get } from 'superagent';
import values from '../../lib/values';

module.exports = {
    name: 'dnsg',
    desc: 'Mengubah status server Dragon Nest.',
    enable: false,
    regex: false,
    help: false,
    public: false,
    role: ['433870492378595329'],
    aliases: [],
    usage: '[server ID]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        message.delete();

        if (!args.length) {
            return message.channel.send('Harap masukkan nama server!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        const msgs = await message.channel.send(`Menunggu \`${args}\` ...`);

        await get(`${values.aisha_api}/server_update/${args}`)
            .then((res) => {
                msgs.edit(`Sukses \`${args}\`! Respon:\`\`\`${res.text}\`\`\``).then((msg: any) => msg.delete({ timeout: 50000 }));
            })
            .catch((err) => {
                client.logger.error(err);
            });
    },
};
