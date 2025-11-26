import { sendMessage, setWebhook } from '../lib/telegram.js';
import { fetchDailyNews } from '../lib/news-fetcher.js';
import { analyzeAndSuggest } from '../lib/analyzer.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;
    
    if (!message) {
      return res.status(200).json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text;

    try {
      if (text === '/start') {
        await sendMessage(chatId, 
          '🤖 PropTech Daily Bot активирован!\n\n' +
          'Каждое утро в 9:00 я буду присылать дайджест трендов и идеи для BROKS.\n\n' +
          'Команды:\n' +
          '/today - получить дайджест сейчас\n' +
          '/trends - топ-5 трендов недели\n' +
          '/ideas - идеи для внедрения'
        );
      } else if (text === '/today') {
        await sendMessage(chatId, '⏳ Собираю актуальные данные...');
        const news = await fetchDailyNews();
        const analysis = await analyzeAndSuggest(news);
        await sendMessage(chatId, analysis);
      } else if (text === '/trends') {
        const trends = await getWeeklyTrends();
        await sendMessage(chatId, trends);
      } else if (text === '/ideas') {
        const ideas = await getImplementationIdeas();
        await sendMessage(chatId, ideas);
      }
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(chatId, '❌ Произошла ошибка. Попробуйте позже.');
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(200).json({ status: 'Bot is running' });
}