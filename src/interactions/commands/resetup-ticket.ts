import {
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder, TextChannel
} from "discord.js";
import yes_button from "../buttons/yesButton.ts";
import no_button from "../buttons/noButton.ts";
import {deferOptions} from "../../utils/deferOptions.ts";
import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";

export default {
    data: new SlashCommandBuilder().setName('resetup-ticket').setDescription('Permet de reconfigurer le système de ticket !'),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply(deferOptions);
        const guildQuery = await getGuildProfileById(interaction);

        if (guildQuery) {
            const embed = new EmbedBuilder()
                .setColor(0xff5555)
                .setTitle('⚠️ Modification de la configuration des tickets')
                .setDescription("Le système de ticket est déjà en place sur ce serveur.\n" +
                    "Souhaitez vous modifiez le channel d'envoie du message ou la catégorie de support ?")
                .setTimestamp()
                .setFooter({ text: 'MDTicketBot Support' });

            const closeRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(yes_button.data, no_button.data);

            await (interaction.channel as TextChannel).send({
                embeds: [embed],
                components: [closeRow],
            });

            await interaction.deleteReply();
        }
    },
};