import { ApplicationCommandOptionType, Routes } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';

module.exports = (client: any) => {
    client.logger.info('  [-] Refresh & registering slash commands');

    (async () => {
        try {
            const clientId = process.env.APP_ID ?? '';

            // delete all slash commands
            // await client.rest.put(Routes.applicationCommands(clientId), { body: [] });
            // await client.rest.put(Routes.applicationGuildCommands(clientId, '851491722764222495'), { body: [] },);

            // registering all slash commands
            const interactionCommandsJson = client.interactionCommands.map((ic: any) => {
                if (ic.hasAutocomplete) {
                    const slashOpts = ic.slashCommandOptions;

                    const builder = new SlashCommandBuilder()
                        .setName(ic.command)
                        .setDescription(ic.name);

                    slashOpts.map((opt: any) => {
                        if (opt.type === ApplicationCommandOptionType.String) {
                            builder.addStringOption((option: any) => {
                                option.setName(opt.name)
                                    .setDescription(opt.description)
                                    .setRequired(true);

                                if (opt.autocomplete) option.setAutocomplete(true);

                                if (opt?.choices) {
                                    opt.choices.map((choice: any) => {
                                        option.addChoices(choice);
                                    });
                                }

                                return option;
                            });

                        } else if (opt.type === ApplicationCommandOptionType.Number) {
                            builder.addNumberOption((option: any) =>
                                option.setName(opt.name)
                                    .setDescription(opt.description)
                                    .setRequired(true)
                                    .setAutocomplete(true));
                        } else if (opt.type === ApplicationCommandOptionType.Integer) {
                            builder.addIntegerOption((option: any) =>
                                option.setName(opt.name)
                                    .setDescription(opt.description)
                                    .setRequired(true)
                                    .setAutocomplete(true));
                        }
                    });

                    return builder.toJSON();
                } else {
                    return new SlashCommandBuilder()
                        .setName(ic.command)
                        .setDescription(ic.name.split('.')[0])
                        .toJSON();
                }
            });

            if (process.env.APP_ENV === 'local') {
                await client.rest.put(Routes.applicationGuildCommands(clientId, '851491722764222495'), { body: interactionCommandsJson },);
            } else {
                await client.rest.put(Routes.applicationCommands(clientId), { body: interactionCommandsJson },);
            }
        } catch (error) {
            client.logger.error('  [X] Error!', error);
        }
    })();

    client.logger.info('  [V] Done!');
};
