import {
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ChatInputCommandInteraction, DiscordAPIError,
    Events, MessageFlags, ModalSubmitInteraction, RoleSelectMenuInteraction
} from "discord.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: ChatInputCommandInteraction | ButtonInteraction | ChannelSelectMenuInteraction | ModalSubmitInteraction | RoleSelectMenuInteraction ): Promise<void> {
        try {
            if (!interaction.inGuild()) return;
            let handler;

            if (interaction.isButton()) {
                handler = interaction.client.interactions_collection.get(interaction.customId);
                if (!handler) {
                    console.error(`No button found.`);
                    return;
                }
            } else if (interaction.isChatInputCommand()) {
                handler = interaction.client.interactions_collection.get(interaction.commandName);
                if (!handler) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }
            } else if (interaction.isChannelSelectMenu()) {
                handler = interaction.client.interactions_collection.get(interaction.customId);
                if (!handler) {
                    console.error(`No channel select menu found.`);
                    return;
                }
            } else if (interaction.isRoleSelectMenu()) {
                handler = interaction.client.interactions_collection.get(interaction.customId);
                if (!handler) {
                    console.error(`No role select menu found.`);
                    return;
                }
            }
            else if (interaction.isModalSubmit()) {
                handler = interaction.client.interactions_collection.get(interaction.customId);
                if (!handler) {
                    console.error(`No modal found.`);
                    return;
                }
            }

            if (handler) {
                await handler.execute(interaction);
            }
        } catch (error) {
            console.error(error);
            if (error instanceof DiscordAPIError && error.code == 50013) {
                await interaction.followUp({content: "❌ Erreur ! Permission(s) manquante(s) !"});
            } else if (error instanceof DiscordAPIError && error.code == 50001) {
                await interaction.followUp({content: `❌ Erreur ! Le bot n'a pas accès à un des channels !`});
            } else if (error instanceof Error) {
                await interaction.followUp({content: error.message});
            } else {
                await interaction.followUp({content: "❌ Une erreur est survenue !"})
            }
        }
    }
}