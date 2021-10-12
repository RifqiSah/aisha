import { EventEmitter } from 'events';
import apiai from 'apiai';
import { Client, Collection, MessageEmbed, Intents } from 'discord.js';

import config from './lib/config';
import db from './lib/database';
import func from './lib/function';
import { logger } from './lib/logger';

const { Client: Exaroton } = require('exaroton');

const run = async () => {
    // public init
    logger.info('[-] Initialize variable');
    const client = {
        // General
        bot: new Client({ intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_WEBHOOKS,
            Intents.FLAGS.DIRECT_MESSAGES,
        ], partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'] }),
        embed: new MessageEmbed(),
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

    await func.loadData(); // Load external data
    db.connect(false); // Connect ke database

    // init event handler
    logger.info('[-] Initialize handler');
    ['commands', 'events'].forEach((x) => {
        logger.info(` [O] ${x} handler`);
        require(`./handlers/${x}`)(client);
    });

    client.bot.login(client.config.TOKEN);

    logger.info('[V] Done!');
    logger.info('[V] Aisha is ready to start!');
};

run();