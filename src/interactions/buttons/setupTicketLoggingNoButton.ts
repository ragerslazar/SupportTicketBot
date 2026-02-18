import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle
} from "discord.js";
import modalCustomMessageTicket from "../modals/setupTicket.ts"
import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";
import {guildProfile} from "../../schemas/guildProfile.ts";

export default {
    data: new ButtonBuilder()
        .setCustomId("ticket-logging-no-button")
        .setLabel('❌ Non')
        .setStyle(ButtonStyle.Danger),
    async execute(interaction: ButtonInteraction) {
        await interaction.message.delete();

        await guildProfile.findOneAndUpdate(
            { guildId: interaction.guildId },
            { $unset: { channelLoggingId: "" } }
        );

        await interaction.showModal(modalCustomMessageTicket.data);
    }
};