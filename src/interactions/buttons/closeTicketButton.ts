import {ButtonBuilder, ButtonInteraction, ButtonStyle} from "discord.js";

export default {
    data: new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('🔒 Fermer le ticket')
        .setStyle(ButtonStyle.Danger),
    async execute(interaction: ButtonInteraction) {
        await interaction.reply("❌ Fermeture du ticket dans 5 secondes...");
        try {
            setTimeout(async ()=> {
                await interaction.channel!.delete();
            }, 5000);
        } catch (error) {
            console.error(error);
        }
    }
}