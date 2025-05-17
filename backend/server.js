import express from 'express';
import { initTables, initStatements } from './models/db.js';
import AccountRouter from './routes/account-router.js';
import AdminRouter from './routes/admin-router.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Set timeout values for the server
const serverTimeout = 2 * 60 * 1000; // 2 minutes in milliseconds
const keepAliveTimeout = 65 * 1000; // 65 seconds for keep-alive

// Middleware
app.use(cors());

// Import and use request logger middleware
import requestLogger from './middleware/request-logger.js';
import accountTimeoutHandler from './middleware/account-timeout-handler.js';
app.use(requestLogger);

// Apply account timeout handler middleware
app.use(accountTimeoutHandler);

// Configure server timeouts globally
app.use((req, res, next) => {
  // Set timeout for all requests (will be overridden by the specific handler for account creation)
  req.setTimeout(serverTimeout);
  next();
});

// Configure JSON parsing with strict mode and better error handling
app.use(express.json({ strict: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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

// Admin panel route - only accessible from the backend server
app.use('/admin', AdminRouter);

// General error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    
    // Make sure we have a valid status code
    const statusCode = err.status || err.statusCode || 500;
    
    // Create a clean, safe error response
    const errorResponse = {
        status: statusCode,
        message: statusCode === 500 ? 'Internal server error' : err.message || 'Something went wrong',
    };
    
    // Add detailed error info in development
    if (process.env.NODE_ENV !== 'production') {
        errorResponse.error = err.message || 'Server error';
        errorResponse.stack = err.stack;
    }
    
    // Ensure we always send a valid JSON response
    // If headers are already sent, we can't send a response
    if (!res.headersSent) {
        try {
            return res.status(statusCode).json(errorResponse);
        } catch (responseError) {
            console.error('Failed to send error response:', responseError);
        }
    } else {
        console.error('Headers already sent, cannot send error response');
    }
});

// Start server
// Initialize the database before starting the server
const startServer = async () => {
  try {
    // Initialize database tables
    await initTables();
    
    // Initialize prepared statements
    initStatements();
    
    // Start the server
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port} \nURL: http://localhost:${port}`);
    });

    // Configure longer timeout values for the server to handle long-running requests
    server.timeout = serverTimeout;
    server.keepAliveTimeout = keepAliveTimeout;
    server.headersTimeout = keepAliveTimeout + 5000; // slightly longer than keepAliveTimeout
    console.log(`Server timeout set to: ${serverTimeout/1000} seconds, Keep-alive: ${keepAliveTimeout/1000} seconds`);
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
};

startServer();