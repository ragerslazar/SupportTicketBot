import {
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType
} from "discord.js";

import {updateGuildProfileField} from "../../services/ticketServices.ts";
import modalCustomMessageTicket from "../modals/setupTicket.ts"

export default {
    data: new ChannelSelectMenuBuilder()
        .setCustomId('ticket-setup-logging-channel')
        .setPlaceholder('Sélectionnez un channel pour les logs')
        .addChannelTypes(ChannelType.GuildText),

    async execute(interaction: ChannelSelectMenuInteraction) {
        try {
            await updateGuildProfileField(interaction, "channelLoggingId", interaction.values[0]);
            await interaction.message.delete();
            await interaction.showModal(modalCustomMessageTicket.data);
        } catch (error) {
            throw error;
        }
    }
}