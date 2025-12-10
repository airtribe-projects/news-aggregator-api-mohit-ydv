const express = require('express');
const User = require('../models/user');
const axios = require('axios');
const userAuth = require('../middleware/auth');

const newsRouter = express.Router();

const newsCache = {};

newsRouter.get('/', userAuth, async (req, res) => {
    try {
        const apiKey = process.env.GNEWS_API_KEY;
        const userId = req.user._id;
        const user = await User.findById(userId);

        const preferences = user?.preferences?.length ? user.preferences : ['general'];

        const cacheKey = preferences.sort().join(',');

        // serve from cache if available
        if (newsCache[cacheKey]) {
            return res.status(200).json({
                news: newsCache[cacheKey]
            });
        }

        // Build query string for topics
        const query = preferences.join(' OR ');

        const response = await axios.get(`https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=10&apikey=${apiKey}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch news from external API');
        }

        //store in cache
        newsCache[cacheKey] = response.data.articles;
        res.status(200).json({
            news: response.data.articles
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch news",
            error: err.message
        });
    }
});

// Mark as read
newsRouter.post('/:id/read', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const articleId = req.params.id;

        const user = await User.findById(userId);
        if (!user.readArticles.includes(articleId)) {
            user.readArticles.push(articleId);
            await user.save();
        }
        res.status(200).json({ message: 'Article marked as read.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to mark as read', error: err.message });
    }
});

// Mark as favorite
newsRouter.post('/:id/favorite', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const articleId = req.params.id;

        const user = await User.findById(userId);
        if (!user.favoriteArticles.includes(articleId)) {
            user.favoriteArticles.push(articleId);
            await user.save();
        }
        res.status(200).json({ message: 'Article marked as favorite.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to mark as favorite', error: err.message });
    }
});

newsRouter.get('/read', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        res.status(200).json({
            readArticles: user.readArticles || []
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch read articles",
            error: err.message
        });
    }
});

newsRouter.get('/favorites', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        res.status(200).json({
            favoriteArticles: user.favoriteArticles || []
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch favorite articles",
            error: err.message
        });
    }
});

module.exports = newsRouter;
