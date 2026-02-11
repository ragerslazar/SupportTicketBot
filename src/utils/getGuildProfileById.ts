import {guildProfile} from "../schemas/guildProfile.ts";

export async function getGuildProfileById(interaction: any) {
    const guild = interaction.guildId;
    const guildQuery = await guildProfile.findOne({
        guildId: guild
    });

    if (!guildQuery) {
        if (interaction.message) {
            await interaction.message.delete();
        }
        throw new Error("Votre serveur n'a pas été enregistré par le bot. Veuillez utiliser la commande `/setup-ticket`");
    } else {
        return guildQuery;
    }
}