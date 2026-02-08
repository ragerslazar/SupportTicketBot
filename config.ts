import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.TOKEN!;
const MOD_ROLE_ID = process.env.MOD_ROLE_ID!;
const BOT_ID= process.env.BOT_ID!;
const GUILD_ID = process.env.GUILD_ID!;
const MONGODB_URI = process.env.MONGODB_URI!;

export { TOKEN, MOD_ROLE_ID, BOT_ID, GUILD_ID, MONGODB_URI };