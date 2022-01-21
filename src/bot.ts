import { EventEmitter } from 'events';
import * as builder from '@discordjs/builders';
import apiai from 'apiai';
import { Client, Collection, MessageEmbed, Intents } from 'discord.js';

import config from './lib/config';
import db from './lib/database';
import func from './lib/function';
import { logger } from './lib/logger';

const { Client: Exaroton } = require('exaroton');

let client: any = null;

const init = async () => {
    logger.info('[-] Initialize variable');
    client = {
        // General
        bot: new Client({ intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_WEBHOOKS,
            Intents.FLAGS.DIRECT_MESSAGES,
        ], partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'] }),
        embed: new MessageEmbed(),
        builder,
        apiai: apiai(`${config.TOKEN_APIAI}`),
        config: config,
        logger: logger,

        // Services
        chsvc: require('./database/services/channel.service'),
        guildsvc: require('./database/services/guild.service'),
        pointsvc: require('./database/services/point.service'),
        configsvc: require('./database/services/config.service'),
        mcsvc: new Exaroton(config.MC_TOKEN),

        // Variables
        cmdcd: new Set(),
        cmds: new Collection(),
        cmdsalias: new Collection(),
        cmdsregex: new Collection(),
        subcmds: new Collection(),
        cmdsloc: new Collection(),

        // Constant
        ev: new EventEmitter(),
    };

    logger.info('[V] Done!');
};

const database = async () => {
    await func.loadData(); // Load external data
    await db.connect(false); // Connect ke database
};

const modules = async () => {
    logger.info('[-] Initialize handler');
    ['commands', 'events'].forEach((x) => {
        logger.info(` [O] ${x} handler`);
        require(`./handlers/${x}`)(client);
    });
    logger.info('[V] Done!');

    logger.info('[-] Initialize external modules');
    ['cron'].forEach((x) => {
        logger.info(` [O] ${x} modules`);
        require(`./modules/${x}/index.js`)(client);
    });
    logger.info('[V] Done!');
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