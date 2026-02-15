/// <reference path="../@types/discord.d.ts" />
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";
import {Client, Collection, SlashCommandBuilder} from "discord.js";

export async function interactionsHandler(client: Client) {
    client.interactions_collection = new Collection();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const foldersPath = path.join(__dirname, '../interactions');
    const interactionFolders = fs.readdirSync(foldersPath);

    for (const folder of interactionFolders) {
        const interactionPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(interactionPath).filter((file) => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const filePath = path.join(interactionPath, file);
            const itr = await import(pathToFileURL(filePath).href);
            if ('data' in itr.default && 'execute' in itr.default) {
                if (itr.default.data instanceof SlashCommandBuilder) {
                    client.interactions_collection.set(itr.default.data.name, itr.default);
                } else {
                    client.interactions_collection.set(itr.default.data.data.custom_id, itr.default);
                }
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}

