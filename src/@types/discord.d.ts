import { Collection } from "discord.js";

declare module "discord.js" {
    export interface Client {
        commands: Collection<any, any>;
        buttons: Collection<any, any>;
        channelSelectMenus: Collection<any, any>;
        modals: Collection<any, any>;
    }
}