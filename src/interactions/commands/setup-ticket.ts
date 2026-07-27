 import {
        ActionRowBuilder, ButtonBuilder, ChannelSelectMenuBuilder,
        ChatInputCommandInteraction, EmbedBuilder,
        PermissionFlagsBits,
        SlashCommandBuilder
} from "discord.js";
import {guildProfileSchema} from "../../schemas/guildProfileSchema.ts";
 import setupTicketSelectChannel from "../channelSelectMenu/setupTicketSelectChannel.ts";
 import yes_button from "../buttons/resetupTicketYesButton.ts";
 import no_button from "../buttons/resetupTicketNoButton.ts";
 import {createGuildProfileSchema} from "../../services/ticketServices.ts";

export default {
        data: new SlashCommandBuilder()
            .setName('setup-ticket')
            .setDescription('Setup ticket message')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        async execute(interaction: ChatInputCommandInteraction):Promise<void> {
                if (!interaction.inGuild()) {
                        await interaction.reply("Cette commande ne peut être executée seulement sur un serveur.");
                        return;
                }

                let guildQuery = await guildProfileSchema.findOne({
                        guildId: interaction.guildId
                });

                if (guildQuery) {
                        const embed: EmbedBuilder = new EmbedBuilder()
                            .setColor(0xff5555)
                            .setTitle('⚠️ Le système de ticket est déjà mis en place sur ce serveur !')
                            .setDescription("Souhaitez vous relancer la configuration dans le but de la modifier ?")
                            .setTimestamp()
                            .setFooter({ text: 'MDTicketBot Support' });

                        const row = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(yes_button.data, no_button.data);

                        await interaction.reply({embeds: [embed], components: [row]});
                } else {
                        guildQuery = await createGuildProfileSchema(interaction);
                        const row = new ActionRowBuilder<ChannelSelectMenuBuilder>()
                            .addComponents(setupTicketSelectChannel.data);

                        await interaction.reply({
                                content: 'Choisissez un channel pour pouvoir créer les tickets:',
                                components: [row]
                        });
                }
        }
};