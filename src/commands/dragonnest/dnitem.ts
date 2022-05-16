import { get } from 'superagent';
import { getItemDatas, getItemTuner } from '../../helpers/dragonnest/divinitor';
import { formatTitleCase } from '../../helpers/function';
// import image from '../../lib/image';
import values from '../../lib/values';

module.exports = {
    name: 'dnitem',
    desc: 'Untuk memudahakan dalam mencari item yang terdapat pada Dragon Nest.\n\nNama item harus spesifik, tidak boleh umum.\nBenar: `Conversion Helmet`\nSalah: `Conversion\n\nCara melihat:\n1. Cari nama item untuk mendapatkan ID item.\n2. Jalankan kembali command ini dengan parameter ID item.',
    enable: true,
    regex: false,
    help: true,
    public: true,
    role: [],
    aliases: ['it'],
    usage: '[item ID]',
    cooldown: 0,
    func: async (client: any, message: any, args: any) => {
        const data: any = [];
        const itemName = args.join(' ');
        const maxItems = 25;

        if (!args.length) {
            return message.channel.send('Harap masukkan nama atau ID item!').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => {
                client.logger.error(err);
            });
        }

        const msgs = await message.channel.send(`Mencari item \`${itemName}\` ...`);

        if (!isNaN(itemName)) {
            return getItemDatas(client, msgs, itemName);
        }

        await get(`${values.divinitor_api}/items/search?lmin=0&lmax=100&cls=&g=&c=&t=&parts=&ex=1&name=${itemName}`)
            .then((res) => {
                data.push('```');

                const items = JSON.parse(res.text).items;
                if (items.length <= 0) {
                    return msgs.edit(`Item \`${itemName}\` tidak ditemukan!`);
                }

                if (items.length == 1) {
                    return getItemDatas(client, msgs, items[0].id);
                }

                for (const i in items) {
                    const item = items[i];
                    const index = parseInt(i) + 1;

                    data.push(`${index}: ${item.name.name} [${formatTitleCase(item.rank)}]`);

                    if (index === maxItems) {
                        data.push(`\n*) Hanya ${index} dari ${items.length} data yang ditampilkan. Dimohon untuk menggunakan nama item yang spesifik.`);
                        break;
                    }
                }

                data.push('\nSilahkan masukkan pilihan Anda:');
                data.push('```');

                msgs.edit(data)
                    .then(() => {
                        message.channel.awaitMessages((res: any) => message.content, {
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        }).then((collected: any) => {
                            const id = collected.first().content;
                            if (isNaN(id)) {
                                return message.channel.send(`\`${id}\` bukan merupakan angka! Mohon masukkan angka.`).then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
                            }

                            collected.first().delete();
                            getItemDatas(client, msgs, items[parseInt(id) - 1].id);
                        }).catch((collected: any) => {
                            message.channel.send('Waktu Anda telah habis, silahkan ulangi.').then((msg: any) => msg.delete({ timeout: 5000 })).catch((err: any) => client.logger.error(err));
                        });
                    })
                    .catch((err: any) => client.logger.error(err));
            })
            .catch((err) => {
                client.logger.error(err);
            });
    },
};
