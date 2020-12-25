import { get } from 'superagent';
import func from '../../lib/function';
import image from '../../lib/image';
import values from '../../lib/values';

async function getItemDatas(client: any, message: any, itemID: number) {
    const data: any = [];

    message.edit(`Mengambil data item \`${itemID}\` ...`);

    await get(`${values.divinitor_api}/items/${itemID}`)
        .then(async (res) => {
            const item = JSON.parse(res.text);
            if (!item) {
                return message.edit(`Item \`${itemID}\` tidak ditemukan!`);
            }

            // item name
            data.push(`__**${item.name.name}**__\n`);

            // item description
            if (item.desc) {
                data.push(`${item.desc.desc.replace(/<br\/>/g, '\n').replace(/<(.|\n)*?>/g, '').replace(/\[/g, '**[').replace(/\]/g, ']**')}\n`);
            }

            // location
            if (item.gainText) {
                data.push(`${item.gainText.replace(/<br\/>/g, '\n').replace(/<(.|\n)*?>/g, '').replace(/\[/g, '**[').replace(/\]/g, ']**')}\n`);
            }

            // general info
            data.push('**[General Info]**```');
            data.push(`Item ID: ${item.id}`);
            data.push(`Source Table: ${item.ownerTable}`);
            data.push(`Gear Score: ${func.formatNumber(item.gearScore ?? 0)}`);
            data.push(`Item Level: ${item.level}`);
            data.push(`Item Rarity: ${func.formatTitleCase(item.rank)}`);

            // class
            if (item.needClass?.length) {
                const classes = item.needClass;

                for (const i in classes) {
                    data.push(`Class: ${classes[i].displayName}`);
                }
            }

            // category
            if (item.category) {
                data.push(`Category: ${item.category.name}`);
            }

            data.push('```');

            // item stats
            if (item.stats?.length) {
                const stats = func.combineState(item.stats);

                data.push('**[Stats]**');
                data.push('```');

                for (const i in stats) {
                    const statName = stats[i].state;
                    const name = func.formatState(statName).name;
                    const num = statName.includes('PERCENT') ? func.formatPercent(stats[i].min) : func.formatNumber(stats[i].min);

                    data.push(`${name}: ${num}`);
                }

                data.push('```');
            }

            // item potentials
            if (item.potentials?.length) {
                const potentials = func.combineState(item.potentials, 'value');

                data.push('**[Additional Stat Options]**');

                for (const i in potentials) {
                    const states = potentials[i].states;

                    data.push(`\`\`\`[${func.formatPercent(potentials[i].rate)}]\n`);

                    for (const j in states) {
                        const statName = states[j].state;
                        const name = func.formatState(statName).name;
                        const num = statName.includes('PERCENT') ? func.formatPercent(states[j].value) : func.formatNumber(states[j].value);

                        data.push(`${name}: ${num}`);
                    }

                    data.push('```');
                }
            }

            // dragon jewel slots
            if (item.gemslots) {
                data.push('**[Dragon Jewel Slots]**```');

                data.push(`Can Use Offensive Jade? ${item.gemslots.offensive ? 'Yes' : 'No'}`);
                data.push(`Can Use Defensive Jde? ${item.gemslots.defensive ? 'Yes' : 'No'}`);
                data.push(`Can Use Skill Jade? ${item.gemslots.skill ? 'Yes' : 'No'}`);

                data.push('```');
            }

            // storage and trading info
            data.push('**[Storage and Trading Info]**```');
            data.push(`Can Trade? ${item.canTrade ? 'Yes' : 'No'}`);
            data.push(`Cash Item? ${item.cashItem ? 'Yes' : 'No'}`);
            data.push(`Can Use Server Storage? ${item.canServerStorage ? 'Yes' : 'No'}`);
            data.push(`Unstamp Count: ${item.unstampCount ? item.unstampCount : 0} time(s).\n`);
            data.push('```');

            // item tuner
            if (item.type?.type === 'ITEM_TUNER') {
                const tuner = await getItemTuner(client, item.type.changeMatchingId);
                data.push(tuner);
            }

            /*
            if (item.iconIndex) {
                const itemOverlayData = func.getSlotOverlay(item.rank, item.type.type);
                const itemIconData = func.getIconCoordinates(item.iconIndex);
                const imageOverlay = await image.renderImage(itemOverlayData.url, itemOverlayData.x, itemOverlayData.y, 51, 51);
                const imageItem = await image.renderImage(func.getItemIconPageUrl(itemIconData.page), itemIconData.x, itemIconData.y, 51, 51);
                const itemIconOverlay = await image.renderImageComposite(imageOverlay, imageItem);

                message.channel.send('__**[Icon]**__', { files: [itemIconOverlay] }).catch((err: any) => client.logger.error(err));
            }
            */

            message.edit(data).catch((err: any) => client.logger.error(err));
        })
        .catch((err) => {
            client.logger.error(err);
        });
}

async function getItemTuner(client: any, tunerID: number) {
    const data: any = [];

    await Promise.all([
        await get(`${values.divinitor_api}/items/tuner/${tunerID}`)
            .then(async (res) => {
                const tuner = JSON.parse(res.text);

                data.push('**[Item Tuner]**');
                data.push(`ID: ${tuner.id}`);

                const items = tuner.items;
                const itemKeys = Object.keys(items);

                for(const i in itemKeys) {
                    const item = items[i].originalItem;

                    data.push(`#${item.id}`);
                    data.push(`${item.name.name} [${func.formatTitleCase(item.rank)}]\n`);
                }
            })
            .catch((err) => {
                client.logger.error(err);
            })
    ]);

    return data;
}

module.exports = {
    name: 'item',
    desc: 'Untuk memudahakan dalam mencari item yang terdapat pada Dragon Nest.\n\nNama item harus spesifik, tidak boleh umum.\nBenar: `Conversion Helmet`\nSalah: `Conversion\n\nCara melihat:\n1. Cari nama item untuk mendapatkan ID item.\n2. Jalankan kembali command ini dengan parameter ID item.',
    enable: true,
    regex: false,
    help: true,
    role: ['489292018628165633'],
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

        await get(`${values.divinitor_api}/items/search?p=0&sz=50&name=${itemName}`)
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

                    data.push(`${index}: ${item.name.name} [${func.formatTitleCase(item.rank)}]`);

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
