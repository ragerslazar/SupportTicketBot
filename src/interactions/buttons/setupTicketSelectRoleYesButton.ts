import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, RoleSelectMenuBuilder,
} from "discord.js";
import ticketSelectPingedRoles from "../roleSelectMenu/ticketSelectPingedRoles.ts";

export default {
    data: new ButtonBuilder()
        .setCustomId("ticket-select-role-yes-button")
        .setLabel('✅ Oui')
        .setStyle(ButtonStyle.Success),
    async execute(interaction: ButtonInteraction) {
        await interaction.message.delete();
        const row = new ActionRowBuilder<RoleSelectMenuBuilder>()
            .addComponents(ticketSelectPingedRoles.data);
        await interaction.reply({content: "Choisissez les rôles à mentionner dans le tickets:", components: [row]})
    }
};