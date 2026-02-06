import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType
} from "discord.js";

import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";
import setupTicketSelectSupportCategory from "./resetupTicketSelectSupportCategory.ts";

export default {
    data: new ChannelSelectMenuBuilder()
        .setCustomId('ticket_setup_channel_select')
        .setPlaceholder('Sélectionnez un channel')
        .addChannelTypes(ChannelType.GuildText),

    async execute(interaction: ChannelSelectMenuInteraction) {
        try {
            const guildQuery = await getGuildProfileById(interaction);
            guildQuery.channelCreateTicket = interaction.values[0];

            guildQuery.save();
            const row2 = new ActionRowBuilder<ChannelSelectMenuBuilder>()
                .addComponents(setupTicketSelectSupportCategory.data);
            await interaction.update({content: "Choisissez une catégorie maintenant", components: [row2]});
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }
}