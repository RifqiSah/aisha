import { client as bot, rest } from './client';
import { loadData, getDirs } from './helpers/function';
import config from './lib/config';
import db from './lib/database';
import { logger } from './lib/logger';
import { commandCategories, commands, interactionCommands, autocompletes, subCommands } from './vars';

let client: any = null;

const init = async () => {
    logger.info('[-] Initialize variable');
    client = {
        bot,
        rest,
        config,
        logger,

        chsvc: require('./database/services/channel.service'),
        guildsvc: require('./database/services/guild.service'),
        pointsvc: require('./database/services/point.service'),
        configsvc: require('./database/services/config.service'),
        globalsvc: require('./database/services/globals.service'),

        gameserversvc: require('./database/services/gameserver.service'),
        gamenewssvc: require('./database/services/gamenews.service'),

        commandCategories,
        commands,
        interactionCommands,
        autocompletes,
        subCommands,
    };

    logger.info('[V] Done!');
};

const database = async () => {
    await loadData(); // Load external data
    await db.connect(false); // Connect ke database
};

const modules = async () => {
    logger.info('[-] Initialize handler');
    ['commands', 'events', 'slash'].forEach((x) => {
        logger.info(` [O] ${x} handler`);
        require(`./handlers/${x}`)(client);
    });
    logger.info('[V] Done!');

    // logger.info('[-] Initialize external modules');
    // getDirs('modules').forEach((x) => {
    //     logger.info(` [O] ${x} modules`);
    //     require(`./modules/${x}/index.js`)(client);
    // });
    // logger.info('[V] Done!');
};

const login = async () => {
    await client.bot.login(client.config.TOKEN);
    logger.info('[V] Aisha is ready to start!');
};

const run = async () => {
    await init();
    await database();
    await modules();
    await login();
};

run();

const shutDown = async () => {
    logger.info('[V] Received kill signal, shutting down gracefully');
    await client.bot.destroy();
    process.exit(0);
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);