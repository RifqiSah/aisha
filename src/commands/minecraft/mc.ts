import { Message } from 'discord.js';
import { Client as Exaroton } from 'exaroton';

import Command from '../../classes/command';
import { sendAndDelete, editAndDelete } from '../../helpers/bot';
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
        });
    }

    async run(message: Message, args: string): Promise<void> {
        message.delete();

        if (!args.length) {
            void sendAndDelete(message, 'Harap masukkan parameter!', 5000);
            return;
        }

        const msgs = await message.channel.send('Mohon tunggu sebentar ...');

        try {
            const mcClient = new Exaroton(config.MC_TOKEN || '');
            let server = mcClient.server(values.mc_server_id);

            if (args === 'info') {
                server = await server.get();

                const data = [
                    `__**${server.name.toUpperCase()}**__`,
                    `${server.motd}`,

                    '\n__**Software**__',
                    `Name: ${server.software.name}`,
                    `Version: ${server.software.version}`,

                    '\n__**Server**__',
                    `Status: __**${status(server.status)}**__`,
                    `Players: ${server.players.count}/${server.players.max}`,
                ];

                void editAndDelete(msgs, data, 10000);
                return;
            } if (args === 'start') {
                await server.start();

                const refreshId = setInterval(async () => {
                    server = await server.get();
                    if (server.hasStatus(server.STATUS.ONLINE)) {
                        editAndDelete(msgs, 'Server telah dinyalakan! Selamat bermain 😃', 10000);
                        clearInterval(refreshId);
                    }
                }, 5000);

                return;
            } if (args === 'restart') {
                await server.restart();

                const refreshId = setInterval(async () => {
                    server = await server.get();
                    if (server.hasStatus(server.STATUS.ONLINE)) {
                        editAndDelete(msgs, 'Server telah di-restart!', 10000);
                        clearInterval(refreshId);
                    }
                }, 5000);

                return;
            } if (args === 'stop') {
                await server.stop();

                const refreshId = setInterval(async () => {
                    server = await server.get();
                    if (server.hasStatus(server.STATUS.OFFLINE)) {
                        editAndDelete(msgs, 'Server telah dimatikan! Terima kasih telah bermain 😃', 10000);
                        clearInterval(refreshId);
                    }
                }, 5000);

                return;
            } else {
                void sendAndDelete(message, `Pengaturan untuk \`${args}\` tidak ditemukan!`, 5000);
                return;
            }
        } catch (e: any) {
            return msgs.edit(e.message).then((msg: any) => {
                setTimeout(() => msg.delete(), 5000);
                logger.error(e);
            });
        }
    }
}