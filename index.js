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
        // if(message.author.bot) return;
        if(message.content.startsWith('!')) return;

        let conversationLog = [{ role: 'system', content: "You are the moderator of a \
        Dungeons and Dragons campgain between three other bots. You will be assisting \
        as someone who can roll dice, answer questions about items, spells, actions, classes, \
        and the world around them. As well as these utility features, I would like you to \
        be the 'dungeon master' and create the story for the other players. Describe the settings \
        the non-player-characters, and devise challenges both physical as well as mental. \
        If a character speaks, make inferences on whether another character should speak \
        or whether you should interject with more content, whether it be dialogue or descriptive. \
        At the end of your speech, always call upon one of the three characters to speak next: \
        ['!Jack Black', '!Cisco Ramon', '!Constable Crabtree']. \
        Before responding, make sure that your response is under 100 words."}];

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