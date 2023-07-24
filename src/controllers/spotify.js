const axios = require('axios');

const clientId = process.env.SPOTIFY_ID
const clientSecret = process.env.SPOTIFY_SECRET

const getAccessToken = async () => {
    try {
        const baseUrl = 'https://accounts.spotify.com/api/token';
        const apiKey = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const headers = {
            'Authorization': `Basic ${apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        const data = { grant_type: 'client_credentials' };

        const response = await axios.post(baseUrl, data, { headers: headers });
        return response.data.access_token;
    } catch (error) {
        console.error('Error al obtener el token de acceso a Spotify:', error.message);
        return null;
    }
};

const searchSongs = async (query) => {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            console.error('No se pudo obtener el token de acceso a Spotify');
            return null;
        }

        const baseUrl = 'https://api.spotify.com/v1/search';
        const headers = { 'Authorization': `Bearer ${accessToken}` };
        const params = { q: query, type: 'track' };

        const response = await axios.get(baseUrl, { headers: headers, params: params });
        const songsMap = response.data.tracks.items.map(item => {
            if(item.preview_url != null) return {name: item.name, preview_url: item.preview_url};
            return null
        }).filter(item => item !== null)
        return songsMap;
    } catch (error) {
        console.error('Error buscando canciones en Spotify:', error.message);
        return null;
    }
};

module.exports = searchSongs;