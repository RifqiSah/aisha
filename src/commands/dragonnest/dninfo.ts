import { Message, CommandInteraction, AutocompleteInteraction } from 'discord.js';

import Command from '../../classes/command';
import { getExternalData, commandRecom, formatImageInMessage, sendMessage, formatData, formatDataAutocomplete, formatImageInInteraction, searchAutoComplete } from '../../helpers/function';
import config from '../../lib/config';

const list = formatData('dragonnest.dninfo');
const listAuto = formatDataAutocomplete('dragonnest.dninfo');

export default class DnInfo extends Command {
    constructor() {
        super({
            name: `Melihat info hal-hal yang ada pada Dragon Nest. Info yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
            command: 'dninfo',
            usage: '[nama info]',
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
        const info = (args.length ? args.toLowerCase() : 'null');
        const msg: string[] = [];

        const data = getExternalData('dragonnest.dninfo', info);
        if (!data) {
            msg.push(`Info untuk \`${info}\` tidak ditemukan!`);

            const recom = commandRecom('dninfo', info);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Info untuk ${data.name}**__\n`);
            await formatImageInMessage(msg, message, data);
        }

        msg.push(`\nGunakan \`${config.BOT_PREFIX}help dninfo\` untuk melihat daftar info yang tersedia.\n`);
        sendMessage(message, msg);
    }

    async interact(interaction: CommandInteraction): Promise<void> {
        const msg: string[] = [];

        try {
            await interaction.deferReply();

            const keyword = interaction.options.get('keyword')?.value;
            const data = getExternalData('dragonnest.dninfo', `${keyword}`);

            msg.push(`__**Info untuk ${data.name}**__\n`);
            await formatImageInInteraction(msg, interaction, data);
        } catch (err) {
            console.error(err);
        }
    }

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        if (interaction.commandName !== this.command) return;

        const keyword = interaction.options.get('keyword')?.value ?? '';
        const search = await searchAutoComplete('dragonnest.dninfo', keyword as string);

        await interaction.respond(search);
    }
}