import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType
} from "discord.js";

import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";
import setupTicketSelectSupportCategory from "./setupTicketSelectSupportCategory.ts";

export default {
    data: new ChannelSelectMenuBuilder()
        .setCustomId('ticket_setup_channel_select')
        .setPlaceholder('Sélectionnez un channel')
        .addChannelTypes(ChannelType.GuildText),

    async execute(interaction: ChannelSelectMenuInteraction) {
        try {
            const guildQuery = await getGuildProfileById(interaction);
            guildQuery.channelCreateTicketId = interaction.values[0];

            await guildQuery.save();
            const row = new ActionRowBuilder<ChannelSelectMenuBuilder>()
                .addComponents(setupTicketSelectSupportCategory.data);
            await interaction.update({content: "Choisissez une catégorie où les tickets seront crées", components: [row]});
        } catch (error) {
            throw error;
        }
    }
}