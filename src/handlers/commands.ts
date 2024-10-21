import { readdirSync } from 'fs';
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
            } catch (err) {
                client.logger.error(`    + '${key}': ${err}`);
                continue;
            }
        }
    };

    const excludeDirs = [
        'dragonnest',
        'minecraft',
    ];

    getDirs('commands').filter((x) => !excludeDirs.includes(x)).forEach((x: string) => load(x));

    client.logger.info('  [V] Done!');
};
