module.exports = async (client: any, interaction: any) => {
    if (interaction.isCommand()) {
        for (const item of [...client.interactionCommands.values()]) {
            item.checkInteraction(interaction);
        }
    } else if (interaction.isAutocomplete()) {
        for (const item of [...client.autocompletes.values()]) {
            void item.autocomplete(interaction);
        }
    }

    return;
};