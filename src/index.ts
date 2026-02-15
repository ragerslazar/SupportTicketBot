import {Client, GatewayIntentBits} from 'discord.js';
import {MONGODB_URI, TOKEN} from "../config.ts";
import {eventHandler} from "./handlers/eventHandler.ts";
import mongoose from 'mongoose';
import {interactionsHandler} from "./handlers/interactionsHandler.ts";

export const client = new Client({ intents:
        [GatewayIntentBits.Guilds] });

await eventHandler(client);
await interactionsHandler(client);


(async () => {
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected`);
    client.login(TOKEN);
})();