import {ButtonBuilder, ButtonInteraction, ButtonStyle, DiscordAPIError, MessageFlags} from "discord.js";
import {delay} from "../../utils/delay.ts";

export default {
    data: new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('🔒 Fermer le ticket')
        .setStyle(ButtonStyle.Danger),
    async execute(interaction: ButtonInteraction) {
        try {
            await interaction.reply("❌ Fermeture du ticket dans 5 secondes...");
            await delay(5000);
            await interaction.channel!.delete();
        } catch (error) {
            throw error;
        }
    }
}