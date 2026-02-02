import {ButtonInteraction} from "discord.js";
import {deferOptions} from "../index";
import {checkExistingTickets} from "../functions/tickets/tickets";

export async function buttonHandler(interaction: ButtonInteraction) {
    if (interaction.customId === "create_ticket") {
        await interaction.deferReply(deferOptions);
        await checkExistingTickets(interaction);

    } else if (interaction.customId === "close_ticket") {
        await interaction.reply("❌ Fermeture du ticket dans 5 secondes...");
        setTimeout(async ()=> {
            await interaction.channel!.delete();
        }, 5000);
    }
}