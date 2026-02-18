import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder
} from "discord.js";

import setupTicketLoggingChannel from "../channelSelectMenu/setupTicketLoggingChannel.ts";

export default {
    data: new ButtonBuilder()
        .setCustomId("ticket-logging-yes-button")
        .setLabel('✅ Oui')
        .setStyle(ButtonStyle.Success),
    async execute(interaction: ButtonInteraction) {
        await interaction.message.delete();
        const row = new ActionRowBuilder<ChannelSelectMenuBuilder>()
            .addComponents(setupTicketLoggingChannel.data);

        await interaction.reply({content: "Selectionnez un channel ou sauvegarder les logs: ", components: [row]})
    }
};