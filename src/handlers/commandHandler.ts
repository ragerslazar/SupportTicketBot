import {CommandInteraction} from "discord.js";
import {deferOptions} from "../index";
import {setupTicketMessage} from "../functions/tickets/tickets";

export async function commandHandler(interaction: CommandInteraction) {
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (interaction.commandName === 'setup-ticket') {
        await interaction.deferReply(deferOptions);
        await setupTicketMessage();
        await interaction.editReply("Setup message envoyé !");
    }
}