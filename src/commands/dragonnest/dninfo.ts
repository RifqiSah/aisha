import { Message } from 'discord.js';

import Command from '../../classes/command';
import { getExternalData, commandRecom, formatImageInMessage, sendMessage, formatData } from '../../helpers/function';
import config from '../../lib/config';

const list = formatData('dragonnest.dninfo');

export default class DnInfo extends Command {
    constructor() {
        super({
            name: `Melihat info hal-hal yang ada pada Dragon Nest. Info yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
            command: 'dninfo',
        });
    }

    async run(message: Message, args: string): Promise<void> {
        const info = (args.length ? args.toLowerCase() : 'null');
        const msg: string[] = [];

        const data = getExternalData('dragonnest.dninfo', info);
        if (!data) {
            msg.push(`Info untuk \`${info}\` tidak ditemukan!`);

            const recom = commandRecom('dninfo', info);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Info untuk ${data.name}**__\n`);
            await formatImageInMessage(msg, message, data);
        }

        msg.push(`\nGunakan \`${config.BOT_PREFIX}help dninfo\` untuk melihat daftar info yang tersedia.\n`);
        sendMessage(message, msg);
    }
}