import { CommandInteraction } from 'discord.js';

import Command from '../../classes/command';
import { client } from '../../client';

export default class Ping extends Command {
    constructor() {
        super({
            name: 'Memeriksa latency API dan latency Aisha terhadap server Discord.',
            command: 'ping',
            registerSlashCommand: true,
            slashCommandOptions: [],
        });
    }

    async interact(interaction: CommandInteraction): Promise<void> {
        try {
            await interaction.deferReply();

            const ping = Math.abs(Date.now() - interaction.createdTimestamp);
            const choices = ['Ini adalah latency aku', 'Apakah baik-baik saja? Aku tidak dapat melihat!', 'Aku berharap ini tidak buruk!'];
            const response = choices[Math.floor(Math.random() * choices.length)];

            await interaction.editReply({ content: `${response}\nBot Latency: \`${ping}\`, API Latency: \`${Math.round(client.ws.ping)}\`` });
        } catch (err) {
            console.error(err);
        }
    }
}