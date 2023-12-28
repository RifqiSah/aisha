/* eslint-disable no-case-declarations */

import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction, Message } from 'discord.js';
import { Client as Exaroton } from 'exaroton';

import Command from '../../classes/command';
import axios from '../../lib/axios';
import config from '../../lib/config';
import { logger } from '../../lib/logger';

const vmStatus = async () => {
    const result = await axios.get(`${config.IDCLOUDHOST_API}?uuid=${config.IDCLOUDHOST_UUID}`, { headers: { apikey: `${config.IDCLOUDHOST_APIKEY}` } });
    return result?.data?.status === 'running';
};

const vmOperate = async (status: string) => {
    const result = await axios.post(`${config.IDCLOUDHOST_API}/${status}`, { uuid: `${config.IDCLOUDHOST_UUID}` }, { headers: { apikey: `${config.IDCLOUDHOST_APIKEY}` } });
    return result?.data;
};

export default class Mc2 extends Command {
    constructor() {
        super({
            name: 'Control panel untuk Minecraft Server Terbaru.',
            command: 'mc2',
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
            let status = false;

            const cmd = interaction.options.get('cmd')?.value;
            switch (cmd) {
                case 'start':
                    status = await vmStatus();
                    if (status) {
                        await interaction.editReply({ content: 'VM sudah menyala!' });
                        break;
                    }

                    await vmOperate('start');

                    refreshId = setInterval(async () => {
                        status = await vmStatus();
                        if (status) {
                            await interaction.editReply({ content: 'VM telah dinyalakan! Mohon menunggu sampai server Minecraft menyala 😃' });
                            clearInterval(refreshId);
                        }
                    }, timeout);

                    break;

                case 'stop':
                    status = await vmStatus();
                    if (!status) {
                        await interaction.editReply({ content: 'VM sudah mati!' });
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