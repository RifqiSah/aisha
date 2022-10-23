import { TextChannel, ModalBuilder, CommandInteraction, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponentBuilder, roleMention } from 'discord.js';

import { logger } from '../..//lib/logger';
import Command from '../../classes/command';

export default class Say extends Command {
    constructor() {
        super({
            name: 'Aisha akan berbicara sesuai dengan yang kita ketikkan.',
            command: 'say',
            usage: '[pesan anda]',
            ownerOnly: true,
            onlyInformate: true,
            registerSlashCommand: true,
        });
    }

    // async run(message: Message, args: string): Promise<void> {
    //     const channel: TextChannel  = message.mentions.channels.first() as TextChannel;
    //     if (!channel) {
    //         message.channel.send('Mohon masukkan channel!');
    //         return;
    //     }

    //     const arg = args.split(' ');
    //     arg.shift();
    //     const sayMessage = arg.join(' ');
    //     if (!sayMessage) {
    //         message.channel.send('Mohon masukkan pesan anda!');
    //         return;
    //     }

    //     message.delete().catch((err: any) => logger.error(err));
    //     void channel.send(sayMessage);
    // }

    async interact(interaction: CommandInteraction): Promise<void> {
        try {
            const modal = new ModalBuilder()
                .setCustomId('sayModal')
                .setTitle('Make Aisha saying words!');

            const channelInput = new TextInputBuilder()
                .setCustomId('channelInput')
                .setLabel('Ke channel?')
                .setPlaceholder('#general (tanpa #)')
                .setStyle(TextInputStyle.Short);

            const roleInput = new TextInputBuilder()
                .setCustomId('roleInput')
                .setLabel('Role yang dimention?')
                .setPlaceholder('@everyone (tanpa @)')
                .setStyle(TextInputStyle.Short);

            const messageInput = new TextInputBuilder()
                .setCustomId('messageInput')
                .setLabel('Pesan Anda?')
                .setPlaceholder('Pesan yang akan Anda kirimkan')
                .setStyle(TextInputStyle.Paragraph);

            const channelRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(channelInput);
            const roleRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(roleInput);
            const messageRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(messageInput);

            modal.addComponents(channelRow, roleRow, messageRow);

            await interaction.showModal(modal);
            const modalSubmission = await interaction.awaitModalSubmit({
                filter: (i) => {
                    return true;
                },
                time: 120000,
            });

            const channel = modalSubmission.fields.getTextInputValue('channelInput');
            const role = modalSubmission.fields.getTextInputValue('roleInput');
            const message = modalSubmission.fields.getTextInputValue('messageInput');

            const chObj = interaction.guild?.channels.cache.find((ch) => ch.name === channel);
            if (!chObj) return;

            const roleObj = interaction.guild?.roles.cache.find((r) => r.name.includes(role));
            if (!roleObj) return;

            await (chObj as TextChannel).send(`${roleMention(roleObj.id)}\n\n${message}`);

            await modalSubmission.reply({ content: 'Pesan Anda sudah terkirim!', ephemeral: true });
        } catch (err: any) {
            if (err?.code === 'InteractionCollectorError') {
                logger.warn(`-> Interaction '${interaction.commandName}' not submitted!`);
                return;
            }

            console.error(err);
        }
    }
}