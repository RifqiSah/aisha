import './env';

export default class Config {
    static ENABLE = true;
    static VERSION = 'v2.1.6';
    static PREFIX = '.';
    static OWNER = '306616861456465924';

    static ENV = process.env.ENV;
    static TOKEN = process.env.TOKEN;
    static TOKEN_APIAI = process.env.TOKEN_APIAI;
    static MONGODB = process.env.MONGODB;
}