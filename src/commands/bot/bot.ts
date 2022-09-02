import { AutocompleteInteraction, CommandInteraction } from 'discord.js';

import Command from '../../classes/command';
import { delay } from '../../helpers/function';

export default class Bot extends Command {
    constructor() {
        super({
            name: 'Aisha top secret :).',
            command: 'bot',
            ownerOnly: true,
            registerSlashCommand: true,
            hasAutocomplete: true,
            slashCommandOptions: [
                {
                    name: 'type',
                    description: 'Commands type',
                    type: 'STRING',
                    choices: [{ name: 'Restart', value: 'restart' },],
                },
            ],
        });
    }

    async interact(interaction: CommandInteraction): Promise<void> {
        try {
            const type = interaction.options.get('type')?.value;
            switch (type) {
                case 'restart':
                    await interaction.reply({ content: 'Aisha akan dijalankan kembali. Mohon tunggu sejenak ya!', ephemeral: true });
                    await delay(5000);
                    process.kill(process.pid, 'SIGINT');
                    break;

                default:
                    interaction.reply({ content: 'Oh tidak!! Perintah itu tidak ditemukan!', ephemeral: true });
                    break;
            }
        } catch (err) {
            console.error(err);
        }
    }

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        null;
    }
}