import {PermissionFlagsBits, SlashCommandBuilder} from "discord.js";

export const setup_ticket_command =
    new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('Setup ticket message')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .toJSON();