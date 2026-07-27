import {Client, Events, ActivityType} from "discord.js";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client):Promise<void> {
        client.user!.setActivity({name: "📩 /setup-ticket", type: ActivityType.Watching});
        console.log(`Logged in as ${client.user!.tag}!`);
    }
}