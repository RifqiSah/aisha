import { roleMention } from '@discordjs/builders';
import { Message, TextChannel } from 'discord.js';

import Command from '../../classes/command';
import { formatData, getMonthName, sendMessageChannel } from '../../helpers/function';

const list = formatData('dragonnest.dninfo');

export default class DnInfo extends Command {
    constructor() {
        super({
            name: `Melihat info hal-hal yang ada pada Dragon Nest. Info yang tersedia yaitu:\n\n\`\`\`${list}\`\`\``,
            command: 'dnpatch',
            ownerOnly: true,
            onlyInformate: true,
        });
    }

    async run(message: Message, args: string): Promise<void> {
        message.delete();

        const data = [];
        const channel: TextChannel = message.guild?.channels.cache.find((ch: any) => ch.id === '381495270241730561') as TextChannel; // dn-sea
        if (!channel) {
            return;
        }

        const month = getMonthName();
        const newsNumber = args;

        data.push(roleMention('489292018628165633'));
        data.push(`__**[Patchnote] ${month} Patchnote**__`);
        data.push(`https://sea.dragonnest.com/news/notice/all/${newsNumber}`);

        sendMessageChannel(channel, data);
    }
}