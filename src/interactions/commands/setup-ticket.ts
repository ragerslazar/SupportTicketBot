 import {
        ActionRowBuilder,
        ButtonBuilder,
        ChannelType,
        ChatInputCommandInteraction, EmbedBuilder, MessageFlags,
        PermissionFlagsBits,
        SlashCommandBuilder,
        TextChannel
} from "discord.js";
import {guildProfile} from "../../schemas/guildProfile.ts";
import no_button from "../buttons/noButton.ts";
import yes_button from "../buttons/yesButton.ts";
import modal from "../modals/setupTicket.ts"
 import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";
 import {deferOptions} from "../../utils/deferOptions.ts";

export default {
        data: new SlashCommandBuilder()
            .setName('setup-ticket')
            .setDescription('Setup ticket message')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addChannelOption(option =>
                option
                    .setName("channel")
                    .setDescription("Channel ou sera envoyé le message pour pouvoir créer des tickets")
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildText)
            )
            .addChannelOption(option =>
                option
                    .setName("category")
                    .setDescription("Sélectionnez la catégorie où les tickets seront crées")
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildCategory)
            ),

        async execute(interaction: ChatInputCommandInteraction):Promise<void> {
                if (!interaction.inGuild()) {
                        await interaction.reply("Cette commande ne peux être executée seulement sur un serveur.");
                        return;
                }

                const target_channel: string = interaction.options.getChannel('channel')!.id;
                const target_category: string = interaction.options.getChannel('category')!.id;

                let guildQuery = await guildProfile.findOne({
                        guildId: interaction.guildId
                });

                if (guildQuery) {
                        await interaction.reply({content: "Le système de ticket a déjà été mis en place sur ce serveur. Veuillez utiliser `/resetup-ticket` pour le modifier.", flags: MessageFlags.Ephemeral});
                } else {
                        guildQuery = new guildProfile({
                                guildId: interaction.guildId,
                                supportCategoryId: target_category,
                                channelCreateTicket: target_channel
                        });
                        await interaction.showModal(modal.data);
                }
                await guildQuery.save();
        }
};