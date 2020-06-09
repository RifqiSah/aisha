import './env';

export default class Config {
    static ENABLE: Boolean = true;
    static VERSION: String = 'v2.0.4';
    static PREFIX: String = '.';
    static OWNER: String = '306616861456465924';

    static ENV = process.env.ENV;
    static TOKEN = process.env.TOKEN;
    static TOKEN_APIAI = process.env.TOKEN_APIAI;
    static MONGODB = process.env.MONGODB;
};