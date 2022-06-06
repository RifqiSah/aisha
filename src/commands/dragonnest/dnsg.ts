import { Message } from 'discord.js';
import { get } from 'superagent';

import Command from '../../classes/command';
import { sendAndDelete, editAndDelete } from '../../helpers/bot';
import { logger } from '../../lib/logger';
import values from '../../lib/values';


export default class DnInfo extends Command {
    constructor() {
        super({
            name: 'Mengubah status server Dragon Nest.',
            command: 'dnsg',
        });
    }

    async run(message: Message, args: string): Promise<void> {
        message.delete();

        if (!args.length) {
            return sendAndDelete(message, 'Harap masukkan nama server!', 5000);
        }

        const msgs = await message.channel.send(`Menunggu \`${args}\` ...`);

        await get(`${values.aisha_api}/server_update/${args}`)
            .then((res) => {
                editAndDelete(msgs, `Sukses \`${args}\`! Respon:\`\`\`${res.text}\`\`\``, 50000);
            })
            .catch((err) => {
                logger.error(err);
            });
    }
}