import {Schema, model} from 'mongoose';

const guildSchema = new Schema({
    supportCategory: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
        unique: true
    },

}, {timestamps: true});

export const test = model("guildProfile", guildSchema);