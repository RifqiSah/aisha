import {  CommandInteraction, AutocompleteInteraction, ApplicationCommandOptionType } from 'discord.js';

import Command from '../../classes/command';
import { getExternalData, formatImageInInteraction, searchAutoComplete } from '../../helpers/function';

export default class DnRate extends Command {
    constructor() {
        super({
            name: 'Melihat info rate enhance, dan chance apapun (kecuali drop) pada Dragon Nest.',
            command: 'dnrate',
            usage: '[nama rate]',
            registerSlashCommand: true,
            hasAutocomplete: true,
            slashCommandOptions: [
                {
                    name: 'keyword',
                    description: 'Nama Item / Info / Apapun',
                    type: ApplicationCommandOptionType.String,
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
            const data = getExternalData('dragonnest.dnrate', `${keyword}`);

            msg.push(`__**Rate untuk ${data.name}**__\n`);
            await formatImageInInteraction(msg, interaction, data);
        } catch (err) {
            await interaction.reply({ content: 'Data tidak ditemukan! Mohon hanya gunakan data yg sudah disediakan!', ephemeral: true });
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