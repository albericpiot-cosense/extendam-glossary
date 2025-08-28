exports.handler = async (event, context) => {
  // Headers CORS simples
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST',
    'Content-Type': 'application/json'
  };

  // Si c'est une requête OPTIONS, retourner OK
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log('Début de l\'appel API Notion...');
    
    // Vos identifiants
    const NOTION_TOKEN = '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';
    const DATABASE_ID = '25db8a91a892807cafa4e4c107cb8ba9';
    
    console.log('Token:', NOTION_TOKEN.substring(0, 10) + '...');
    console.log('Database ID:', DATABASE_ID);

    // Appel simple à Notion
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({})
    });

    console.log('Réponse Notion status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur Notion:', errorText);
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: `Notion API error: ${response.status}`,
          details: errorText
        })
      };
    }

    const data = await response.json();
    console.log('Données reçues:', data.results ? data.results.length : 0, 'éléments');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Erreur fonction:', error.message);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error',
        message: error.message,
        stack: error.stack
      })
    };
  }
};
