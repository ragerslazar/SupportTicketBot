import {
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType
} from "discord.js";

import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";
import modalCustomMessageTicket from "../modals/setupTicket.ts"

export default {
    data: new ChannelSelectMenuBuilder()
        .setCustomId('ticket-setup-logging-channel')
        .setPlaceholder('Sélectionnez un channel pour les logs')
        .addChannelTypes(ChannelType.GuildText),

    async execute(interaction: ChannelSelectMenuInteraction) {
        try {
            const guildQuery = await getGuildProfileById(interaction);
            guildQuery.channelLoggingId = interaction.values[0];

            await guildQuery.save();
            await interaction.message.delete();
            await interaction.showModal(modalCustomMessageTicket.data);
        } catch (error) {
            throw error;
        }
    }
}