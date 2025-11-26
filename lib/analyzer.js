export async function analyzeAndSuggest(newsData) {
  const perplexityKey = process.env.PERPLEXITY_API_KEY;

  const prompt = `Новости PropTech: ${newsData}

Проанализируй для платформы BROKS (российский маркетплейс для брокеров и агентств недвижимости):

1. 🎯 Ключевые инсайты (2-3 пункта) - что важно понять
2. 💡 Фичи для внедрения (3 конкретных предложения):
   - Название фичи
   - Что даст брокерам/агентствам
   - Приоритет (Высокий/Средний/Низкий)
   - Сложность (Легко/Средне/Сложно)
3. 🚀 Конкурентное преимущество - чем можем выделиться

Ответ на русском, используй эмоджи, будь конкретным и кратким.`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        { role: 'system', content: 'Ты продуктовый стратег PropTech платформ с экспертизой в недвижимости.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await response.json();
  const date = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  
  return `📊 Дайджест PropTech — ${date}\n\n${data.choices[0].message.content}`;
}