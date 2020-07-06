import './env';

export default class Config {
    static ENV = process.env.APP_ENV;
    static MONGODB = process.env.APP_MONGODB_URI;
    static TOKEN = process.env.APP_DISCORD_TOKEN;
    static TOKEN_APIAI = process.env.APP_APIAI_TOKEN;

    static BOT_VERSION = 'v2.1.24';
    static BOT_NAME = process.env.BOT_NAME;
    static BOT_OWNER = process.env.BOT_OWNERS;
    static BOT_PREFIX = process.env.BOT_PREFIX;
}