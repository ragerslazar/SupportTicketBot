/// <reference path="../@types/discord.d.ts" />
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";
import {Client, Collection} from "discord.js";

export async function modalHandler(client: Client) {
    client.modals = new Collection();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const foldersPath = path.join(__dirname, '../interactions/modals');
    const commandFiles = fs.readdirSync(foldersPath).filter((file) => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, file);
        const modal = await import(pathToFileURL(filePath).href);
        if ('data' in modal.default && 'execute' in modal.default) {
            client.modals.set(modal.default.data.data.custom_id, modal.default);
        } else {
            console.log(`[WARNING] The modal at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}