import './env';
import values from './values';

export default class Config {
    static INFORMATE_ID = '306617555332628480';

    static ENV = process.env.APP_ENV;
    static MONGODB = process.env.APP_MONGODB_URI;
    static TOKEN = process.env.APP_DISCORD_TOKEN;
    static TOKEN_APIAI = process.env.APP_APIAI_TOKEN;

    static BOT_VERSION = process.env.BOT_VERSION;
    static BOT_NAME = process.env.BOT_NAME;
    static BOT_OWNER = process.env.BOT_OWNERS;
    static BOT_PREFIX = process.env.BOT_PREFIX;
    static BOT_WEBHOOK_LOG = process.env.BOT_WEBHOOK_LOG;

    static MC_TOKEN = process.env.MC_TOKEN;
    static MC_SERVER_ID = process.env.MC_SERVER_ID;

    static ENDPOINT = process.env.ENDPOINT;
}