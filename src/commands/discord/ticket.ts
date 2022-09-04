import { ActionRowBuilder, CommandInteraction, ModalActionRowComponentBuilder, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle } from 'discord.js';

import Command from '../../classes/command';

export default class Ticket extends Command {
    constructor() {
        super({
            name: 'Mengirim pesan **Penting** kepada pengurus. Command ini digunakan jika ada pesan **penting** yang ingin segera disampaikan!.',
            command: 'ticket',
            usage: '[pesan anda]',
            cooldown: 60,
            onlyInformate: true,
            registerSlashCommand: true,
        });
    }

    async interact(interaction: CommandInteraction): Promise<void> {
        try {
            const modal = new ModalBuilder()
                .setCustomId('ticketModal')
                .setTitle('Mengirim pesan Penting kepada pengurus!');

            const messageInput = new TextInputBuilder()
                .setCustomId('messageInput')
                .setLabel('Pesan Anda?')
                .setPlaceholder('Pesan yang akan Anda kirimkan')
                .setStyle(TextInputStyle.Paragraph);

            const messageRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(messageInput);

            modal.addComponents(messageRow);

            await interaction.showModal(modal);
            const modalSubmission = await interaction.awaitModalSubmit({
                filter: (i) => {
                    return true;
                },
                time: 120000,
            });

            const message = modalSubmission.fields.getTextInputValue('messageInput');

            const chObj = interaction.guild?.channels.cache.find((ch) => ch.id === '917430153586565120');
            if (!chObj) return;

            await (chObj as TextChannel).send(message);

            await modalSubmission.reply({ content: 'Pesan Anda sudah terkirim!', ephemeral: true });
        } catch (err) {
            console.error(err);
        }
    }
}