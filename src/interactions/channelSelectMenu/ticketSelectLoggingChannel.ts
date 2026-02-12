import {
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType,
} from "discord.js";
import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";
import setupTicketModal from "../modals/setupTicket.ts";

export default {
    data: new ChannelSelectMenuBuilder()
        .setCustomId('ticket_setup_logging_channel')
        .setPlaceholder('Sélectionnez un channel pour logez vos tickets')
        .addChannelTypes(ChannelType.GuildText),

    async execute(interaction: ChannelSelectMenuInteraction):Promise<void> {
        try {
            const guildQuery = await getGuildProfileById(interaction);

            guildQuery.channelLoggingId = interaction.values[0]; //reprendre ici (demander si on veut log, si oui on montre ce channel select, si non ba on show le modal direct)
            await guildQuery.save();
            await interaction.showModal(setupTicketModal.data);
            await interaction.message.delete();
        } catch (error) {
            throw error;
        }


    }
}