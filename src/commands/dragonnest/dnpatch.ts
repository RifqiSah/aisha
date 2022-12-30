import { TextChannel, roleMention, ApplicationCommandOptionType, CommandInteraction, AutocompleteInteraction, channelMention } from 'discord.js';

import Command from '../../classes/command';
import { getMonthName } from '../../helpers/function';

export default class DnPatch extends Command {
    constructor() {
        super({
            name: 'Informasi Patch Note dari Dragon Nest [Manual].',
            command: 'dnpatch',
            usage: '[patch number]',
            ownerOnly: true,
            onlyInformate: true,
            registerSlashCommand: true,
            hasAutocomplete: true,
            slashCommandOptions: [
                {
                    name: 'patchnumber',
                    description: 'Patch News Number',
                    type: ApplicationCommandOptionType.Number,
                },
            ],
        });
    }

    async interact(interaction: CommandInteraction): Promise<void> {
        const msg: string[] = [];

        try {
            await interaction.deferReply();

            const patchNumber = interaction.options.get('patchnumber')?.value;
            const month = getMonthName();

            const channel: TextChannel = interaction.guild?.channels.cache.find((ch) => ch.id === '381495270241730561') as TextChannel; // dn-sea
            if (!channel) {
                throw new Error('Channel tidak ditemukan pada server ini!');
            }

            msg.push(roleMention('489292018628165633'));
            msg.push(`\n__**[Patchnote] ${month} Patchnote**__`);
            msg.push(`https://sea.dragonnest.com/news/notice/all/${patchNumber}`);

            await channel.send(msg.join('\n'));
            await interaction.editReply({ content: `Already sent in ${channelMention(channel.id)}!`, });
        } catch (err: any) {
            await interaction.editReply({ content: err?.message });
            console.error(err);
        }
    }

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        null;
    }
}