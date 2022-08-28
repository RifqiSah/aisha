import { readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

import { SlashCommandBuilder } from '@discordjs/builders';
import { Routes } from 'discord-api-types/v9';

import Command from '../classes/command';
import { getDirs } from '../helpers/function';

module.exports = (client: any) => {
    client.logger.info('  [-] Initialize commands');
    const load = async (dirs: string) => {
        const commands = readdirSync(resolve(__dirname, `../commands/${dirs}`)).filter((f) => f.endsWith('.js'));

        client.logger.info(`    + '${dirs}`);

        for (const file of commands) {
            const imported = require(resolve(__dirname, `../commands/${dirs}/${file}`));
            const ImportedCommand = imported.default;
            const key = file.slice(0, -3);

            const command = new ImportedCommand();

            try {
                if ((command as Command).registerSlashCommand === true) {
                    client.interactionCommands.set(key, command);
                } else {
                    client.commands.set(key, command);
                }

                if ((command as Command).hasAutocomplete === true) {
                    client.autocompletes.set(key, command);
                }

                client.commandCategories.set(key, dirs);

                client.logger.info(`      + '${key}' added.`);
            } catch (err) {
                client.logger.error(`    + '${key}': ${err}`);
                continue;
            }
        }
    };

    getDirs('commands').forEach((x: string) => load(x));

    client.logger.info('  [V] Done!');
    client.logger.info('  [-] Refresh & registering slash commands');

    (async () => {
        try {
            const clientId = process.env.APP_ID ?? '';

            // delete all slash commands
            // await client.rest.put(Routes.applicationCommands(clientId), { body: [] })
            //     .then(() => console.log('Successfully deleted all guild commands.'))
            //     .catch(console.error);

            // registering all slash commands
            const interactionCommandsJson = client.interactionCommands.map((ic: any) => {
                if (ic.hasAutocomplete) {
                    const slashOpts = ic.slashCommandOptions;

                    return new SlashCommandBuilder()
                        .setName(ic.command)
                        .setDescription(ic.name.split('.')[0])
                        .addStringOption((option: any) =>
                            option.setName(slashOpts[0].name)
                                .setDescription(slashOpts[0].description)
                                .setRequired(true)
                                .setAutocomplete(true))
                        .toJSON();
                } else {
                    return new SlashCommandBuilder()
                        .setName(ic.command)
                        .setDescription(ic.name.split('.')[0])
                        .toJSON();
                }
            });

            await client.rest.put(Routes.applicationCommands(clientId), { body: interactionCommandsJson },);
        } catch (error) {
            client.logger.error('  [X] Error!', error);
        }
    })();

    client.logger.info('  [V] Done!');
};
