import {ButtonInteraction} from "discord.js";
import {deferOptions} from "../utils/deferOptions.ts";
import {checkExistingTickets} from "../functions/tickets/tickets.ts";


export async function buttonHandler(interaction: ButtonInteraction) {
    if (interaction.customId === "create_ticket") {
        await interaction.deferReply(deferOptions);
        await checkExistingTickets(interaction);

    } else if (interaction.customId === "close_ticket") {
        await interaction.reply("❌ Fermeture du ticket dans 5 secondes...");
        try {
            setTimeout(async ()=> {
                await interaction.channel!.delete();
            }, 5000);
        } catch (error) {
            console.error(error);
        }
    }
}