import {Schema, model} from 'mongoose';

const guildSchema = new Schema({
    staffRoles: {
        type: String,
        required: false
    },
    channelLoggingId: {
        type: String,
        required: false
    },
    supportCategoryId: {
        type: String,
        required: false,
    },
    channelCreateTicketId: {
      type: String,
      required: false,
    },
    guildId: {
        type: String,
        required: true,
        unique: true
    },

}, {timestamps: true});

export const guildProfile = model("guildProfile", guildSchema);