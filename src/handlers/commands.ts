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
            const interactionCommandsJson = client.interactionCommands.map((ic: any) => {
                return new SlashCommandBuilder()
                    .setName(ic.command)
                    .setDescription(ic.name).toJSON();
            });

            await client.rest.put(Routes.applicationGuildCommands('496201019005468672', '306617555332628480'), { body: interactionCommandsJson },);
        } catch (error) {
            client.logger.error('  [X] Error!', error);
        }
    })();

    client.logger.info('  [V] Done!');
};
