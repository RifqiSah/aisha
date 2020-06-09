import { Schema, model } from 'mongoose';

const channelSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
});

export const Channel = model('channel', channelSchema);
