import { MessageFlags } from 'discord.js';
import type {InteractionDeferReplyOptions} from "discord.js";

export const deferOptions: InteractionDeferReplyOptions = {
    flags: MessageFlags.Ephemeral
};