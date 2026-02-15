import { Collection } from "discord.js";

declare module "discord.js" {
    export interface Client {
        interactions_collection: Collection<any, any>;
    }
}