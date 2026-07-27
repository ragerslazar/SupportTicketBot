import {
    ActionRowBuilder,
    ButtonBuilder,
    CategoryChannel, ChannelType,
    EmbedBuilder, ModalSubmitInteraction,
    TextChannel
} from "discord.js";

import createTicketButton from "../interactions/buttons/createTicketButton.ts";
import closeTicketButton from "../interactions/buttons/closeTicketButton.ts";
import claimTicket from "../interactions/buttons/claimTicketButton.ts";
import {createTicketSchema, getGuildProfileById, getTicketInfo} from "../services/ticketServices.ts";
import {EMBED_COLOR} from "../../config.ts";
import {ticketSchema} from "../schemas/ticketSchema.ts";

export async function setupTicketMessage(target_channel: string, title: string, content: string, interaction: any): Promise<void> {
    try {
        const channel = interaction.guild!.channels.cache.get(target_channel) as TextChannel;
        const message  = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(title)
            .setDescription(content)
            .setTimestamp()
            .setFooter({ text: 'MDTicketBot Support' });

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(createTicketButton.data);

        await channel.send({
            embeds: [message],
            components: [row]
        });
    } catch (error) {
        throw error;
    }
}

export async function checkExistingTickets(interaction: ModalSubmitInteraction, username: string, ticket_content: string): Promise<void> {
    try {
        const guildQuery = await getGuildProfileById(interaction);
        let ticketQuery = await getTicketInfo(interaction, "ownerId");

        const isOwner: string | undefined = ticketQuery?.ownerId
        const supportCategory: string = guildQuery.supportCategoryId!;

        const category = interaction.guild!.channels.cache.get(supportCategory) as CategoryChannel;

        if (isOwner) {
            await interaction.editReply(`❌ Vous avez déjà un ticket en cours ! <#${ticketQuery!.channelId}>`)
        } else {
            const userTicketChannel: TextChannel = await category.children.create({
                name: `ticket-${interaction.user.tag}`,
                type: ChannelType.GuildText,
                topic: `Pseudo discord de l'utilisateur: ${interaction.user.tag}`,
            });

            await createTicketSchema(interaction, userTicketChannel);

            await userTicketChannel.permissionOverwrites.create(interaction.user.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
            })

            await interaction.editReply(`✅ Votre ticket <#${userTicketChannel.id}> a été crée !`)

            const staffRoles: string | null | undefined = guildQuery.staffRoles;

            if (staffRoles != undefined) {
                await userTicketChannel.send(`<@${interaction.user.id}> ${staffRoles}`);
            } else {
                await userTicketChannel.send(`<@${interaction.user.id}>`);
            }

            const ticketEmbed: EmbedBuilder = new EmbedBuilder()
                .setColor(EMBED_COLOR)
                .setTitle('🎫 Ticket ouvert')
                .setDescription(
                    "Pseudo:" +
                    '```' +
                    `${username}` +
                    '```' +
                    'Objet de la demande' +
                    '```' +
                    `${ticket_content}` +
                    '```' +
                    '\nMerci de rester polis et patient avec le staff.\nVeuillez également ne pas les mentionner.'
                )
                .setTimestamp()
                .setFooter({ text: 'MDTicketBot Support' });


            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(claimTicket.data ,closeTicketButton.data);


            await userTicketChannel.send({
                embeds: [ticketEmbed],
                components: [row]
            });
        }
    } catch (error) {
        throw error;
    }
}

export async function getAllMessagesFromChannel(channel: TextChannel): Promise<string> {
    let messages: string[] = [];
    let message = await channel.messages
        .fetch({ limit: 1 })
        .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

    // if (message && messages.length > 0) {
    //     messages.push(`${message.author.tag} (${message.author.id}): ${message.content}`);
    // }

    while (message) {
        await channel.messages
            .fetch({ limit: 100, before: message.id })
            .then(messagePage => {
                messagePage.forEach(msg => {
                    if (msg.content.length > 0) {
                        messages.push(`${msg.author.tag} (${msg.author.id}): ${msg.content}`);
                    }
                });

                message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            });
    }
    return (messages.reverse()).join('\n');
}