import {REST, Routes} from "discord.js";
import {BOT_ID, TOKEN} from "../../var";
import {setup_ticket_command} from "../commands/setup-ticket";
import {ping_command} from "../commands/ping";

const commands = [setup_ticket_command, ping_command];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async ()=> {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(BOT_ID),
            { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error("Failed to deploy commands", error);
    }
})();