import { Message, TextChannel } from 'discord.js';

import Command from '../../classes/command';
import { sendAndDelete } from '../../helpers/bot';

export default class Ticket extends Command {
    constructor() {
        super({
            name: 'Mengirim pesan **Penting** kepada pengurus. Command ini digunakan jika ada pesan **penting** yang ingin segera disampaikan!.',
            command: 'ticket',
            usage: '[pesan anda]',
            cooldown: 60,
        });
    }

    async run(message: Message, args: string): Promise<void> {
        if (!args) {
            sendAndDelete(message, 'Harap masukkan pesan Anda!', 5000);
            return;
        }

        message.delete();

        const channel: TextChannel = message.guild?.channels.cache.find((ch: any) => ch.id === '917430153586565120') as TextChannel; // member-log
        if (!channel) {
            return;
        }

        channel.send(`Anda mendapatkan pesan penting dari **${message.author.tag}**:\n\`\`\`${args}\`\`\``);
        void message.channel.send('Sukses mengirim pesan kepada pengurus!');
    }
}