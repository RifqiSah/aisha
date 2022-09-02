import { InteractionType } from 'discord.js';

module.exports = async (client: any, interaction: any) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        for (const item of [...client.interactionCommands.values()]) {
            item.checkInteraction(interaction);
        }
    } else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        for (const item of [...client.autocompletes.values()]) {
            void item.autocomplete(interaction);
        }
    }

    return;
};