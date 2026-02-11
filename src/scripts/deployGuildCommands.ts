import {REST, Routes} from 'discord.js';
import {TOKEN, BOT_ID, GUILD_ID} from "../../config.ts";
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from "node:url";

const commands = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foldersPath = path.join(__dirname, '../interactions/commands');
const commandFiles = fs.readdirSync(foldersPath).filter((file) => file.endsWith('.ts'));

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = await import(pathToFileURL(filePath).href);
    if ('data' in command.default && 'execute' in command.default) {
        commands.push(command.default.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const rest: REST = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(Routes.applicationGuildCommands(BOT_ID, GUILD_ID), { body: commands });

        // @ts-ignore
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();