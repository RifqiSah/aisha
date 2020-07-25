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
    date: {
        type: Date,
        required: true,
    }
});

export const Point = model('point', pointSchema);
