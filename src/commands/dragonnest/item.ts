import { get } from 'superagent';

const dv_endpoint   = 'https://reference.dn.divinitor.com/api/server/sea/items';

module.exports = {
    name: 'item',
    desc: 'Untuk memudahakan dalam mencari item yang terdapat pada Dragon Nest.\n\nNama item harus spesifik, tidak boleh sangat umum.\nBenar: `Conversion Helmet`\nSalah: `Conversion\n\nPenggunaan:',
    enable: true,
    regex: false,
    help: false,
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
            await get(`${dv_endpoint}/${itemID}`)
                .then((res) => {
                    const item = JSON.parse(res.text);
                    if (!item) return msgs.edit(`Item \`${itemID}\` tidak ditemukan!`);

                    // item name
                    data.push(`__**${item.name.name}**__\n`);

                    // item description
                    data.push(`${item.desc.desc.replace(/<br\/>/g, '\n').replace(/<(.|\n)*?>/g, '').replace(/\[/g, '**[').replace(/\]/g, ']**')}\n`);
                    
                    data.push('**[Storage and Trading Info]**');
                    data.push(`\`Trade\`: ${item.canTrade ? 'yes' : 'no'}`);
                    data.push(`\`Cash Item\`: ${item.cashItem ? 'yes' : 'no'}`);
                    data.push(`\`Server Storage\`: ${item.canServerStorage ? 'yes' : 'no'}`);
                    data.push(`\`Stamp Count\`: ${item.unstampCount ? item.unstampCount : 0}\n`);

                    data.push('**[General Info]**');
                    data.push(`\`Gear Score\`: ${item.gearScore ? item.gearScore : 0}`);
                    data.push(`\`Level\`: ${item.level}`);
                    data.push(`\`Rarity\`: ${item.rank}`);

                    if (item.needClass.length > 0) {
                        const classes = item.needClass;

                        for (const i in classes) {
                            data.push(`\`Class\`: ${classes[i].displayName}`);
                        }
                    }

                    if (item.category) {
                        data.push(`\`Category\`: ${item.category.name}`);
                    }
                    
                    if (item.stats.length > 0) {
                        const stats = item.stats;

                        data.push('\n**[Stats]**');
                        data.push('```');
                        
                        for (const i in stats) {
                            data.push(`${stats[i].state}: ${stats[i].min}`);
                        }
                        
                        data.push('```');
                    }

                    if (item.potentials.length > 0) {
                        const potentials = item.potentials;

                        data.push('\n**[Potentials]**');
                        data.push('```');

                        for (const i in potentials) {
                            const states = potentials[i].states;
                            for (const j in states) {
                                data.push(`${states[j].state}: ${states[j].value}`);
                            }
                            
                            data.push(' ');
                        }

                        data.push('```');
                    }

                    msgs.edit(data).catch();
                })
                .catch((err) => {
                    msgs.edit(`Uh oh, error tidak terduga:\`\`\`${err.status}: ${err.message}\`\`\``).then((msg: any) => { msg.delete({ timeout: 10000 }); });
                });
        } else {
            await get(`${dv_endpoint}/search?p=0&sz=50&name=${itemID}`)
                .then((res) => {
                    data.push('```');

                    const items = JSON.parse(res.text).items;
                    if (items.length <= 0) return msgs.edit(`Item \`${itemID}\` tidak ditemukan!`);

                    for (const i in items) {
                        const item = items[i];

                        data.push(`[${item.id}]: ${item.name.name}`);
                    }

                    data.push('```');

                    msgs.edit(data).catch();
                })
                .catch((err) => {
                    msgs.edit(`Uh oh, error tidak terduga:\`\`\`${err.status}: ${err.message}\`\`\``).then((msg: any) => { msg.delete({ timeout: 10000 }); });
                });
        }
    },
};
