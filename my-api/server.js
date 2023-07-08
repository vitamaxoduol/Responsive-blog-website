const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON requests
app.use(express.json());

// Dummy data for our API
const posts = [
    { id: 1, title: 'Post 1', content: 'This is post 1' },
    { id: 2, title: 'Post 2', content: 'This is post 2' },
];

// Define API endpoint to get all posts
app.get('/http://localhost:3000/blogs', (req, res) => {
    res.json(posts);
});

// Define API endpoint to get a post by id
app.get('/http://localhost:3000/blogs:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).send('Post not found');
    res.json(post);
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});