const searchSongs = require('../controllers/spotify');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const searchQuery = req.query.query;
    const songs = await searchSongs(searchQuery);
    res.json(songs);
});

module.exports = router;