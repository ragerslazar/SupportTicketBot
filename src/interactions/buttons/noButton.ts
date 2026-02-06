import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, MessageFlags,
} from "discord.js";

export default {
    data: new ButtonBuilder()
        .setCustomId("no_support_button")
        .setLabel('❌ Non')
        .setStyle(ButtonStyle.Danger),
    async execute(interaction: ButtonInteraction) {
        await interaction.reply({content: "Annulation ❌", flags: MessageFlags.Ephemeral});
        await interaction.message.delete();
        await interaction.editReply("Setup annulé !");
    }
};