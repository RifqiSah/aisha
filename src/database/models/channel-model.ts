import { Schema, model } from 'mongoose';

const channelSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    channelName: {
        type: String,
        required: true,
    },
});

export const Channel = model('channel', channelSchema);
