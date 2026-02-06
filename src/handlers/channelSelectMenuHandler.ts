/// <reference path="../@types/discord.d.ts" />
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";
import {Client, Collection} from "discord.js";

export async function channelSelectMenuHandler(client: Client) {
    client.channelSelectMenus = new Collection();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const foldersPath = path.join(__dirname, '../interactions/channelSelectMenu');
    const commandFiles = fs.readdirSync(foldersPath).filter((file) => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, file);
        const channelSelectMenu = await import(pathToFileURL(filePath).href);
        if ('data' in channelSelectMenu.default && 'execute' in channelSelectMenu.default) {
            client.channelSelectMenus.set(channelSelectMenu.default.data.data.custom_id, channelSelectMenu.default);
        } else {
            console.log(`[WARNING] The select menu at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}