import { REST, Routes } from 'discord.js';

import {TOKEN, BOT_ID, GUILD_ID} from "../../config.ts";

const commandId = process.argv[2];

if (!commandId) {
    console.log('Usage : npm run delete-command <COMMAND_ID>');
    process.exit(1);
}

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log(`🗑️ Suppression de la commande ${commandId}...`);

        await rest.delete(
            Routes.applicationGuildCommand(BOT_ID, GUILD_ID, commandId)
        );

        console.log('✅ Commande supprimée avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
    }
})();