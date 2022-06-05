import { Message } from 'discord.js';

import Command from '../../classes/command';
import { client } from '../../client';

function duration(ms: any) {
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (1000 * 60)) % 60).toString();
    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24).toString();
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();

    return `\`${days.padStart(1, '0')}\` hari, \`${hrs.padStart(2, '0')}\` jam, \`${min.padStart(2, '0')}\` menit, \`${sec.padStart(2, '0')}\` detik.`;
}

export default class Uptime extends Command {
    constructor() {
        super({
            name: 'Melihat berapa lama bot sudah berjalan.',
            command: 'uptime',
            ownerOnly: true,
            onlyInformate: true,
        });
    }

    async run(message: Message, args: string): Promise<void> {
        message.channel.send(`Aku sudah online selama ${duration(client.uptime)}`);
    }
}