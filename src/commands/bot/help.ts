import { Message, roleMention } from 'discord.js';

import Command from '../../classes/command';
import { sendMessage } from '../../helpers/function';
import config from '../../lib/config';
import { commandCategories, commands, interactionCommands } from '../../vars';

export default class Help extends Command {
    constructor() {
        super({
            name: 'Daftar command yang dapat digunakan pada Aisha.',
            command: 'help',
            usage: '[command]',
        });
    }

    async run(message: Message, args: string): Promise<void> {
        const data = [];
        let lastLoc = '';

        if (!args.length) {
            data.push('Hai! Ini adalah daftar command yang tersedia:');

            data.push('\n__**NORMAL**__');

            commands.forEach((item: any) => {
                const category = String(commandCategories.get(item.command));

                if (!lastLoc.includes(category)) {
                    lastLoc = category;
                    data.push(`\n🔹${lastLoc.replace(/^./, lastLoc[0].toUpperCase())}🔹`);
                }

                data.push(`\`${item.command}\` : ${item.name}`);
            });

            data.push('\n__**SLASH COMMANDS**__');

            interactionCommands.forEach((item: any) => {
                const category = String(commandCategories.get(item.command));

                if (!lastLoc.includes(category)) {
                    lastLoc = category;
                    data.push(`\n🔹${lastLoc.replace(/^./, lastLoc[0].toUpperCase())}🔹`);
                }

                data.push(`\`${item.command}\` : ${item.name}`);
            });

            data.push(`\nAnda dapat menggunakan \`${config.BOT_PREFIX}help [nama command]\` untuk mendapatkan informasi dari command tersebut.`);
        } else {
            const name = args?.split(' ')[0].toLowerCase();
            const command: Command = commands.get(name) as Command || interactionCommands.get(name) as Command;

            if (!command) {
                void message.reply(`Command ${name} tidak ditemukan!`);
            } else {
                data.push(`Informasi mengenai command \`${command.command}\`:\n`);

                // if (command.aliases) data.push(`\`Alias\` : ${command.aliases.length ? `${command.aliases.join(', ')}` : '-'}`);
                if (command.name) data.push(`\`Deskripsi\` : ${command.name}`);
                if (command.usage) data.push(`\`Penggunaan\` : ${config.BOT_PREFIX}${name} ${command.usage}`);
                if (command.roles) data.push(`\`Role\` : ${command.roles.length ? command.roles.map((i: any) => roleMention(i)).join(', ') : '-'}`);

                data.push(`\`Cooldown\` : ${command.cooldown || 0} detik`);

                data.push(`\nAnda dapat menggunakan \`${config.BOT_PREFIX}help\` untuk mendapatkan informasi dari semua command yang tersedia.`);
            }
        }

        void sendMessage(message, data);
    }
}