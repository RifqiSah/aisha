/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { get } from 'superagent';
import { formatNumber, formatTitleCase, combineState, formatState, formatPercent } from '../../helpers/function';
// import image from '../../lib/image';
import values from '../../lib/values';

export async function getItemDatas(client: any, message: any, itemID: number) {
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
            data.push(`Gear Score: ${formatNumber(item.gearScore ?? 0)}`);
            data.push(`Item Level: ${item.level}`);
            data.push(`Item Rarity: ${formatTitleCase(item.rank)}`);

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
                const stats = combineState(item.stats);

                data.push('**[Stats]**');
                data.push('```');

                for (const i in stats) {
                    const statName = stats[i].state;
                    const name = formatState(statName).name;
                    const num = statName.includes('PERCENT') ? formatPercent(stats[i].min) : formatNumber(stats[i].min);

                    data.push(`${name}: ${num}`);
                }

                data.push('```');
            }

            // item potentials
            if (item.potentials?.length) {
                const potentials = combineState(item.potentials, 'value');

                data.push('**[Additional Stat Options]**');

                for (const i in potentials) {
                    const states = potentials[i].states;

                    data.push(`\`\`\`[${formatPercent(potentials[i].rate)}]\n`);

                    for (const j in states) {
                        const statName = states[j].state;
                        const name = formatState(statName).name;
                        const num = statName.includes('PERCENT') ? formatPercent(states[j].value) : formatNumber(states[j].value);

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
                data.push(...tuner);
            }

            /*
            if (item.iconIndex) {
                const itemOverlayData = getSlotOverlay(item.rank, item.type.type);
                const itemIconData = getIconCoordinates(item.iconIndex);
                const imageOverlay = await image.renderImage(itemOverlayData.url, itemOverlayData.x, itemOverlayData.y, 51, 51);
                const imageItem = await image.renderImage(getItemIconPageUrl(itemIconData.page), itemIconData.x, itemIconData.y, 51, 51);
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

export async function getItemTuner(client: any, tunerID: number) {
    const data: any = [];

    await Promise.all([
        await get(`${values.divinitor_api}/items/tuner/${tunerID}`)
            .then(async (res) => {
                const tuner = JSON.parse(res.text);
                const items = tuner.items;

                data.push('**[Item Tuner]**```');

                Object.keys(items).forEach((key) => {
                    const item = items[key].originalItem;

                    data.push(`#${item.id}`);
                    data.push(`${item.name.name} [${formatTitleCase(item.rank)}]\n`);
                });

                data.push('```');
            })
            .catch((err) => {
                client.logger.error(err);
            })
    ]);

    return data;
}