import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    RoleSelectMenuBuilder,
    RoleSelectMenuInteraction
} from "discord.js";
import {getGuildProfileById, updateGuildProfileField} from "../../services/ticketServices.ts";
import no_button from "../buttons/setupTicketLoggingNoButton.ts";
import yes_button from "../buttons/setupTicketLoggingYesButton.ts";
import {guildProfileSchema} from "../../schemas/guildProfileSchema.ts";
export default {
    data: new RoleSelectMenuBuilder()
        .setCustomId("ticket-roles-select-pinged")
        .setMaxValues(3)
        .setRequired(true),

    async execute(interaction: RoleSelectMenuInteraction) {
        await interaction.deferReply();
        const selectedRoles = interaction.roles;
        const roleList = selectedRoles.map(role => `<@&${role.id}>`).join(' ');
        await updateGuildProfileField(interaction, "staffRoles", roleList);
        await interaction.message.delete();

        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(0xff5555)
            .setTitle('⚠️ Souhaitez vous loggez les tickets ?')
            .setDescription("Lorsqu'un ticket est fermé, une sauvegarde du ticket est créer dans un channel de log.\n" +
                "Vous pourrez ainsi télécharger le le contenu du ticket.")
            .setTimestamp()
            .setFooter({ text: 'MDTicketBot Support' });

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(yes_button.data, no_button.data);

        await interaction.editReply({embeds: [embed], components: [row]});
    }
}