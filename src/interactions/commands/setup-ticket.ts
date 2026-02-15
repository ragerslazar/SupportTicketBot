 import {
        ActionRowBuilder, ChannelSelectMenuBuilder,
        ChannelType,
        ChatInputCommandInteraction, MessageFlags,
        PermissionFlagsBits,
        SlashCommandBuilder
} from "discord.js";
import setupTicketSelectChannel from "../channelSelectMenu/setupTicketSelectChannel.ts";
import {guildProfile} from "../../schemas/guildProfile.ts";
import modal from "../modals/setupTicket.ts"

export default {
        data: new SlashCommandBuilder()
            .setName('setup-ticket')
            .setDescription('Setup ticket message')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        async execute(interaction: ChatInputCommandInteraction):Promise<void> {
                if (!interaction.inGuild()) {
                        await interaction.reply("Cette commande ne peux être executée seulement sur un serveur.");
                        return;
                }

                let guildQuery = await guildProfile.findOne({
                        guildId: interaction.guildId
                });

                if (guildQuery) {
                        await interaction.reply({content: "Le système de ticket a déjà été mis en place sur ce serveur. Veuillez utiliser `/resetup-ticket` pour le modifier.", flags: MessageFlags.Ephemeral});
                } else {
                        guildQuery = new guildProfile({
                                guildId: interaction.guildId,
                        });
                        await guildQuery.save();
                        const row = new ActionRowBuilder<ChannelSelectMenuBuilder>()
                            .addComponents(setupTicketSelectChannel.data);

                        await interaction.reply({
                                content: 'Choisissez un channel pour pouvoir créer les tickets:',
                                components: [row]
                        });
                }
        }
};