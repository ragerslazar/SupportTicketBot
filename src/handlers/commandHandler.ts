/// <reference path="../@types/discord.d.ts" />
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";
import {Client, Collection} from "discord.js";

export async function commandHandler(client: Client) {
    client.commands = new Collection();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const foldersPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(foldersPath).filter((file) => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, file);
        const command = await import(pathToFileURL(filePath).href);
        if ('data' in command.default && 'execute' in command.default) {
            client.commands.set(command.default.data.name, command.default);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}