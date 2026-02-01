require('dotenv').config({ path: require('find-config')('.env') })
const TOKEN = process.env.TOKEN!;
const SUPPORT_CATEGORY = process.env.SUPPORT_CATEGORY!
const CHANNEL_SETUP= process.env.CHANNEL_SETUP!;
const MOD_ROLE_ID = process.env.MOD_ROLE_ID!;
const BOT_ID=process.env.BOT_ID!;

export { TOKEN, SUPPORT_CATEGORY, MOD_ROLE_ID, BOT_ID, CHANNEL_SETUP };