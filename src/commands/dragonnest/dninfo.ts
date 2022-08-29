import { CommandInteraction, AutocompleteInteraction } from 'discord.js';

import Command from '../../classes/command';
import { getExternalData, formatImageInInteraction, searchAutoComplete } from '../../helpers/function';

export default class DnInfo extends Command {
    constructor() {
        super({
            name: 'Melihat info hal-hal yang ada pada Dragon Nest.',
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