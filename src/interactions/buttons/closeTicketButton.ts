import {AttachmentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, TextChannel} from "discord.js";
import {delay} from "../../utils/delay.ts";
import {getAllMessagesFromChannel} from "../../functions/tickets.ts";
import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";

export default {
    data: new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('🔒 Fermer le ticket')
        .setStyle(ButtonStyle.Danger),
    async execute(interaction: ButtonInteraction) {
        await interaction.deferReply();
        try {
            const channel: TextChannel = interaction.channel as TextChannel;
            const messages = await getAllMessagesFromChannel(channel);
            const guildQuery = await getGuildProfileById(interaction);

            if (guildQuery.channelLoggingId != undefined) {
                const loggingChannel: TextChannel = interaction.guild!.channels.cache.get(guildQuery.channelLoggingId) as TextChannel;

                const attachment = new AttachmentBuilder(Buffer.from(messages, 'utf-8'), { name: `${interaction.channelId}.txt` });
                await loggingChannel.send({
                    files: [attachment]
                });
            }

            await interaction.editReply("❌ Fermeture du ticket dans 5 secondes...");
            await delay(5000);
            await interaction.channel!.delete();
        } catch (error) {
            throw error;
        }
    }
}