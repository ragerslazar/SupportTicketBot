import {buttonHandler} from "../handlers/buttonHandler.ts";
import {Events} from "discord.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: any) {
        if (interaction.isButton()) {
            await buttonHandler(interaction);
        } else if (interaction.isChatInputCommand()) {
            const command = await interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
}