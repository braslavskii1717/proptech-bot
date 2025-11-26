export async function fetchDailyNews() {
  const sources = [
    { name: 'TechCrunch PropTech', url: 'https://techcrunch.com/tag/proptech/' },
    { name: 'Inman', url: 'https://www.inman.com/' },
    { name: 'The Real Deal', url: 'https://therealdeal.com/tag/technology/' }
  ];

  // Используем Perplexity API для сбора новостей
  const perplexityKey = process.env.PERPLEXITY_API_KEY;
  
  const query = `Summarize top 3 PropTech news and innovations from the last 24 hours. 
    Focus on: real estate platforms, AI integrations, marketplace innovations, 
    broker tools, listing automation. Provide concise summaries.`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        { role: 'system', content: 'You are a PropTech industry analyst.' },
        { role: 'user', content: query }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}