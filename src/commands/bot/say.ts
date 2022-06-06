import { Message, TextChannel } from 'discord.js';

import Command from '../../classes/command';
import { logger } from '../../lib/logger';

export default class Say extends Command {
    constructor() {
        super({
            name: 'Aisha akan berbicara sesuai dengan yang kita ketikkan.',
            command: 'say',
            usage: '[pesan anda]',
            ownerOnly: true,
            onlyInformate: true,
        });
    }

    async run(message: Message, args: string): Promise<void> {
        const channel: TextChannel  = message.mentions.channels.first() as TextChannel;
        if (!channel) {
            message.channel.send('Mohon masukkan channel!');
            return;
        }

        const arg = args.split(' ');
        arg.shift();
        const sayMessage = arg.join(' ');
        if (!sayMessage) {
            message.channel.send('Mohon masukkan pesan anda!');
            return;
        }

        message.delete().catch((err: any) => logger.error(err));
        void channel.send(sayMessage);
    }
}