// Simple request logger middleware to help debug API issues

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  const originalJson = res.json;
  
  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    // Clone body and mask sensitive fields
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '********';
    if (sanitizedBody.email) sanitizedBody.email = sanitizedBody.email.split('@')[0] + '@*****';
    
    console.log(`[REQUEST BODY] ${JSON.stringify(sanitizedBody)}`);
  }
  
  // Override send
  res.send = function(body) {
    const duration = Date.now() - start;
    console.log(`[RESPONSE] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
    if (res.statusCode >= 400) {
      console.log(`[RESPONSE ERROR BODY] ${body}`);
    }
    return originalSend.apply(this, arguments);
  };
  
  // Override json
  res.json = function(body) {
    const duration = Date.now() - start;
    console.log(`[RESPONSE] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
    if (res.statusCode >= 400) {
      console.log(`[RESPONSE ERROR BODY] ${JSON.stringify(body)}`);
    }
    return originalJson.apply(this, arguments);
  };
  
  next();
};

export default requestLogger;
