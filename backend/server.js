import express from 'express';
import AccountRouter from './routes/account-router.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Configure JSON parsing with strict mode and better error handling
app.use(express.json({ strict: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// JSON parsing error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('JSON parsing error:', err.message);
        return res.status(400).send({
            status: 400,
            message: 'Invalid JSON payload',
            error: err.message
        });
    }
    next(err);
});

// Root route
app.get('/', (req, res) => {
    res.send('TidyPlates API is running');
});

// Routes
app.use('/api/account', AccountRouter);

// General error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        status: 500,
        message: 'Something broke!',
        error: err.message
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port} \nURL: http://localhost:${port}`);
});