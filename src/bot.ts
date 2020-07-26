import apiai from 'apiai';
import { Client, Collection, MessageEmbed } from 'discord.js';

import config from './lib/config';
import db from './lib/database';
import func from './lib/function';
import { logger } from './lib/logger';

// public init
logger.info('[-] Initialize variable');
const client = {
    // General
    bot: new Client({ partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'] }),
    embed: new MessageEmbed(),
    apiai: apiai(`${config.TOKEN_APIAI}`),
    config: config,
    logger: logger,

    // Services
    chsvc: require('./database/services/channel.service'),
    guildsvc: require('./database/services/guild.service'),
    pointsvc: require('./database/services/point.service'),
    
    // Variables
    cmdcd: new Set(),
    cmds: new Collection(),
    cmdsalias: new Collection(),
    cmdsregex: new Collection(),
    subcmds: new Collection(),
};

logger.info('[V] Done!');

db.connect(); // Connect ke database
func.loadData(); // Load external data

// init event handler
logger.info('[-] Initialize handler');
['commands', 'events'].forEach((x) => {
    logger.info(` [O] ${x} handler`);
    require(`./handlers/${x}`)(client);
});

client.bot.login(client.config.TOKEN);

logger.info('[V] Done!');
logger.info('[V] Aisha is ready to start!');