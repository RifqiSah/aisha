import Jimp from 'jimp';
import { get } from 'superagent';
import func from '../../lib/function';
import values from '../../lib/values';

function getIconCoordinates(itemIconIndex: number) {
    const page = Math.floor(Number(itemIconIndex) / 200) + 1;
    const pageIdx = itemIconIndex % 200;
    const row = Math.floor(pageIdx / 10);
    const column = pageIdx % 10;
    const UNIT_SIZE = 50;

    const ret = {
        page: page,
        x: Math.max(UNIT_SIZE * column, 0),
        y: UNIT_SIZE * row,
        size: UNIT_SIZE
    };

    return ret;
}

function getItemIconPageUrl(page: number) {
    let pageStr;
    if (page < 10) {
        pageStr = '0' + page;
    } else {
        pageStr = page;
    }

    return `${values.divinitor_api}/dds/itemicon${pageStr}/png`;
}

function getSlotOverlay(rank: any, type: string) {
    const UNIT_SIZE = 52;
    const ret = {
        url: `${values.divinitor_api}/dds/uit_itemslotbutton_o.dds/png`,
        x: 0,
        y: 0,
    };

    const isWeap = type === 'WEAPON' || type === 'PARTS';

    if (rank === 'NORMAL' || rank === 0) {
        if (isWeap) {
            ret.x = 0 * UNIT_SIZE;
            ret.y = 0 * UNIT_SIZE;
        } else {
            ret.x = 2 * UNIT_SIZE;
            ret.y = 2 * UNIT_SIZE;
        }
    }
    
    if (rank === 'MAGIC' || rank === 1) {
        if (isWeap) {
            ret.x = 6 * UNIT_SIZE;
            ret.y = 1 * UNIT_SIZE;
        } else {
            ret.x = 0 * UNIT_SIZE;
            ret.y = 1 * UNIT_SIZE;
        }
    }
    
    if (rank === 'RARE' || rank === 2) {
        if (isWeap) {
            ret.x = 6 * UNIT_SIZE;
            ret.y = 2 * UNIT_SIZE;
        } else {
            ret.x = 6 * UNIT_SIZE;
            ret.y = 0 * UNIT_SIZE;
        }
    }

    if (rank === 'EPIC' || rank === 3) {
        if (isWeap) {
            ret.x = 7 * UNIT_SIZE;
            ret.y = 2 * UNIT_SIZE;
        } else {
            ret.x = 8 * UNIT_SIZE;
            ret.y = 3 * UNIT_SIZE;
        }
    }

    if (rank === 'UNIQUE' || rank === 4) {
        if (isWeap) {
            ret.x = 7 * UNIT_SIZE;
            ret.y = 3 * UNIT_SIZE;
        } else {
            ret.x = 0 * UNIT_SIZE;
            ret.y = 2 * UNIT_SIZE;
        }
    }

    if (rank === 'LEGENDARY' || rank === 5) {
        ret.x = 5 * UNIT_SIZE;
        ret.y = 3 * UNIT_SIZE;
    }

    if (rank === 'DIVINE' || rank === 6) {
        if (isWeap) {
            ret.x = 4 * UNIT_SIZE;
            ret.y = 1 * UNIT_SIZE;
        } else {
            ret.x = 1 * UNIT_SIZE;
            ret.y = 2 * UNIT_SIZE;
        }
    }

    if (rank === 'ANCIENT' || rank === 7) {
        ret.url = `${values.divinitor_api}/dds/uit_itemslotbutton.dds/png`;
        if (isWeap) {
            ret.x = 1 * UNIT_SIZE;
            ret.y = 3 * UNIT_SIZE;
        } else {
            ret.x = 0 * UNIT_SIZE;
            ret.y = 3 * UNIT_SIZE;
        }
    }

    return ret;
}

async function renderImage(overlayUrl: string, overlayX: number, overlayY: number, iconUrl: string, iconX: number, iconY: number) {
    const overlayImage = await Jimp.read(overlayUrl);
    overlayImage.crop(overlayX, overlayY, 51, 51);

    const iconImage = await Jimp.read(iconUrl);
    iconImage.crop(iconX, iconY, 51, 51);

    iconImage.composite(overlayImage, 0, 0);
    
    return await iconImage.getBufferAsync(Jimp.MIME_PNG);
}

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
            data.push(`__**[${item.id}] - ${item.name.name}**__\n`);

            // item description
            if (item.desc) {
                data.push(`${item.desc.desc.replace(/<br\/>/g, '\n').replace(/<(.|\n)*?>/g, '').replace(/\[/g, '**[').replace(/\]/g, ']**')}\n`);
            }
                    
            // storage and trading info
            data.push('**[Storage and Trading Info]**```');
            data.push(`Trade: ${item.canTrade ? 'yes' : 'no'}`);
            data.push(`Cash Item: ${item.cashItem ? 'yes' : 'no'}`);
            data.push(`Server Storage: ${item.canServerStorage ? 'yes' : 'no'}`);
            data.push(`Stamp Count: ${item.unstampCount ? item.unstampCount : 0}\n`);
            data.push('```');

            // general info
            data.push('**[General Info]**```');
            data.push(`Gear Score: ${item.gearScore ? item.gearScore : 0}`);
            data.push(`Minimum Level: ${item.level}`);
            data.push(`Rarity: ${item.rank.charAt(0).toUpperCase() + item.rank.slice(1).toLowerCase()}`);

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
                const stats = item.stats;

                data.push('**[Stats]**');
                data.push('```');
                        
                for (const i in stats) {
                    let name = stats[i].state;
                    let num = stats[i].min;

                    if (name.includes('PERCENT')) num = func.formatPercent(num);
                    else num = func.formatNumber(num);

                    name = func.formatState(name).name;

                    data.push(`${name}: ${num}`);
                }
                        
                data.push('```');
            }

            // item potentials
            if (item.potentials?.length) {
                const potentials = item.potentials;

                data.push('**[Potentials]**');
                data.push('```');

                for (const i in potentials) {
                    const states = potentials[i].states;
                            
                    for (const j in states) {
                        let name = states[j].state;
                        let num = states[j].value;
                                
                        if (name.includes('PERCENT')) num = func.formatPercent(num);
                        else num = func.formatNumber(num);
                                
                        name = func.formatState(name).name;

                        data.push(`${name}: ${num}`);
                    }
                            
                    data.push(' ');
                }

                data.push('```');
            }

            // dragon jewel slots
            if (item.gemslots) {
                data.push('**[Dragon Jewel]**```');

                data.push(`Attack: ${item.gemslots.offensive ? 'yes' : 'no'}`);
                data.push(`Defense: ${item.gemslots.defensive ? 'yes' : 'no'}`);
                data.push(`Skill: ${item.gemslots.skill ? 'yes' : 'no'}`);

                data.push('```');
            }

            if (item.iconIndex) {
                const itemIconCordinate = getIconCoordinates(item.iconIndex);
                const itemIconPage = getItemIconPageUrl(itemIconCordinate.page);
                const itemOverlayData = getSlotOverlay(item.rank, item.type.type);
                const itemIconOverlay = await renderImage(itemOverlayData.url, itemOverlayData.x, itemOverlayData.y, itemIconPage, itemIconCordinate.x, itemIconCordinate.y);

                message.channel.send('__**[Icon]**__', { files: [itemIconOverlay] }).catch((err: any) => client.logger.error(err));
            }

            message.edit(data).catch((err: any) => client.logger.error(err));
        })
        .catch((err) => {
            client.logger.error(err);
        });
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
        const msgs = await message.channel.send(`Mencari item \`${itemName}\` ...`);

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

                    data.push(`${parseInt(i) + 1}: ${item.name.name}`);

                    if (parseInt(i) === 24) {
                        data.push(`\n*) Data yang ditampilkan hanya 25 dari ${items.length}. Dimohon untuk menggunakan nama item yang spesifik.`);
                        break;
                    }
                }

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
