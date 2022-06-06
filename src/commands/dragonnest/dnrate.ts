import { Message } from 'discord.js';

import Command from '../../classes/command';
import { getExternalData, commandRecom, formatImageInMessage, sendMessage, formatData } from '../../helpers/function';
import config from '../../lib/config';

const list = formatData('dragonnest.dnrate');

export default class DnRate extends Command {
    constructor() {
        super({
            name: `Melihat info rate enhance, dan chance apapun (kecuali drop) pada Dragon Nest. Rate yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
            command: 'dnrate',
            usage: '[nama rate]',
        });
    }

    async run(message: Message, args: string): Promise<void> {
        const rate = (args.length ? args.toLowerCase() : 'null');
        const msg: string[] = [];

        const data = getExternalData('dragonnest.dnrate', rate);
        if (!data) {
            msg.push(`Rate untuk \`${rate}\` tidak ditemukan!`);

            const recom = commandRecom('dnrate', rate);
            if (recom) msg.push(`\nMungkin yang Anda maksud: \`${recom}\`?`);
        } else {
            msg.push(`__**Rate untuk ${data.name}**__\n`);
            await formatImageInMessage(msg, message, data);
        }

        msg.push(`\nGunakan \`${config.BOT_PREFIX}help dnrate\` untuk melihat daftar rate yang tersedia.\n`);
        sendMessage(message, msg);
    }
}