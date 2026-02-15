import {Schema, model} from 'mongoose';

const guildSchema = new Schema({
    supportCategoryId: {
        type: String,
        required: true,
    },
    channelCreateTicket: {
      type: String,
      required: true,
    },
    guildId: {
        type: String,
        required: true,
        unique: true
    },

}, {timestamps: true});

export const guildProfile = model("guildProfile", guildSchema);