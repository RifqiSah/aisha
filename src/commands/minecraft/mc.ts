/* eslint-disable no-case-declarations */

import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction, Message } from 'discord.js';
import { Client as Exaroton } from 'exaroton';

import Command from '../../classes/command';
import config from '../../lib/config';
import { logger } from '../../lib/logger';
import values from '../../lib/values';

const status = (id: any) => {
    if (id === 0) return 'OFFLINE';
    else if (id === 1) return 'ONLINE';
    else if (id === 2) return 'STARTING';
    else if (id === 3) return 'STOPPING';
    else if (id === 4) return 'RESTARTING';
    else if (id === 5) return 'SAVING';
    else if (id === 6) return 'LOADING';
    else if (id === 7) return 'CRASHED';
    else if (id === 8) return 'PENDING';
    else if (id === 10) return 'PREPARING';
    else return 'UNKNOWN';
};

export default class Mc extends Command {
    constructor() {
        super({
            name: 'Control panel untuk Minecraft Server.',
            command: 'mc',
            roles: ['802718208180092939'],
            usage: '[cmd]',
            onlyInformate: true,
            registerSlashCommand: true,
            hasAutocomplete: true,
            slashCommandOptions: [
                {
                    name: 'cmd',
                    description: 'info / start / stop / restart',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                },
            ],
        });
    }

    async interact(interaction: CommandInteraction): Promise<void> {
        try {
            await interaction.deferReply();

            const timeout = 1000;
            const mcClient = new Exaroton(config.MC_TOKEN || '');
            let server = mcClient.server(values.mc_server_id);
            let refreshId: any = null;

            const cmd = interaction.options.get('cmd')?.value;
            switch (cmd) {
                case 'start':
                    await server.start();

                    refreshId = setInterval(async () => {
                        server = await server.get();
                        if (server.hasStatus(server.STATUS.OFFLINE)) {
                            await interaction.editReply({ content: 'Server telah dinyalakan! Selamat bermain 😃' });
                            clearInterval(refreshId);
                        }
                    }, timeout);

                    break;

                case 'stop':
                    await server.stop();

                    refreshId = setInterval(async () => {
                        server = await server.get();
                        if (server.hasStatus(server.STATUS.OFFLINE)) {
                            await interaction.editReply({ content: 'Server telah dimatikan! Terima kasih telah bermain 😃' });
                            clearInterval(refreshId);
                        }
                    }, timeout);

                    break;

                case 'restart':
                    await server.stop();

                    refreshId = setInterval(async () => {
                        server = await server.get();
                        if (server.hasStatus(server.STATUS.ONLINE)) {
                            await interaction.editReply({ content: 'Server telah direstart! Selamat melanjutkan permainan 😃' });
                            clearInterval(refreshId);
                        }
                    }, timeout);

                    break;

                case 'info':
                    server = await server.get();

                    await interaction.editReply({ content: [
                        `__**${server.name.toUpperCase()}**__`,
                        `${server.motd}`,

                        '\n__**Software**__',
                        `Name: ${server.software.name}`,
                        `Version: ${server.software.version}`,

                        '\n__**Server**__',
                        `Status: __**${status(server.status)}**__`,
                        `Players: ${server.players.count}/${server.players.max}`,
                    ].join('\n') });

                    break;

                default:
                    await interaction.editReply({ content: 'Oh tidak!! Perintah itu tidak ditemukan!' });
                    break;
            }
        } catch (err: any) {
            await interaction.editReply({ content: `${err?.message}!` });
            logger.warn(err?.message);
        }
    }

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        if (interaction.commandName !== this.command) return;

        let result = [
            'start',
            'stop',
            'restart',
            'info',
        ];

        const cmd = interaction.options.get('cmd')?.value ?? '';
        result = result.filter((val) => val.includes(cmd as string));
        const resultObj = result.map((e: any) => ({ name: e, value: e }));

        await interaction.respond(resultObj);
    }
}