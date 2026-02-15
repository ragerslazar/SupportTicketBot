import {
    ActionRowBuilder, ButtonBuilder,
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType, EmbedBuilder,
} from "discord.js";
import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";
import yes_button from "../buttons/setupTicketSelectRoleYesButton.ts";
import no_button from "../buttons/setupTicketSelectRoleNoButton.ts";

export default {
    data: new ChannelSelectMenuBuilder()
        .setCustomId('ticket_setup_category_select')
        .setPlaceholder('Sélectionnez une categorie')
        .addChannelTypes(ChannelType.GuildCategory),

    async execute(interaction: ChannelSelectMenuInteraction):Promise<void> {
        try {
            await interaction.deferReply();
            const guildQuery = await getGuildProfileById(interaction);

            guildQuery.supportCategoryId = interaction.values[0];
            await guildQuery.save();
            await interaction.message.delete();

            const embed = new EmbedBuilder()
                .setColor(0xff5555)
                .setTitle('⚠️ Souhaitez vous ping certains rôles dans les tickets ?')
                .setDescription("Vous aurez la possibilité lorsqu'un ticket est créer,\n" +
                    "de choisir de ping automatiquement certains rôles.")
                .setTimestamp()
                .setFooter({ text: 'MDTicketBot Support' });

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(yes_button.data, no_button.data);

            await interaction.editReply({embeds: [embed], components: [row]})
        } catch (error) {
            throw error;
        }


    }
}