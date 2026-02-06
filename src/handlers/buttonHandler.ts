/// <reference path="../@types/discord.d.ts" />
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";
import {Client, Collection} from "discord.js";

export async function buttonHandler(client: Client) {
    client.buttons = new Collection();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const foldersPath = path.join(__dirname, '../interactions/buttons');
    const commandFiles = fs.readdirSync(foldersPath).filter((file) => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, file);
        const button = await import(pathToFileURL(filePath).href);
        if ('data' in button.default && 'execute' in button.default) {
            client.buttons.set(button.default.data.data.custom_id, button.default);
        } else {
            console.log(`[WARNING] The button at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}