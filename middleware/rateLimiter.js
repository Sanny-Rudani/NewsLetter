const rateLimitStore = {}; // In-memory store for tracking client requests

/**
 * Rate Limiting Middleware
 * @param {number} limit - Maximum number of requests allowed within the time window.
 * @param {number} timeWindow - Time window in milliseconds.
 * @returns {function} - Express middleware function to apply rate limiting.
 */
function rateLimiter(limit, timeWindow) {
  return (req, res, next) => {
    const clientId = req.ip; // Using client's IP address as a unique identifier
    const currentTime = Date.now();

    if (!rateLimitStore[clientId]) {
      rateLimitStore[clientId] = { count: 1, startTime: currentTime };
    } else {
      const { startTime, count } = rateLimitStore[clientId];

      if (currentTime - startTime < timeWindow) {
        // Increment the request count within the time window
        rateLimitStore[clientId].count = count + 1;

        // Check if the request count exceeds the allowed limit
        if (rateLimitStore[clientId].count > limit) {
          return res.status(429).json({
            message: `You have exceeded the ${limit} requests in ${
              timeWindow / 1000
            } seconds limit.`,
          });
        }
      } else {
        // Reset the counter and start time after the time window expires
        rateLimitStore[clientId] = { count: 1, startTime: currentTime };
      }
    }

    next(); // Proceed to the next middleware or route handler
  };
}

module.exports = rateLimiter;
