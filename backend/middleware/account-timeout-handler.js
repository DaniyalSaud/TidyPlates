// Middleware to handle long-running account creation requests
// This middleware sets a longer timeout for account creation specifically
// and provides special error handling for socket hang up errors

export default function accountTimeoutHandler(req, res, next) {
  // Set a longer timeout for account creation endpoint
  if (req.originalUrl.includes('/api/account/register') && req.method === 'POST') {
    const timeout = 120000; // 2 minutes timeout for account creation
    console.log(`Setting extended timeout (${timeout}ms) for account creation request`);
    
    // Set timeout for the request
    req.setTimeout(timeout, () => {
      console.error(`Account creation request timed out after ${timeout}ms`);
      if (!res.headersSent) {
        return res.status(503).json({
          status: 503,
          error: "The server took too long to process your request. This might be due to meal plan generation. Please try again with fewer preferences."
        });
      }
    });
    
    // Set timeout for the response
    res.setTimeout(timeout, () => {
      console.error(`Account creation response timed out after ${timeout}ms`);
      if (!res.headersSent) {
        return res.status(503).json({
          status: 503,
          error: "The server took too long to send a response. This might be due to meal plan generation. Please try again with fewer preferences."
        });
      }
    });
    
    // Handle connection aborts and socket errors
    req.socket.setKeepAlive(true);
    req.socket.on('error', (err) => {
      console.error('Socket error during account creation:', err.message);
      // No need to send a response here as the socket is already errored
    });

    // Add special error handler for 'socket hang up' errors
    const originalEnd = res.end;
    res.end = function(...args) {
      if (req.timeoutId) {
        clearTimeout(req.timeoutId);
      }
      return originalEnd.apply(this, args);
    };
    
    // Catch ECONNRESET errors
    res.on('close', () => {
      if (!res.writableEnded) {
        console.log('Client connection closed before response completed');
      }
    });
  }
  next();
}
