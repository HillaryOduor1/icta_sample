// backend/src/middleware/payloadMonitor.js
export const payloadMonitor = (req, res, next) => {
  const originalJson = req.json;
  let size = 0;
  
  req.on('data', chunk => {
    size += chunk.length;
  });
  
  req.on('end', () => {
    if (size > 1024 * 1024) { // > 1MB
      logger.warn({
        path: req.path,
        size: `${(size / 1024 / 1024).toFixed(2)}MB`,
        ip: req.ip
      }, 'Large payload detected');
    }
  });
  
  next();
};

// Use it after compression
app.use(payloadMonitor);