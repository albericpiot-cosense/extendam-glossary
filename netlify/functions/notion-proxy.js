exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Gestion preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Configuration (vos vraies valeurs)
    const NOTION_TOKEN = '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';
    const DATABASE_ID = '25db8a91a892807cafa4e4c107cb8ba9';

    // Appel à l'API Notion
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        sorts: [
          {
            property: 'Terme',
            direction: 'ascending'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur Notion API:', response.status, errorText);
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: `Erreur API Notion: ${response.status}`,
          details: errorText,
          message: 'Vérifiez le token et les permissions de l\'intégration'
        })
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Erreur dans la fonction:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erreur serveur',
        message: error.message
      })
    };
  }
};
