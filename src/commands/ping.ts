import {SlashCommandBuilder} from "discord.js";

export const ping_command =
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong!')
        .toJSON();