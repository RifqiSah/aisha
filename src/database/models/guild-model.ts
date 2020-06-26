import { Schema, model } from 'mongoose';

const guildSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    guildName: {
        type: String,
        required: true,
    },
});

export const Guild = model('guild', guildSchema);
