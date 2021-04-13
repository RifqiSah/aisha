import { Schema, model } from 'mongoose';

const configSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
});

export const Config = model('config', configSchema);
