/**
 * Middleware that only allows access from local requests (localhost)
 * This ensures that the admin panel is only accessible from the backend server
 */
const isLocal = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  // Check if the request is coming from localhost
  if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip.includes('localhost')) {
    return next(); // Allow access for localhost
  }
  
  // Deny access for non-local requests
  return res.status(403).json({
    status: 403,
    message: 'Access denied. Admin panel is only accessible from the backend server.',
  });
};

export default isLocal;
