import { Message, CommandInteraction, AutocompleteInteraction } from 'discord.js';

import Command from '../../classes/command';
import { getExternalData, commandRecom, formatImageInMessage, sendMessage, formatData, formatDataAutocomplete, formatImageInInteraction, searchAutoComplete } from '../../helpers/function';
import config from '../../lib/config';

const list = formatData('dragonnest.dnrate');
const listAuto = formatDataAutocomplete('dragonnest.dnrate');

export default class DnRate extends Command {
    constructor() {
        super({
            name: `Melihat info rate enhance, dan chance apapun (kecuali drop) pada Dragon Nest. Rate yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
            command: 'dnrate',
            usage: '[nama rate]',
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
        const rate = (args.length ? args.toLowerCase() : 'null');
        const msg: string[] = [];

        const data = getExternalData('dragonnest.dnrate', rate);
        if (!data) {
            msg.push(`Rate untuk \`${rate}\` tidak ditemukan!`);

            const recom = commandRecom('dnrate', rate);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Rate untuk ${data.name}**__\n`);
            await formatImageInMessage(msg, message, data);
        }

        msg.push(`\nGunakan \`${config.BOT_PREFIX}help dnrate\` untuk melihat daftar rate yang tersedia.\n`);
        sendMessage(message, msg);
    }

    async interact(interaction: CommandInteraction): Promise<void> {
        const msg: string[] = [];

        try {
            await interaction.deferReply();

            const keyword = interaction.options.get('keyword')?.value;
            const data = getExternalData('dragonnest.dnrate', `${keyword}`);

            msg.push(`__**Rate untuk ${data.name}**__\n`);
            await formatImageInInteraction(msg, interaction, data);
        } catch (err) {
            console.error(err);
        }
    }

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        if (interaction.commandName !== this.command) return;

        const keyword = interaction.options.get('keyword')?.value ?? '';
        const search = await searchAutoComplete('dragonnest.dnrate', keyword as string);

        await interaction.respond(search);
    }
}