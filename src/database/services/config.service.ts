import { logger } from '../../lib/logger';
import { Config } from '../models/config.model';

module.exports = {
    count() {
        return Config.countDocuments({});
    },

    getAllConfig() {
        Config.find({}, (err, doc) => {
            if (err)  return logger.error(err);

            return doc;
        });
    },

    getConfig(gId: string, key: string) {
        return Config.findOne({ guildId: gId, key: key });
    },

    addConfig(gId: string, key: string, value: string) {
        const config = new Config({ guildId: gId, key: key, value: value });
        config.save((err: any, doc: any) => {
            if (err) return logger.error(err);
        });
    },

    deleteConfig(gId: string, key: string) {
        Config.findOneAndDelete({ guildId: gId, key: key }, (err: any, doc: any) => {
            if (err) return logger.error(err);
        });
    },

    updateConfig(gId: string, key: string, value: any) {
        Config.findOneAndUpdate({ guildId: gId, key: key }, value, (err: any, doc: any) => {
            if (err) return logger.error(err);
        });
    },
};
