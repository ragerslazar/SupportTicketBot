import {buttonHandler} from "../handlers/buttonHandler";
import {commandHandler} from "../handlers/commandHandler";
import {Events} from "discord.js";

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: any) {
        if (interaction.isButton()) {
            await buttonHandler(interaction);
        }else if (interaction.isChatInputCommand()) {
            await commandHandler(interaction)
        }
    }
}