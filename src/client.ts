import { Client, GatewayIntentBits, Partials, Collection, } from 'discord.js';
import config from './lib/config';
const { REST } = require('@discordjs/rest');

export const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildWebhooks,

    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,

    GatewayIntentBits.GuildVoiceStates,
], partials: [Partials.User, Partials.GuildMember, Partials.Message, Partials.Channel, Partials.Reaction] });

export const rest = new REST({ version: '10' }).setToken(config.TOKEN);