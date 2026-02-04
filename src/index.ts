import {Client, GatewayIntentBits} from 'discord.js';
import {MONGODB_URI, TOKEN} from "../config.ts";
import {eventHandler} from "./handlers/eventHandler.ts";
import {commandHandler} from "./handlers/commandHandler.ts";
import mongoose from 'mongoose';
import {buttonHandler} from "./handlers/buttonHandler.ts";

export const client = new Client({ intents:
        [GatewayIntentBits.Guilds] });

eventHandler(client);
buttonHandler(client);
commandHandler(client);


(async () => {
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected`);
    client.login(TOKEN);
})();