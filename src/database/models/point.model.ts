import { Schema, model } from 'mongoose';

const pointSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    point: {
        type: Number,
        required: true,
    },
    updated: {
        type: Date,
        required: true,
    }
});

export const Point = model('point', pointSchema);
