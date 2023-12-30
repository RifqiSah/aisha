/* eslint-disable no-case-declarations */

import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction } from 'discord.js';

import Command from '../../classes/command';
import { vmStatus, vmOperate, mcServerStatus } from '../../helpers/minecraft';
import { logger } from '../../lib/logger';

export default class McNew extends Command {
    constructor() {
        super({
            name: 'Control panel untuk Minecraft Server Terbaru.',
            command: 'mcnew',
            roles: ['802718208180092939'],
            usage: '[cmd]',
            onlyInformate: true,
            registerSlashCommand: true,
            hasAutocomplete: true,
            slashCommandOptions: [
                {
                    name: 'cmd',
                    description: 'start / stop',
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

            let refreshId: any = null;
            let refreshIdMc: any = null;

            let status = false;
            let statusMc = false;

            const cmd = interaction.options.get('cmd')?.value;
            switch (cmd) {
                case 'start':
                    status = await vmStatus();
                    if (status) {
                        await interaction.editReply({ content: 'VM sudah dalam keadaan menyala!' });
                        break;
                    }

                    await vmOperate('start');

                    refreshId = setInterval(async () => {
                        status = await vmStatus();
                        if (status) {
                            await interaction.editReply({ content: '1/2 - VM telah dinyalakan! Mohon menunggu sampai server Minecraft menyala 😃' });
                            clearInterval(refreshId);
                        }
                    }, timeout);

                    refreshIdMc = setInterval(async () => {
                        statusMc = await mcServerStatus();
                        if (statusMc) {
                            await interaction.editReply({ content: '2/2 - Server telah dinyalakan! Selamat bermain 😃' });
                            clearInterval(refreshIdMc);
                        }
                    }, timeout);

                    break;

                case 'stop':
                    status = await vmStatus();
                    if (!status) {
                        await interaction.editReply({ content: 'VM sudah dalam keadaan mati!' });
                        break;
                    }

                    await vmOperate('stop');

                    refreshId = setInterval(async () => {
                        status = await vmStatus();
                        if (!status) {
                            await interaction.editReply({ content: 'VM telah dimatikan! Terima kasih telah bermain 😃' });
                            clearInterval(refreshId);
                        }
                    }, timeout);

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
        ];

        const cmd = interaction.options.get('cmd')?.value ?? '';
        result = result.filter((val) => val.includes(cmd as string));
        const resultObj = result.map((e: any) => ({ name: e, value: e }));

        await interaction.respond(resultObj);
    }
}