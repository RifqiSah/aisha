import { Message } from 'discord.js';

import Command from '../../classes/command';
import { client } from '../../client';

export default class Ping extends Command {
    constructor() {
        super({
            name: 'Memeriksa latency API dan latency Aisha terhadap server Discord.',
            command: 'ping',
        });
    }

    async run(message: Message, args: string): Promise<void> {
        void message.channel.send('Memeriksa ...').then((m: any) => {
            const ping = m.createdTimestamp - message.createdTimestamp;
            const choices = ['Ini adalah latency aku', 'Apakah baik-baik saja? Aku tidak dapat melihat!', 'Aku berharap ini tidak buruk!'];
            const response = choices[Math.floor(Math.random() * choices.length)];

            m.edit(`${response}\nBot Latency: \`${ping}\`, API Latency: \`${Math.round(client.ws.ping)}\``);
        });
    }
}