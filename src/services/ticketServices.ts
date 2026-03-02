import {guildProfileSchema} from "../schemas/guildProfileSchema.ts";
import {
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ChatInputCommandInteraction,
    ModalSubmitInteraction, RoleSelectMenuInteraction, TextChannel
} from "discord.js";
import {ticketSchema} from "../schemas/ticketSchema.ts";
import type {HydratedDocument} from "mongoose";

export async function getGuildProfileById(interaction: any) {
    const guildID: string = interaction.guildId;
    const guildQuery = await guildProfileSchema.findOne({
        guildId: guildID
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

export async function deleteChannelLoggingId(interaction: any): Promise<void> {
    await guildProfileSchema.findOneAndUpdate(
        { guildId: interaction.guildId },
        { $unset: { channelLoggingId: "" } }
    );
}

export async function deleteStaffRoles(interaction: any): Promise<void> {
    await guildProfileSchema.findOneAndUpdate(
        { guildId: interaction.guildId },
        { $unset: { staffRoles: "" } }
    );
}

export async function getTicketInfo(interaction: ButtonInteraction | ModalSubmitInteraction, q: string) {
    let data;
    if (q == "channelId") {
        data = interaction.channelId;
    } else if (q == "ownerId") {
        data = interaction.user.id
    }
    let ticketQuery = await ticketSchema.findOne({
        channelId: data
    });

    return ticketQuery;
}

export async function deleteRecordFromDatabase(query: HydratedDocument<any>): Promise<void> {
    await query.deleteOne();
}

export async function createGuildProfileSchema(interaction: ChatInputCommandInteraction) {
    return new guildProfileSchema({
        guildId: interaction.guildId,
    }).save();
}

export async function createTicketSchema(interaction: ModalSubmitInteraction, ticket_channel: TextChannel) {
    return new ticketSchema({
        channelId: ticket_channel.id,
        ownerId: interaction.user.id
    }).save();
}

export async function updateGuildProfileField(interaction: ChannelSelectMenuInteraction | RoleSelectMenuInteraction, fieldName: string, fieldValue: any) {
    await guildProfileSchema.findOneAndUpdate(
        {guildId: interaction.guildId},
        {$set: {[fieldName]: fieldValue}});
}

export async function updateTicketField(interaction: any, fieldName: string, fieldValue: any) {
    await ticketSchema.findOneAndUpdate(
        {guildId: interaction.guildId},
        {$set: {[fieldName]: fieldValue}});
}