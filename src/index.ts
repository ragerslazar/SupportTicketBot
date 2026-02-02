import {Client, GatewayIntentBits,InteractionDeferReplyOptions, MessageFlags} from 'discord.js';
import {TOKEN} from "../var";
import {loadEvents} from "./handlers/eventHandler";

export const client = new Client({ intents:
        [GatewayIntentBits.Guilds] });

export const deferOptions: InteractionDeferReplyOptions = {
    flags: MessageFlags.Ephemeral
};

loadEvents()
client.login(TOKEN);