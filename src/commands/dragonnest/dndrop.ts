import { Message, CommandInteraction, AutocompleteInteraction } from 'discord.js';

import Command from '../../classes/command';
import { getExternalData, commandRecom, formatImageInMessage, sendMessage, formatData, formatDataAutocomplete, formatImageInInteraction, searchAutoComplete } from '../../helpers/function';
import config from '../../lib/config';

const list = formatData('dragonnest.dndrop');
const listAuto = formatDataAutocomplete('dragonnest.dndrop');

export default class DnDrop extends Command {
    constructor() {
        super({
            name: `Melihat info drop rate dari sebuah item pada Dragon Nest. Drop yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
            command: 'dndrop',
            usage: '[nama item]',
            registerSlashCommand: true,
            hasAutocomplete: true,
            slashCommandOptions: [
                {
                    name: 'keyword',
                    description: 'Nama Item / Info / Apapun',
                    type: 'STRING',
                    autocomplete: true,
                },
            ],
        });
    }

    async run(message: Message, args: string): Promise<void> {
        const item = (args.length ? args.toLowerCase() : 'null');
        const msg: string[] = [];

        const data = getExternalData('dragonnest.dndrop', item);
        if (!data) {
            msg.push(`Drop rate untuk item \`${item}\` tidak ditemukan!`);

            const recom = commandRecom('dndrop', item);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Drop rate untuk ${data.name}**__\n`);
            await formatImageInMessage(msg, message, data);
        }

        msg.push(`\nGunakan \`${config.BOT_PREFIX}help dndrop\` untuk melihat daftar drop yang tersedia.\n`);
        sendMessage(message, msg);
    }

    async interact(interaction: CommandInteraction): Promise<void> {
        const msg: string[] = [];

        try {
            await interaction.deferReply();

            const keyword = interaction.options.get('keyword')?.value;
            const data = getExternalData('dragonnest.dndrop', `${keyword}`);

            msg.push(`__**Drop rate untuk ${data.name}**__\n`);
            await formatImageInInteraction(msg, interaction, data);
        } catch (err) {
            console.error(err);
        }
    }

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        if (interaction.commandName !== this.command) return;

        const keyword = interaction.options.get('keyword')?.value ?? '';
        const search = await searchAutoComplete('dragonnest.dndrop', keyword as string);

        await interaction.respond(search);
    }
}