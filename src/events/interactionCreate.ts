import {
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ChatInputCommandInteraction, DiscordAPIError,
    Events, MessageFlags, ModalSubmitInteraction
} from "discord.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: ChatInputCommandInteraction | ButtonInteraction | ChannelSelectMenuInteraction | ModalSubmitInteraction ): Promise<void> {
        try {
            let handler;

            if (interaction.isButton()) {
                handler = interaction.client.buttons.get(interaction.customId);
                if (!handler) {
                    console.error(`No button found.`);
                    return;
                }
            } else if (interaction.isChatInputCommand()) {
                handler = interaction.client.commands.get(interaction.commandName);
                if (!handler) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }
            } else if (interaction.isChannelSelectMenu()) {
                handler = interaction.client.channelSelectMenus.get(interaction.customId);
                if (!handler) {
                    console.error(`No channel select menu found.`);
                    return;
                }
            } else if (interaction.isModalSubmit()) {
                handler = interaction.client.modals.get(interaction.customId);
                if (!handler) {
                    console.error(`No modal found.`);
                    return;
                }
            }

            if (handler) {
                await handler.execute(interaction);
            }
        } catch (error) {
            if (error instanceof DiscordAPIError && error.code == 50013) {
                await interaction.followUp({content: "❌ Erreur ! Permissions manquantes !", flags: MessageFlags.Ephemeral});
                console.error(error.message);
            } else if (error instanceof Error) {
                await interaction.followUp({content: error.message, flags: MessageFlags.Ephemeral});
            } else {
                await interaction.followUp({content: "❌ Une erreur est survenue !", flags: MessageFlags.Ephemeral})
                console.error(error);
            }
        }
    }
}