import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
} from "discord.js";
import {deferOptions} from "../../utils/deferOptions.ts";

export default {
    data: new ButtonBuilder()
        .setCustomId("no_support_button")
        .setLabel('❌ Non')
        .setStyle(ButtonStyle.Danger),
    async execute(interaction: ButtonInteraction) {
        await interaction.deferReply(deferOptions);
        await interaction.editReply("Annulation ❌");
        await interaction.message.delete();
        await interaction.editReply("Setup annulé !");
    }
};