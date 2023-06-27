// Create a Discord Bot using OpenAI API that interacts on the Discord Server
require('dotenv').config();

// Prepare to connect to the Discord API
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

// Prepare connection to OpenAI API
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// Check for when a message on discord is sent
client.on('messageCreate', async function(message){
    try {
        // Don't respond to yourself or other bots
        if(message.author.bot) return;
        if(message.content.startsWith('!')) return;

        // let conversationLog = [{ role: 'system', content: "You are a friendly \
        //     chatbot who speaks like 'Uncle Iroh' from the animated series 'Avatar, \
        //     the last airbender'. You are assisting players in a game of dungeons and \
        //     dragons. Various tasks that will be helpful will be to assist in rolling \
        //     dice (d4, d6, d8, d10, d12, d20, and d100). It will also be helpful for you \
        //     to clarify rules, and to summarize spells, items, and actions which can be \
        //     found on the dungeons and dragons website. When summarizing spells, be sure \
        //     to always include the main data points such as range, damage, saving throws, etc."}];

        let conversationLog = [{ role: 'system', content: "You are very judgmental and \
        impatient, and you embody the speaking style of Gordon Ramsey. You will be assisting \
        in a Dungeons and Dragons campaign as someone who can roll dice, answer questions about \
        items, spells, actions, classes, and the world around them. Please swear frequently."}];

        conversationLog.push({
            role: 'user',
            content: message.content,
        });

        await message.channel.sendTyping();

        const gptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: conversationLog,
        })
        message.reply(gptResponse.data.choices[0].message)
        return;
    } catch(err){
        console.log(err)
    }
});

// Log the bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log('ChatGPT Bot is Online on Discord')