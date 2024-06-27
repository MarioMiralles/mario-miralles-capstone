//======================//
// CREATE DEFAULT IMAGE //
//======================//
// /mario-miralles-capstone/netlify/functions/createDefaultImage.js

import { handleRandomArt } from '../../src/components/NewsInfo/NewsInfo.js';

export async function handler(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const result = await handleRandomArt();
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.error('Error triggering random art feature:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}
