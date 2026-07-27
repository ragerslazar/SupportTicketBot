import {
    LabelBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {checkExistingTickets} from "../../functions/tickets.ts";
import {deferOptions} from "../../utils/deferOptions.ts";

const modal: ModalBuilder = new ModalBuilder()
    .setCustomId('ticket-form-modal')
    .setTitle('Créer un ticket');

const mUsernameInput = new TextInputBuilder()
    .setCustomId('ticket-form-username-input')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const mUsernameLabel: LabelBuilder = new LabelBuilder()
    .setLabel("Pseudo")
    .setDescription('Quel est votre pseudo ?')
    .setTextInputComponent(mUsernameInput);

const mTicketContentInput: TextInputBuilder = new TextInputBuilder()
    .setCustomId('ticket-form-content-input')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

const mTicketContentLabel: LabelBuilder = new LabelBuilder()
    .setLabel("Objet")
    .setDescription('Expliquez ici la raison de votre demande:')
    .setTextInputComponent(mTicketContentInput);

modal.addLabelComponents(mUsernameLabel, mTicketContentLabel);

export default {
    data: modal,
    async execute(interaction: ModalSubmitInteraction): Promise<void> {
        await interaction.deferReply(deferOptions);
        const username: string = interaction.fields.getTextInputValue("ticket-form-username-input");
        const content: string = interaction.fields.getTextInputValue("ticket-form-content-input");
        await checkExistingTickets(interaction, username, content);
    }
}