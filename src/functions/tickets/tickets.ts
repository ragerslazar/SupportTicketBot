import {MOD_ROLE_ID, SUPPORT_CATEGORY} from "../../../config.ts";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    CategoryChannel, ChannelType,
    EmbedBuilder,
    TextChannel
} from "discord.js";

import createTicketButton from "../../buttons/createTicketButton.ts";
import closeTicketButton from "../../buttons/closeTicketButton.ts";

export async function setupTicketMessage(target_channel: TextChannel) {
    const message = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('✉️ Tickets')
        .setDescription('En cas de problèmes ou de questions, veuillez ouvrir un ticket.\n Un membre du staff vous répondra au plus vite.')
        .setTimestamp()
        .setFooter({ text: 'MDTicketBot Support' });


    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(createTicketButton.data);

    await target_channel.send({
        embeds: [message],
        components: [row]
    });
}

export async function checkExistingTickets(interaction: ButtonInteraction) {
    const category = interaction.guild!.channels.cache.get(SUPPORT_CATEGORY) as CategoryChannel;
    if (!category) {
        console.error("Categorie de support introuvable !")
        return;
    }

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

        userTicketChannel.permissionOverwrites.create(interaction.user.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
        })
        await interaction.editReply(`✅ Votre ticket <#${userTicketChannel.id}> a été crée !`)

        await userTicketChannel.send(`<@${interaction.user.id}> <@&${MOD_ROLE_ID}>`)

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
}