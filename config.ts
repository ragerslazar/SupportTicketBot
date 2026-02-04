// require('dotenv').config({path: require('find-config')('.env')});
import "dotenv/config"

const TOKEN = process.env.TOKEN!;
const SUPPORT_CATEGORY = process.env.SUPPORT_CATEGORY!
const CHANNEL_SETUP= process.env.CHANNEL_SETUP!;
const MOD_ROLE_ID = process.env.MOD_ROLE_ID!;
const BOT_ID=process.env.BOT_ID!;
const GUILD_ID = process.env.GUILD_ID!;
const MONGODB_URI = process.env.MONGODB_URI!;

export { TOKEN, SUPPORT_CATEGORY, MOD_ROLE_ID, BOT_ID, CHANNEL_SETUP, GUILD_ID, MONGODB_URI };