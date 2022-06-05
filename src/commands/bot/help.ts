import { Message } from 'discord.js';
import Command from '../../classes/command';
import { sendMessage } from '../../helpers/function';
import config from '../../lib/config';
import { commandCategories, commands } from '../../vars';

export default class Help extends Command {
    constructor() {
        super({
            name: 'Daftar command yang dapat digunakan pada Aisha.',
            command: 'help',
        });
    }

    async run(message: Message, args: string): Promise<void> {
        const data = [];
        let lastLoc = '';

        if (!args.length) {
            data.push('Hai! Ini adalah daftar command yang tersedia:');

            commands.forEach((item: any) => {
                if (!lastLoc.includes(String(commandCategories.get(item.command)))) {
                    lastLoc = String(commandCategories.get(item.command));
                    data.push(`\n__**${lastLoc.replace(/^./, lastLoc[0].toUpperCase())}**__`);
                }

                data.push(`\`${item.command}\` : ${item.name.split('.')[0]}.`);
            });

            data.push(`\nAnda dapat menggunakan \`${config.BOT_PREFIX}help [nama command]\` untuk mendapatkan informasi dari command tersebut.`);
        } else {
            const name = args[0].toLowerCase();
            const command = commands.get(name);

            if (!command) {
                void message.reply('Command tidak valid!');
            }

            console.log(command);
        }

        void sendMessage(message, data);
    }
}