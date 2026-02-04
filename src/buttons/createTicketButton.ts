import {ButtonBuilder, ButtonInteraction, ButtonStyle} from "discord.js";
import {deferOptions} from "../utils/deferOptions.ts";
import {checkExistingTickets} from "../functions/tickets/tickets.ts";


export default {
    data: new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('📩 Créer un Ticket')
        .setStyle(ButtonStyle.Primary),

    async execute(interaction: ButtonInteraction) {
        await interaction.deferReply(deferOptions);
        await checkExistingTickets(interaction);
    }
};