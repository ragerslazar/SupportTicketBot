import {
    Client, Events, GatewayIntentBits, EmbedBuilder, TextChannel, InteractionDeferReplyOptions, MessageFlags,
    ButtonBuilder, ButtonStyle, ActionRowBuilder, CategoryChannel, ChannelType,
    ButtonInteraction, CommandInteraction
} from 'discord.js';
import {TOKEN, SUPPORT_CATEGORY, MOD_ROLE_ID, CHANNEL_SETUP} from "../var";

const client = new Client({ intents:
        [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isButton()) {
        await buttonHandler(interaction);
    }else if (interaction.isChatInputCommand()) {
        await commandHandler(interaction)
    }
});

const deferOptions: InteractionDeferReplyOptions = {
    flags: MessageFlags.Ephemeral
};

async function setupTicketMessage() {
    const channel = client.channels.cache.get(CHANNEL_SETUP) as TextChannel;
    const message = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('✉️ Tickets')
        .setDescription('En cas de problèmes ou de questions, veuillez ouvrir un ticket.\n Un membre du staff vous répondra au plus vite.')
        .setTimestamp()
        .setFooter({ text: 'MDTicketBot Support' });

    const create_ticket = new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('📩 Créer un Ticket')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(create_ticket);

    await channel.send({
        embeds: [message],
        components: [row]
    });
}

async function checkExistingTickets(interaction: ButtonInteraction) {
    const category = client.channels.cache.get(SUPPORT_CATEGORY) as CategoryChannel;
    if (!category) {
        console.error("Categorie de support introuvable !")
        return;
    }

    const channels = category.children.cache;
    const existing_channel = channels.find(channel => channel.name === `ticket-${interaction.user.id}`);

    if (existing_channel) {
        await interaction.editReply(`❌ Vous avez déjà un ticket en cours ! <#${existing_channel.id}>`)
    } else {
        const userTicketChannel = await category.children.create({
            name: `ticket-${interaction.user.id}`,
            type: ChannelType.GuildText,
            topic: `Pseudo discord de l'utilisateur: ${interaction.user.tag}`,
        });

        userTicketChannel.permissionOverwrites.create(interaction.user.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
        })
        await interaction.editReply(`✅ Votre ticket <#${userTicketChannel.id}> a été crée !`)

        await userTicketChannel.send(`<@${interaction.user.id}> <@&${MOD_ROLE_ID}>`)

        const ticketEmbed = new EmbedBuilder()
            .setColor(0xff5555)
            .setTitle('🎫 Ticket ouvert')
            .setDescription(
                'Bonjour 👋\n\n' +
                'Merci d’avoir ouvert un ticket.\n' +
                'Expliquez clairement votre problème ou votre demande, ' +
                'un membre du staff vous répondra dès que possible.'
            )
            .setTimestamp()
            .setFooter({ text: 'MDTicketBot Support' });

        const closeTicketButton = new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('🔒 Fermer le ticket')
            .setStyle(ButtonStyle.Danger);

        const closeRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(closeTicketButton);

        await userTicketChannel.send({
            embeds: [ticketEmbed],
            components: [closeRow]
        });
    }
}

async function buttonHandler(interaction: ButtonInteraction) {
    if (interaction.customId === "create_ticket") {
        await interaction.deferReply(deferOptions);
        await checkExistingTickets(interaction);

    } else if (interaction.customId === "close_ticket") {
        await interaction.reply("❌ Fermeture du ticket dans 5 secondes...");
        setTimeout(async ()=> {
            await interaction.channel!.delete();
            }, 5000);
    }
}

async function commandHandler(interaction: CommandInteraction) {
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (interaction.commandName === 'setup-ticket') {
        await interaction.deferReply(deferOptions);
        await setupTicketMessage();
        await interaction.editReply("Setup message envoyé !");
    }
}

client.login(TOKEN);