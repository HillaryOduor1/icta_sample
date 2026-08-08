import jwt from 'jsonwebtoken';
import { redisClient } from '../config/redis.js';
import { config } from '../config/env.js';

export const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token || req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    console.log('[Auth] Decoded token:', { 
      sub: decoded.sub, 
      role: decoded.role, 
      tenantId: decoded.tenantId,
      jti: decoded.jti 
    });
    
    const isBlacklisted = await redisClient.sismember(`bl:${decoded.jti}`, '1');
    if (isBlacklisted) throw new Error('Token revoked');
    
    req.user = decoded;
    req.userId = decoded.sub;
    next();
  } catch (err) {
    console.log('[Auth] Token verification failed:', err.message);
    // Don't clear cookies for master routes
    if (!req.path.includes('/master/')) {
      res.clearCookie('access_token');
      res.clearCookie('token');
    }
    next();
  }
};

