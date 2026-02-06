import {
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType,
    MessageFlags,
    TextChannel
} from "discord.js";
import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";
import {setupTicketMessage} from "../../functions/tickets.ts";

export default {
    data: new ChannelSelectMenuBuilder()
        .setCustomId('ticket_setup_category_select')
        .setPlaceholder('Sélectionnez une categorie')
        .addChannelTypes(ChannelType.GuildCategory),

    async execute(interaction: ChannelSelectMenuInteraction) {
        try {
            const guildQuery = await getGuildProfileById(interaction);

            guildQuery.supportCategoryId = interaction.values[0];
            await guildQuery.save();
            const target_channel = interaction.guild!.channels.cache.get(guildQuery.channelCreateTicket) as TextChannel;
            await setupTicketMessage(target_channel);
            await interaction.reply({content: "Setup terminé !", flags: MessageFlags.Ephemeral});
            await interaction.message.delete();
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }


    }
}