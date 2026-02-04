 import {
        ActionRowBuilder,
        ButtonBuilder, ButtonStyle,
        CategoryChannel,
        ChannelType,
        ChatInputCommandInteraction, EmbedBuilder,
        PermissionFlagsBits,
        SlashCommandBuilder,
        TextChannel
} from "discord.js";
import {deferOptions} from "../utils/deferOptions.ts";
import {setupTicketMessage} from "../functions/tickets/tickets.ts";
import {test} from "../schemas/guildProfile.ts";

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
                const target_category: CategoryChannel = interaction.options.getChannel('category')!;

                let gprofile = await test.findOne({
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

                        const yesButton = new ButtonBuilder()
                            .setCustomId('yes__support_button')
                            .setLabel('✅ Oui')
                            .setStyle(ButtonStyle.Success);

                        const noButton = new ButtonBuilder()
                            .setCustomId('no_support_button')
                            .setLabel('❌ Non')
                            .setStyle(ButtonStyle.Danger);


                        const closeRow = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(yesButton, noButton);

                        await interaction.channel!.send({
                                embeds: [embed],
                                components: [closeRow]
                        });

                        await interaction.editReply("Pas si vite !");
                } else {
                        gprofile = new test({
                                guildId: interaction.guildId,
                                supportCategory: target_category
                        });
                        console.log(`Guild créée dans la DB : ${interaction.guildId}`);
                        await setupTicketMessage(target_channel);
                        await interaction.editReply("Setup message envoyé !");
                }

                await gprofile.save();


        }
};