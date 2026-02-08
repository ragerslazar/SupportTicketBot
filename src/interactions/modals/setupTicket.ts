import {
    LabelBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {setupTicketMessage} from "../../functions/tickets.ts";
import {getGuildProfileById} from "../../utils/getGuildProfileById.ts";
import {deferOptions} from "../../utils/deferOptions.ts";

const modal = new ModalBuilder()
    .setCustomId('setup-ticket-modal')
    .setTitle('Personnalisation');

const mTicketMessageTitle = new TextInputBuilder()
    .setCustomId('ticket-message-title')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const mTicketMessageTitleLabel = new LabelBuilder()
    .setLabel("Titre")
    .setDescription('Quel titre voulez vous donner à votre message pour créer les tickets ?')
    .setTextInputComponent(mTicketMessageTitle);

const mTicketMessageContent = new TextInputBuilder()
    .setCustomId('ticket-message-content')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

const mTicketMessageContentLabel = new LabelBuilder()
    .setLabel("Contenu")
    .setDescription('Quel contenu voulez vous donner à votre message pour créer les tickets ?')
    .setTextInputComponent(mTicketMessageContent);

modal.addLabelComponents(mTicketMessageTitleLabel, mTicketMessageContentLabel);

export default {
    data: modal,
    async execute(interaction: ModalSubmitInteraction): Promise<void> {
        const title = interaction.fields.getTextInputValue("ticket-message-title");
        const content = interaction.fields.getTextInputValue("ticket-message-content");
        await interaction.deferReply(deferOptions);
        const guildQuery = await getGuildProfileById(interaction);
        const target_channel = guildQuery.channelCreateTicket;
        await setupTicketMessage(target_channel, title, content, interaction);
        await interaction.editReply({content: "Système de ticket mis en place ! ✅"});
    }
}