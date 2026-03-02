import {ButtonBuilder, ButtonInteraction, ButtonStyle} from "discord.js";
import ticketForm from "../modals/ticketForm.ts"


export default {
    data: new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('📩 Créer un Ticket')
        .setStyle(ButtonStyle.Primary),

    async execute(interaction: ButtonInteraction): Promise<void> {
        await interaction.showModal(ticketForm.data)
    }
};