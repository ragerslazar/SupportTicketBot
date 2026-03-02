import {
    AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    GuildMember,
    PermissionFlagsBits,
    TextChannel
} from "discord.js";
import {delay} from "../../utils/delay.ts";
import {getAllMessagesFromChannel} from "../../functions/tickets.ts";
import {
    deleteRecordFromDatabase,
    getGuildProfileById, getTicketInfo
} from "../../services/ticketServices.ts";

export default {
    data: new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('🔒 Fermer le ticket')
        .setStyle(ButtonStyle.Danger),
    async execute(interaction: ButtonInteraction) {
        await interaction.deferReply();
        try {
            const guildQuery = await getGuildProfileById(interaction);
            const ticketQuery = await getTicketInfo(interaction, "channelId");

            if (guildQuery.channelLoggingId) {
                const channel: TextChannel = interaction.channel as TextChannel;
                const messages = await getAllMessagesFromChannel(channel);
                const loggingChannel: TextChannel = interaction.guild!.channels.cache.get(guildQuery.channelLoggingId) as TextChannel;

                const attachment = new AttachmentBuilder(Buffer.from(messages, 'utf-8'), { name: `${ticketQuery!.ownerId}.txt` });
                await loggingChannel.send({
                    content: `ownerId: ${ticketQuery!.ownerId}`,
                    files: [attachment]
                });
            }

            const isOwner: boolean = interaction.user.id === ticketQuery!.ownerId;
            const isClaimer: boolean = interaction.user.id === ticketQuery!.claimedBy;
            const isAdmin: boolean = (interaction.member as GuildMember).permissions.has(PermissionFlagsBits.Administrator);

            if (ticketQuery?.claimedBy && !isOwner && !isClaimer && !isAdmin) {
                await interaction.deleteReply();
                return;
            }
            await interaction.editReply(`❌ <@${ticketQuery!.ownerId}> Fermeture du ticket dans 5 secondes...`);
            await delay(5000);
            await interaction.channel!.delete();

            await deleteRecordFromDatabase(ticketQuery);
        } catch (error) {
            throw error;
        }
    }
}