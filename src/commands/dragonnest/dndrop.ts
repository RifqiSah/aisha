import { CommandInteraction, AutocompleteInteraction } from 'discord.js';

import Command from '../../classes/command';
import { getExternalData, formatImageInInteraction, searchAutoComplete } from '../../helpers/function';


export default class DnDrop extends Command {
    constructor() {
        super({
            name: 'Melihat info drop rate dari sebuah item pada Dragon Nest.',
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