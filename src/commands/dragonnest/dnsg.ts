import { get } from 'superagent';
import { sendAndDelete, editAndDelete } from '../../helpers/bot';
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
            return sendAndDelete(message, 'Harap masukkan nama server!', 5000);
        }

        const msgs = await message.channel.send(`Menunggu \`${args}\` ...`);

        await get(`${values.aisha_api}/server_update/${args}`)
            .then((res) => {
                editAndDelete(msgs, `Sukses \`${args}\`! Respon:\`\`\`${res.text}\`\`\``, 50000);
            })
            .catch((err) => {
                client.logger.error(err);
            });
    },
};
