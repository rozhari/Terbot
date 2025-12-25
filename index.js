const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = 'നിങ്ങളുടെ_BOT_TOKEN_ഇവിടെ_നൽകുക';
const bot = new TelegramBot(token, { polling: true });

console.log("ബോട്ട് റെഡിയാണ്...");

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "സ്വാഗതം! ഏത് TeraBox ലിങ്കും അയച്ചു തരൂ, ഞാൻ ഡൗൺലോഡ് ലിങ്ക് തരാം.");
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text && (text.includes('terabox') || text.includes('1024tera') || text.includes('neekbox'))) {
        bot.sendMessage(chatid, "പരിശോധിക്കുന്നു... ദയവായി കാത്തിരിക്കൂ.");

        try {
            // സ്ക്രാപ്പിംഗ് വഴി ലിങ്ക് എടുക്കുന്ന ഒരു പബ്ലിക് API
            const response = await axios.get(`https://terabox-downloader-seven.vercel.app/api?url=${text}`);
            
            if (response.data && response.data.download_link) {
                const downloadLink = response.data.download_link;
                const fileName = response.data.name || "TeraBox File";

                const message = `✅ *ഫയൽ കണ്ടെത്തി!*\n\n📁 *പേര്:* ${fileName}\n\n🚀 *ഡൗൺലോഡ് ലിങ്ക്:* [ഇവിടെ ക്ലിക്ക് ചെയ്യുക](${downloadLink})`;
                
                bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            } else {
                bot.sendMessage(chatId, "ക്ഷമിക്കണം, ലിങ്ക് എടുക്കാൻ കഴിഞ്ഞില്ല. മറ്റൊരിക്കൽ കൂടി ശ്രമിക്കൂ.");
            }
        } catch (error) {
            bot.sendMessage(chatId, "എറർ: ലിങ്ക് എടുക്കുന്നതിൽ തടസ്സം നേരിട്ടു.");
        }
    } else if (text !== "/start") {
        bot.sendMessage(chatId, "ദയവായി ഒരു സാധുവായ TeraBox ലിങ്ക് അയക്കൂ.");
    }
});
