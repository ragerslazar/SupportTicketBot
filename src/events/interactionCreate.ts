import {ButtonInteraction, ChatInputCommandInteraction, Events} from "discord.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: ChatInputCommandInteraction | ButtonInteraction) {
        if (interaction.isButton()) {
            const button = await interaction.client.buttons.get(interaction.customId);
            if (!button) {
                console.error(`No button found.`);
                return;
            }

            try {
                await button.execute(interaction);
            } catch (e) {
                console.error(e);
            }
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