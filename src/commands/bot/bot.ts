import { Message } from 'discord.js';

import Command from '../../classes/command';
import { sendAndDelete } from '../../helpers/bot';
import { delay } from '../../helpers/function';

export default class Bot extends Command {
    constructor() {
        super({
            name: 'Aisha top secret :).',
            command: 'bot',
            ownerOnly: true,
        });
    }

    async run(message: Message, args: string): Promise<void> {
        const cmd = (args.length ? args.toLowerCase() : null);
        switch (cmd) {
            case 'restart':
                sendAndDelete(message, 'Aisha akan dijalankan kembali. Mohon tunggu sejenak ya!', 5000);
                await delay(5000);
                process.kill(process.pid, 'SIGINT');
                break;

            default:
                sendAndDelete(message, 'Oh tidak!! Perintah itu tidak ditemukan!', 5000);
                break;
        }
    }
}