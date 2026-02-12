import {MOD_ROLE_ID} from "../../config.ts";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    CategoryChannel, ChannelType,
    EmbedBuilder,
    TextChannel
} from "discord.js";

import createTicketButton from "../interactions/buttons/createTicketButton.ts";
import closeTicketButton from "../interactions/buttons/closeTicketButton.ts";
import {getGuildProfileById} from "../utils/getGuildProfileById.ts";

export async function setupTicketMessage(target_channel: string, title: string, content: string, interaction: any): Promise<void> {
    try {
        const channel = interaction.guild!.channels.cache.get(target_channel) as TextChannel;
        const message = new EmbedBuilder()
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

export async function checkExistingTickets(interaction: ButtonInteraction) {
    try {
        const guildQuery = await getGuildProfileById(interaction);

        const supportCategory = guildQuery.supportCategoryId!;

        const category = interaction.guild!.channels.cache.get(supportCategory) as CategoryChannel;
        const channels = category.children.cache;
        const existing_channel = channels.find(channel => channel.name === `ticket-${interaction.user.id}`);

        if (existing_channel) {
            await interaction.editReply(`❌ Vous avez déjà un ticket en cours ! <#${existing_channel.id}>`)
        } else {
            const userTicketChannel = await category.children.create({
                name: `ticket-${interaction.user.id}`,
                type: ChannelType.GuildText,
                topic: `Pseudo discord de l'utilisateur: ${interaction.user.tag}`,
            });

            await userTicketChannel.permissionOverwrites.create(interaction.user.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
            })
            await interaction.editReply(`✅ Votre ticket <#${userTicketChannel.id}> a été crée !`)

            await userTicketChannel.send(`<@${interaction.user.id}> <@&${MOD_ROLE_ID}>`);

            const ticketEmbed = new EmbedBuilder()
                .setColor(0xff5555)
                .setTitle('🎫 Ticket ouvert')
                .setDescription(
                    'Bonjour 👋\n\n' +
                    'Merci d’avoir ouvert un ticket.\n' +
                    'Expliquez clairement votre problème ou votre demande, ' +
                    'un membre du staff vous répondra dès que possible.'
                )
                .setTimestamp()
                .setFooter({ text: 'MDTicketBot Support' });


            const closeRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(closeTicketButton.data);

            await userTicketChannel.send({
                embeds: [ticketEmbed],
                components: [closeRow]
            });
        }
    } catch (error) {
        throw error;
    }
}

export async function getAllMessagesFromChannel(channel: TextChannel){
    let messages: string[] = [];
    let message = await channel.messages
        .fetch({ limit: 1 })
        .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

    if (message && messages.length > 0) {
        messages.push(`${message.author.tag} (${message.author.id}): ${message.content}`);
    }

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