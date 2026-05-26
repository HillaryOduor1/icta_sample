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
/*import jwt from 'jsonwebtoken';
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
    res.clearCookie('access_token');
    res.clearCookie('token');
    next();
  }
};*/
/*import jwt from 'jsonwebtoken';
import { redisClient } from '../config/redis.js';
import { config } from '../config/env.js';

export const authenticate = async (req, res, next) => {
  // Try both cookie names for access token
  let token = req.cookies.access_token || req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  // Also check for master_token on master routes
  if (!token && req.path.includes('/master')) {
    token = req.cookies.master_token;
  }
  
  if (!token) {
    return next(); // No token → public route
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    const isBlacklisted = await redisClient.sismember(`bl:${decoded.jti}`, '1');
    if (isBlacklisted) throw new Error('Token revoked');
    
    req.user = decoded;
    req.userId = decoded.sub;
    next();
  } catch (err) {
    // Token is invalid or expired – clear stale cookies and treat as unauthenticated
    res.clearCookie('access_token');
    res.clearCookie('token');
    res.clearCookie('master_token');
    next(); // Continue to route handler (which may be public)
  }
};*/
/*import jwt from 'jsonwebtoken';
import { redisClient } from '../config/redis.js';
import { config } from '../config/env.js';

export const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token || req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next(); // No token → public route
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    const isBlacklisted = await redisClient.sismember(`bl:${decoded.jti}`, '1');
    if (isBlacklisted) throw new Error('Token revoked');
    
    req.user = decoded;
    req.userId = decoded.sub;
    // tenantId can be null for master users - that's fine
    if (decoded.tenantId) {
      req.tenantId = decoded.tenantId;
    }
    next();
  } catch (err) {
    // Token is invalid or expired – clear stale cookies and treat as unauthenticated
    res.clearCookie('access_token');
    res.clearCookie('token');
    next(); // Continue to route handler (which may be public)
  }
};*/
/*import jwt from 'jsonwebtoken';
import { redisClient } from '../config/redis.js';
import { config } from '../config/env.js';

export const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token || req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next(); // No token → public route
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    const isBlacklisted = await redisClient.sismember(`bl:${decoded.jti}`, '1');
    if (isBlacklisted) throw new Error('Token revoked');
    
    req.user = decoded;
    req.userId = decoded.sub;
    next();
  } catch (err) {
    // Token is invalid or expired – clear stale cookies and treat as unauthenticated
    res.clearCookie('access_token');
    res.clearCookie('token');
    next(); // Continue to route handler (which may be public)
  }
};*/
/*import jwt from 'jsonwebtoken';
import { redisClient } from '../config/redis.js';
import { AuthenticationError } from '../shared/errors/AuthenticationError.js';
import { config } from '../config/env.js';

export const authenticate = async (req, res, next) => {
  // Try both cookie names
  const token = req.cookies.access_token || req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(); // public route
  }
  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    const isBlacklisted = await redisClient.sismember(`bl:${decoded.jti}`, '1');
    if (isBlacklisted) throw new Error('Token revoked');
    req.user = decoded;
    req.userId = decoded.sub;
    next();
  } catch (err) {
    throw new AuthenticationError('Invalid or expired token');
  }
};*/
/*import jwt from 'jsonwebtoken';
import { redisClient } from '../config/redis.js';
import { AuthenticationError } from '../shared/errors/AuthenticationError.js';
import { config } from '../config/env.js';

export const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    // Allow unauthenticated for public routes; protected routes will check later
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    const isBlacklisted = await redisClient.sismember(`bl:${decoded.jti}`, '1');
    if (isBlacklisted) throw new Error('Token revoked');
    req.user = decoded;
    req.userId = decoded.sub;
    next();
  } catch (err) {
    throw new AuthenticationError('Invalid or expired token');
  }
};*/

/*last stable
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // { id, role, tenantId? }

    // Superadmin can work without tenant context
    if (req.user.role === 'superadmin') {
      return next();
    }

    // Normal users need tenant context
    if (!req.tenant && !req.user.tenantId) {
      return res.status(401).json({ message: "Tenant context missing" });
    }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};

module.exports = { protect, authorize };*/

/*const jwt = require("jsonwebtoken");
/*
const protect = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, role }
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }
        next();
    };
};
*/
/*
const protect = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // contains { id, role, tenantId? }

    // If user is superadmin, we may not have a tenant attached yet
    if (req.user.role === 'superadmin') {
      // Allow access without tenant middleware
      return next();
    }

    // For normal users, ensure tenant is present (set by tenantMiddleware)
    if (!req.tenant && !req.user.tenantId) {
      return res.status(401).json({ message: "Tenant context missing" });
    }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = { protect, authorize };*/

/*const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, role }
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }
        next();
    };
};

module.exports = { protect, authorize };*/
/*const jwt = require("jsonwebtoken");

// Protect route - check for token
const protect = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contains id, username, role
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Authorize based on roles
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }
        next();
    };
};

module.exports = { protect, authorize };*/

/*const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  return res.status(401).json({ message: 'No token' });
};

// ✅ ADD THIS
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { protect, authorize };*/


/*const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  return res.status(401).json({ message: 'No token' });
};

module.exports = protect;
/*module.exports = function (req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // later: verify JWT
  next();
};*/