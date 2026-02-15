import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle
} from "discord.js";

export default {
    data: new ButtonBuilder()
        .setCustomId("ticket-logging-yes-button")
        .setLabel('✅ Oui')
        .setStyle(ButtonStyle.Success),
    async execute(interaction: ButtonInteraction) {
        await interaction.message.delete();

    }
};