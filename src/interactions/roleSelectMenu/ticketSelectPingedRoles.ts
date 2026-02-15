import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    RoleSelectMenuBuilder,
    RoleSelectMenuInteraction
} from "discord.js";
import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";
import no_button from "../buttons/setupTicketLoggingNoButton.ts";
export default {
    data: new RoleSelectMenuBuilder()
        .setCustomId("ticket-roles-select-pinged")
        .setMaxValues(3)
        .setRequired(true),

    async execute(interaction: RoleSelectMenuInteraction) {
        await interaction.deferReply();
        const selectedRoles = interaction.roles;
        const roleList = selectedRoles.map(role => `<@&${role.id}>`).join(' ');
        const guildQuery = await getGuildProfileById(interaction);

        guildQuery.staffRoles = roleList;
        await guildQuery.save();
        await interaction.message.delete();

        const embed = new EmbedBuilder()
            .setColor(0xff5555)
            .setTitle('⚠️ Souhaitez vous loggez les tickets ?')
            .setDescription("Lorsqu'un ticket est fermé, une sauvegarde du ticket est créer dans un channel de log.\n" +
                "Vous pourrez ainsi télécharger le le contenu du ticket.")
            .setTimestamp()
            .setFooter({ text: 'MDTicketBot Support' });

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(no_button.data);

    }
}