import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    GuildMember,
    PermissionFlagsBits,
    TextChannel
} from "discord.js";

import closeTicketButton from "../../interactions/buttons/closeTicketButton.ts";
import {deferOptions} from "../../utils/deferOptions.ts";
import {getTicketInfo} from "../../services/ticketServices.ts";

export default {
    data: new ButtonBuilder()
        .setCustomId('claim-ticket')
        .setLabel('🔒 Claim le ticket')
        .setStyle(ButtonStyle.Primary),

    async execute(interaction: ButtonInteraction): Promise<void> {
        await interaction.deferReply(deferOptions);
        const ticketQuery = await getTicketInfo(interaction, "channelId");
        const ticket_channel = interaction.channel! as TextChannel;
        const member = interaction.member as GuildMember;

        if (!member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            throw new Error("Vous n'avez pas la permission de claim le ticket !");
        }

        const claimButton = ButtonBuilder.from(interaction.component)
            .setDisabled(true);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(claimButton, closeTicketButton.data);

        await interaction.message.edit({ components: [row] });

        await ticket_channel.permissionOverwrites.create(interaction.user.id, {
            SendMessages: true
        })

        ticketQuery!.claimedBy = interaction.user.id;
        await ticketQuery!.save()

        await interaction.deleteReply();
        await ticket_channel.send(`<@${ticketQuery!.ownerId}>, <@${member.id}> va traiter votre demande !`);
    }
};