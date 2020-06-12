import './env';

export default class Config {
    static ENV = process.env.APP_ENV;
    static MONGODB = process.env.APP_MONGODB_URI;
    static TOKEN = process.env.APP_DISCORD_TOKEN;
    static TOKEN_APIAI = process.env.APP_APIAI_TOKEN;

    static ENABLE = true;
    static VERSION = 'v2.1.8';
    static NAME = process.env.BOT_NAME;
    static OWNER = process.env.BOT_OWNERS;
    static PREFIX = process.env.BOT_PREFIX;
}