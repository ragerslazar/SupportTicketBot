import {guildProfile} from "../schemas/guildProfile.ts";
import {MessageFlags} from "discord.js";

export async function getGuildProfileById(interaction: any) {
    const guild = interaction.guildId;
    const guildQuery = await guildProfile.findOne({
        guildId: guild
    });

    if (!guildQuery) {
        await interaction.message.delete();
        await interaction.followUp({content: "Votre serveur n'a pas été enregistré par le bot. Veuillez utiliser la commande `/setup-ticket`", flags: MessageFlags.Ephemeral});
        throw new Error("guildProfile not found in database.");
    } else {
        return guildQuery;
    }
}