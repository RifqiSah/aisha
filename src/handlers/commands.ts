import { readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

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

                // check subcommand
                // if (existsSync(resolve(__dirname, `../commands/subcmd/${dirs}/${key}`))) {
                //     const subcmds = readdirSync(resolve(__dirname, `../commands/subcmd/${dirs}/${key}`)).filter((f) => f.endsWith('.js'));
                //     for (const file of subcmds) {
                //         const subcmdfile = require(resolve(__dirname, `../commands/subcmd/${dirs}/${key}/${file}`));
                //         const subkey = file.slice(0, -3);

                //         client.logger.info(`      + '${subkey}' added.`);

                //         client.subcmds.set(`${key}.${subkey}`, subcmdfile);
                //     }
                // }
            } catch (err) {
                client.logger.error(`    + '${key}': ${err}`);
                continue;
            }
        }
    };

    getDirs('commands').forEach((x: string) => {
        if (x === 'subcmd') return false;
        load(x);
    });

    // client.regexList = new RegExp(client.cmdsregex.map((key: any, item: any) => item).join('|'));
    client.logger.info('  [V] Done!');
};
