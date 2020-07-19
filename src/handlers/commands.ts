import { readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

module.exports = (client: any) => {
    client.logger.info('  [-] Initialize commands');
    const load = (dirs: string) => {
        const commands = readdirSync(resolve(__dirname, `../commands/${dirs}`)).filter((f) => f.endsWith('.js'));
        
        for (const file of commands) {
            const cmdfile = require(resolve(__dirname, `../commands/${dirs}/${file}`));
            const key = file.slice(0, -3);

            client.logger.info(`    + '${key}' added.`);

            client.cmds.set(key, cmdfile);
            cmdfile.aliases.forEach((alias: string) => {
                client.cmdsalias.set(alias, key);
            });

            if (cmdfile.regex) {
                client.cmdsregex.set(key, `\\${cmdfile.name}\\`);
                cmdfile.aliases.forEach((alias: string) => {
                    client.cmdsregex.set(alias, `\\${key}\\`);
                });
            }

            // check subcommand
            if (existsSync(resolve(__dirname, `../commands/subcmd/${dirs}/${key}`))) {
                const subcmds = readdirSync(resolve(__dirname, `../commands/subcmd/${dirs}/${key}`)).filter((f) => f.endsWith('.js'));
                for (const file of subcmds) {
                    const subcmdfile = require(resolve(__dirname, `../commands/subcmd/${dirs}/${key}/${file}`));
                    const subkey = file.slice(0, -3);

                    client.logger.info(`      + '${subkey}' added.`);

                    client.subcmds.set(`${key}.${subkey}`, subcmdfile);
                }
            }
        }
    };

    ['bot', 'discord', 'dragonnest', 'fun', 'moderation'].forEach((x) => load(x));
    client.regexList = new RegExp(client.cmdsregex.map((key: any, item: any) => item).join('|'));
    client.logger.info('  [V] Done!');
};
