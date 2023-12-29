/* eslint-disable no-case-declarations */

import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction, Message } from 'discord.js';

import Command from '../../classes/command';
import axios from '../../lib/axios';
import config from '../../lib/config';
import { logger } from '../../lib/logger';

/**
 * Virtual Machine
 */
const vmInfo = async () => {
    const result = await axios.get(`${config.IDCLOUDHOST_API}/user-resource/vm?uuid=${config.IDCLOUDHOST_UUID}`, { headers: { apikey: `${config.IDCLOUDHOST_APIKEY}` } });
    return result?.data;
};

const vmStatus = async () => {
    const result = await vmInfo();
    return result?.status === 'running';
};

const vmOperate = async (status: string) => {
    const result = await axios.post(`${config.IDCLOUDHOST_API}/user-resource/vm/${status}`, { uuid: `${config.IDCLOUDHOST_UUID}` }, { headers: { apikey: `${config.IDCLOUDHOST_APIKEY}` } });
    return result?.data;
};

/**
 * Assigned IP
 */
const vmIp = async () => {
    const result = await axios.get(`${config.IDCLOUDHOST_API}/network/ip_addresses?vm_uuid=${config.IDCLOUDHOST_UUID}`, { headers: { apikey: `${config.IDCLOUDHOST_APIKEY}` } });
    return result?.data;
};

/**
 * Minecraft Server
 */
const mcServerStatus = async () => {
    const ip = await vmIp();

    if (!ip?.length) {
        throw new Error('Unable to get VM ip !');
    }

    const resultIp = ip[0].address;
    const serverResult = await axios.get(`https://api.mcstatus.io/v2/status/java/${resultIp}`, { headers: { 'Accept-Encoding': '*' } });

    return serverResult?.data?.online === true;
};

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

            const cmd = interaction.options.get('cmd')?.value;
            switch (cmd) {
                case 'start':
                    status = await vmStatus();
                    // if (status) {
                    //     await interaction.editReply({ content: 'VM sudah menyala!' });
                    //     break;
                    // }

                    // await vmOperate('start');

                    refreshId = setInterval(async () => {
                        status = await vmStatus();
                        if (status) {
                            await interaction.editReply({ content: '1/2 - VM telah dinyalakan! Mohon menunggu sampai server Minecraft menyala 😃' });
                            clearInterval(refreshId);
                        }
                    }, timeout);

                    // vm on?
                    if (status) {
                        refreshIdMc = setInterval(async () => {
                            status = await mcServerStatus();
                            if (status) {
                                await interaction.editReply({ content: '2/2 - Server telah dinyalakan! Selamat bermain 😃' });
                                clearInterval(refreshIdMc);
                            }
                        }, timeout);
                    }

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