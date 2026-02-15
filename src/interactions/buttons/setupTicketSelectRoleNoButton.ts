import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, EmbedBuilder
} from "discord.js";
import no_button from "../buttons/setupTicketLoggingNoButton.ts";

export default {
    data: new ButtonBuilder()
        .setCustomId("ticket-select-role-no-button")
        .setLabel('❌ Non')
        .setStyle(ButtonStyle.Danger),
    async execute(interaction: ButtonInteraction) {
        await interaction.message.delete();

        const embed = new EmbedBuilder()
            .setColor(0xff5555)
            .setTitle('⚠️ Souhaitez vous loggez les tickets ?')
            .setDescription("Lorsqu'un ticket est fermé, une sauvegarde du ticket est créer dans un channel de log.\n" +
                "Vous pourrez ainsi télécharger le le contenu du ticket.")
            .setTimestamp()
            .setFooter({ text: 'MDTicketBot Support' });

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(no_button.data);
    }
};