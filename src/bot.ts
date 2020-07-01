import apiai from 'apiai';
import { Client, Collection, MessageEmbed } from 'discord.js';

import config from './lib/config';
import db from './lib/database';

// public init
console.log('[-] Initialize variable');
const client = {
    // General
    bot: new Client({ partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'] }),
    embed: new MessageEmbed(),
    apiai: apiai(`${config.TOKEN_APIAI}`),
    config: config,

    // Services
    chsvc: require('./database/services/channel.service'),
    guildsvc: require('./database/services/guild.service'),
    
    // Variables
    cmdcd: new Set(),
    cmds: new Collection(),
    cmdsalias: new Collection(),
    cmdsregex: new Collection(),
};

// Connect ke database
db.connect();
console.info('[V] Done!');

// init event handler
console.log('[-] Initialize handler');
['commands', 'events', 'console'].forEach((x) => {
    console.log(` [O] ${x} handler`);
    require(`./handlers/${x}`)(client);
});

client.bot.login(client.config.TOKEN);

console.log('[V] Done!');
console.log('[V] Aisha is ready to start!');