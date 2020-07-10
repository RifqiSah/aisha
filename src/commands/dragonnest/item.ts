import { get } from 'superagent';
import func from '../../lib/function';
import values from '../../lib/values';

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
        const msgs = await message.channel.send('Megambil data ...');
        const itemID = args.join(' ');
        const isItemID = !isNaN(itemID);

        if (isItemID) {
            await get(`${values.divinitor_api}/items/${itemID}`)
                .then((res) => {
                    const item = JSON.parse(res.text);
                    if (!item) {
                        return msgs.edit(`Item \`${itemID}\` tidak ditemukan!`);
                    }

                    // item name
                    data.push(`__**${item.name.name}**__\n`);

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

                        data.push('\n**[Stats]**');
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

                    msgs.edit(data).catch((err: any) => client.logger.error(err));
                })
                .catch((err) => {
                    client.logger.error(err);
                });
        } else {
            await get(`${values.divinitor_api}/items/search?p=0&sz=50&name=${itemID}`)
                .then((res) => {
                    data.push('```');

                    const items = JSON.parse(res.text).items;
                    if (items.length <= 0) {
                        return msgs.edit(`Item \`${itemID}\` tidak ditemukan!`);
                    }

                    for (const i in items) {
                        const item = items[i];

                        data.push(`[${item.id}]: ${item.name.name}`);

                        if (parseInt(i) === 24) {
                            data.push(`\n*) Data yang ditampilkan hanya 25 dari ${items.length}. Dimohon untuk menggunakan nama item yang spesifik.`);
                            break;
                        }
                    }

                    data.push('```');

                    msgs.edit(data).catch((err: any) => client.logger.error(err));
                })
                .catch((err) => {
                    client.logger.error(err);
                });
        }
    },
};
