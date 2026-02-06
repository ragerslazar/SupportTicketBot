 import {
        ActionRowBuilder,
        ButtonBuilder,
        ChannelType,
        ChatInputCommandInteraction, EmbedBuilder, MessageFlags,
        PermissionFlagsBits,
        SlashCommandBuilder,
        TextChannel
} from "discord.js";
import {deferOptions} from "../../utils/deferOptions.ts";
import {setupTicketMessage} from "../../functions/tickets.ts";
import {guildProfile} from "../../schemas/guildProfile.ts";
import no_button from "../buttons/noButton.ts";
import yes_button from "../buttons/yesButton.ts";

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

        async execute(interaction: ChatInputCommandInteraction) {
                if (!interaction.inGuild()) {
                        await interaction.reply("Cette commande ne peux être executée seulement sur un serveur.");
                        return;
                }
                await interaction.deferReply(deferOptions);
                const target_channel: TextChannel = interaction.options.getChannel('channel')!;
                const target_category: string = interaction.options.getChannel('category')!.id;

                let gprofile = await guildProfile.findOne({
                        guildId: interaction.guildId
                });

                if (gprofile) {
                        const embed = new EmbedBuilder()
                            .setColor(0xff5555)
                            .setTitle('⚠️ Vous avez déjà setup le système de ticket !')
                            .setDescription("Le système de ticket est déjà setup sur ce serveur.\n" +
                                "Souhaitez vous modifiez le channel d'envoie du message ou la catégorie de support ?")
                            .setTimestamp()
                            .setFooter({ text: 'MDTicketBot Support' });


                        const closeRow = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(yes_button.data, no_button.data);

                        await interaction.channel!.send({
                                embeds: [embed],
                                components: [closeRow],
                        });

                        await interaction.deleteReply();
                } else {
                        gprofile = new guildProfile({
                                guildId: interaction.guildId,
                                supportCategoryId: target_category,
                                channelCreateTicket: target_channel.id
                        });
                        await setupTicketMessage(target_channel);
                        await interaction.editReply("Setup message envoyé !");
                }
                await gprofile.save();
        }
};