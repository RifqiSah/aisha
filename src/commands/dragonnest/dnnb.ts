import moment from 'moment';
import { get } from 'superagent';
import values from '../../lib/values';

module.exports = {
    name: 'dnnb',
    desc: 'Memberikan informasi untuk `Noblesse Buff` oleh VVIP1!',
    enable: false,
    regex: false,
    help: false,
    public: false,
    role: ['433870492378595329'],
    aliases: ['nb'],
    usage: '',
    cooldown: 60,
    func: async (client: any, message: any, args: any) => {
        message.delete();

        const data: any = [];
        const channel = message.guild.channels.cache.find((ch: any) => ch.id === '678739777700233216'); // noblesse info
        if (!channel) {
            return;
        }

        const msgs = await message.channel.send('Megambil data ...');

        await get(`${values.aisha_api}/nb`)
            .then((res) => {
                const nbdata = JSON.parse(res.text);

                if (Array.isArray(nbdata) && nbdata.length === 0) {
                    return msgs.edit('Belum ada informasi untuk Noblesse Buff!').then((msg: any) => msg.delete({ timeout: 10000 }));
                }

                for (const nbh in nbdata) {
                    const item = nbdata[nbh];
                    const everyday = item.everyday == true;

                    data.push(client.builder.rolemention('676221506346549251'));
                    data.push(`Noblesse Buff akan disebarkan oleh \`${item.name}\` (VVIP1) bertempat di \`${item.map}\` ${everyday ? '**setiap hari**' : `pada tanggal **${moment(item.date).format('DD-MMM-YYYY')}**`}, pukul **${item.time}** [GMT+8]`);
                    data.push(`<${item.image}>`);
                    data.push('\nKetik `.iam noblesse info` pada `#bot-spam` untuk mendapatkan informasi.');
                }

                channel.send(data.join('\n'));
                msgs.delete({ timeout: 5000 });
            })
            .catch((err) => {
                client.logger.error(err);
            });
    },
};
