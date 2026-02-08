import {
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType,
} from "discord.js";
import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";
import setupTicketModal from "../modals/setupTicket.ts";

export default {
    data: new ChannelSelectMenuBuilder()
        .setCustomId('ticket_setup_category_select')
        .setPlaceholder('Sélectionnez une categorie')
        .addChannelTypes(ChannelType.GuildCategory),

    async execute(interaction: ChannelSelectMenuInteraction):Promise<void> {
        try {
            const guildQuery = await getGuildProfileById(interaction);

            guildQuery.supportCategoryId = interaction.values[0];
            await guildQuery.save();
            await interaction.showModal(setupTicketModal.data);
            await interaction.message.delete();
        } catch (error) {
            throw error;
        }


    }
}