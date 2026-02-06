import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder,
    ActionRowBuilder,
} from "discord.js";

import setupTicketSelectChannel from "../channelSelectMenu/resetupTicketSelectChannel.ts";

export default {
    data: new ButtonBuilder()
        .setCustomId("yes_support_button")
        .setLabel('✅ Oui')
        .setStyle(ButtonStyle.Success),
    async execute(interaction: ButtonInteraction) {
        await interaction.message.delete();
        const row = new ActionRowBuilder<ChannelSelectMenuBuilder>()
            .addComponents(setupTicketSelectChannel.data);

        await interaction.reply({
            content: 'Choisissez un channel pour pouvoir créer les tickets:',
            components: [row]
        });
    }
};