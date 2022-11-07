import * as cheerio from 'cheerio';
import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction, roleMention } from 'discord.js';

import Command from '../../classes/command';
import axios from '../../lib/axios';

const getHtml = async (url: string) => {
    const result = await axios.get(url);
    return result?.data;
};

export default class DnNews extends Command {
    constructor() {
        super({
            name: 'Mengirim news secara manual sesuai dengan id yg tertera.',
            command: 'dnnews',
            usage: '[sea/na] [id]',
            ownerOnly: true,
            registerSlashCommand: true,
            hasAutocomplete: true,
            slashCommandOptions: [
                {
                    name: 'server',
                    description: 'SEA / NA',
                    type: ApplicationCommandOptionType.String,
                    choices: [{ name: 'South East Asia', value: 'sea' }, { name: 'North America', value: 'na' }],
                },
                {
                    name: 'newsid',
                    description: 'News ID',
                    type: ApplicationCommandOptionType.Number,
                },
            ],
        });
    }

    async interact(interaction: CommandInteraction): Promise<void> {
        const msg: string[] = [];
        let url = '';
        let title = '';

        try {
            await interaction.deferReply();

            const server = interaction.options.get('server')?.value;
            const newsid = interaction.options.get('newsid')?.value;

            if (server === 'sea') {
                url = 'https://sea.dragonnest.com/news/notice/all';
            } else if (server === 'na') {
                url = 'https://us.dragonnest.com/news/notice/all';
            } else {
                throw new Error(`Server ${server} tidak ditemukan!`);
            }

            url = `${url}/${newsid}`;

            const buffer = await getHtml(url);
            const $ = cheerio.load(buffer);
            $('table.bbs_title').each((i, val1) => {
                $(val1).find('tr').each((j, val2) => {
                    $(val2).find('th').each((k, val3) => {
                        if ($(val3).attr('class') === 'category') title = `[${$(val3).text()}]`;
                        if ($(val3).attr('class') === 'subject') title = `${title} ${$(val3).text()}`;

                    });
                });
            });

            msg.push(roleMention('489292018628165633'));
            msg.push(`__**${title}**__\n`);
            msg.push(url);

            interaction.editReply({ content: msg.join('\n') });
        } catch (err: any) {
            await interaction.editReply({ content: `${err?.message} Mohon hanya gunakan data yg sudah disediakan!` });
            console.error(err);
        }
    }

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        null;
    }
}