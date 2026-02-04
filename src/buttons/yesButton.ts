import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, MessageFlags,
} from "discord.js";

export default {
    data: new ButtonBuilder()
        .setCustomId("yes_support_button")
        .setLabel('✅ Oui')
        .setStyle(ButtonStyle.Success),
    async execute(interaction: ButtonInteraction) {
        await interaction.reply({content: "Button ✅", flags: MessageFlags.Ephemeral});
    },
};