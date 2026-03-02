import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType
} from "discord.js";

import {getGuildProfileById, updateGuildProfileField} from "../../services/ticketServices.ts";
import setupTicketSelectSupportCategory from "./setupTicketSelectSupportCategory.ts";

export default {
    data: new ChannelSelectMenuBuilder()
        .setCustomId('ticket_setup_channel_select')
        .setPlaceholder('Sélectionnez un channel')
        .addChannelTypes(ChannelType.GuildText),

    async execute(interaction: ChannelSelectMenuInteraction) {
        try {
            await updateGuildProfileField(interaction, "channelCreateTicketId", interaction.values[0])
            const row = new ActionRowBuilder<ChannelSelectMenuBuilder>()
                .addComponents(setupTicketSelectSupportCategory.data);
            await interaction.update({content: "Choisissez une catégorie où les tickets seront crées", components: [row]});
        } catch (error) {
            throw error;
        }
    }
}