import {Schema, model} from 'mongoose';

const tickets = new Schema({
    channelId: {
        type: String,
        required: true,
        unique: true
    },

    ownerId: {
        type: String,
        required: true,
        unique: true
    },

    claimedBy: {
        type: String,
        required: false
    }

}, {timestamps: true});

export const ticketSchema = model("ticketSchema", tickets);