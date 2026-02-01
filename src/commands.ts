import {REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import {TOKEN, BOT_ID} from "../var";

const commands = [
    new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('Setup ticket message')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .toJSON(),

    new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!')
    .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async ()=> {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(BOT_ID),
            { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();