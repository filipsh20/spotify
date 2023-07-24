const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());

//routes
app.use('/search', require('./routes/search'));

module.exports = app;