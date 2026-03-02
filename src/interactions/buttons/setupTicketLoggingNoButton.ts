import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle
} from "discord.js";
import modalCustomMessageTicket from "../modals/setupTicket.ts"
import {deleteChannelLoggingId} from "../../services/ticketServices.ts";

export default {
    data: new ButtonBuilder()
        .setCustomId("ticket-logging-no-button")
        .setLabel('❌ Non')
        .setStyle(ButtonStyle.Danger),
    async execute(interaction: ButtonInteraction) {
        await interaction.message.delete();

        await deleteChannelLoggingId(interaction)

        await interaction.showModal(modalCustomMessageTicket.data);
    }
};