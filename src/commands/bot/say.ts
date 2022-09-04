import { TextChannel, ModalBuilder, CommandInteraction, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponentBuilder } from 'discord.js';

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
                .setLabel('Channel yang akan dikirim?')
                .setPlaceholder('#general')
                .setStyle(TextInputStyle.Short);

            const messageInput = new TextInputBuilder()
                .setCustomId('messageInput')
                .setLabel('Pesan Anda?')
                .setPlaceholder('Pesan yang akan Anda kirimkan')
                .setStyle(TextInputStyle.Paragraph);

            const channelRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(channelInput);
            const messageRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(messageInput);

            modal.addComponents(channelRow, messageRow);

            await interaction.showModal(modal);
            const modalSubmission = await interaction.awaitModalSubmit({
                filter: (i) => {
                    return true;
                },
                time: 120000,
            });

            const channel = modalSubmission.fields.getTextInputValue('channelInput');
            const message = modalSubmission.fields.getTextInputValue('messageInput');

            const chObj = interaction.guild?.channels.cache.find((ch) => ch.name === channel);
            if (!chObj) return;

            await (chObj as TextChannel).send(message);

            await modalSubmission.reply({ content: 'Pesan Anda sudah terkirim!', ephemeral: true });
        } catch (err) {
            console.error(err);
        }
    }
}