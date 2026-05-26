import { randomBytes } from 'crypto';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../../../config/env.js';

const setAuthCookies = (res, userId, role, tenantId = null, isMaster = false) => {
  const payload = { sub: userId, role, tenantId };
  console.log('[Auth] Signing access token with payload:', payload);
  
  const accessToken = jwt.sign(
    payload,
    config.jwt.accessSecret,
    { expiresIn: '15m', jwtid: randomBytes(16).toString('hex') }
  );
  const refreshToken = jwt.sign(
    payload,
    config.jwt.refreshSecret,
    { expiresIn: '7d' }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
  };
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  if (isMaster) {
    res.cookie('master_token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
};

// Tenant OAuth
export const googleAuth = (req, res, next) => {
  console.log('[OAuth] googleAuth called');
  const tenantId = req.query.tenant || 'landscapes_integrity_solutions';
  console.log('[OAuth] Starting Google auth for tenant:', tenantId);
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: tenantId,
  })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  console.log('[OAuth] googleCallback STARTED');
  
  passport.authenticate('google', { session: false }, (err, user, info) => {
    console.log('[OAuth] Passport callback executed');
    console.log('[OAuth] err:', err);
    console.log('[OAuth] user:', user ? user.email : 'null');
    console.log('[OAuth] info:', info);
    
    if (err || !user) {
      console.error('OAuth error:', err || 'No user');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
    
    const tenantId = req.query.state;
    console.log('[OAuth] Tenant from state:', tenantId);
    
    setAuthCookies(res, user._id, user.role, tenantId);
    console.log('[OAuth] Redirecting to dashboard');
    return res.redirect(`${config.frontendUrl}/dashboard`);
  })(req, res, next);
};

// Master OAuth
export const masterGoogleAuth = (req, res, next) => {
  console.log('[OAuth] Master Google auth starting');
  passport.authenticate('google-master', {
    scope: ['profile', 'email'],
  })(req, res, next);
};

export const masterGoogleCallback = (req, res, next) => {
  console.log('[OAuth] Master Google callback received');
  passport.authenticate('google-master', { session: false }, (err, masterUser, info) => {
    if (err || !masterUser) {
      console.error('Master OAuth error:', err || 'No user');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
    console.log('[OAuth] Master authenticated:', masterUser.email);
    setAuthCookies(res, masterUser._id, 'superadmin', null, true);
    return res.redirect(`${config.frontendUrl}/master/tenants`);
  })(req, res, next);
};
/*import { randomBytes } from 'crypto';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../../../config/env.js';
import connectDB from '../../../config/database.js';
import { MasterUserModel } from '../../../database/models/masterUser.model.js';
import { UserModel } from '../../../database/models/user.model.js';

const setAuthCookies = (res, userId, role, tenantId = null, isMaster = false) => {
  const payload = { sub: userId, role, tenantId };
  console.log('[Auth] Signing access token with payload:', payload);
  
  const accessToken = jwt.sign(
    { sub: userId, role, tenantId },
    config.jwt.accessSecret,
    { expiresIn: '15m', jwtid: randomBytes(16).toString('hex') }
  );
  const refreshToken = jwt.sign(
    { sub: userId, role, tenantId },
    config.jwt.refreshSecret,
    { expiresIn: '7d' }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
  };
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  if (isMaster) {
    res.cookie('master_token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
};

// Tenant OAuth
/*export const googleAuth = (req, res, next) => {
  // Get tenant from query parameter (most reliable)
  let tenantId = req.query.tenant;
  
  // If not in query, try from req.tenant (set by tenantMiddleware)
  if (!tenantId && req.tenant?.dbName) {
    tenantId = req.tenant.dbName;
  }
  
  // If still not found, use default
  if (!tenantId) {
    tenantId = 'landscapes_integrity_solutions';
  }
  
  console.log('[OAuth] Google auth starting for tenant:', tenantId);
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: tenantId,  // Pass tenant as state parameter
  })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err || !user) {
      console.error('OAuth error:', err || 'No user');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
    try {
      // Get tenant from state parameter (returned by Google)
      const tenantId = req.query.state;
      if (!tenantId) {
        console.error('[OAuth] No tenantId in state');
        return res.redirect(`${config.frontendUrl}/login?error=missing_tenant`);
      }
      
      console.log('[OAuth] Callback received for tenant:', tenantId);
      console.log('[OAuth] User authenticated:', {
        id: user._id,
        email: user.email,
        tenantId: user.tenantId,
      });

      setAuthCookies(res, user._id, user.role, tenantId);
      return res.redirect(`${config.frontendUrl}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};/
export const googleAuth = (req, res, next) => {
  console.log('[OAuth] googleAuth called');
  console.log('[OAuth] req.query:', req.query);
  console.log('[OAuth] req.tenant:', req.tenant);
  
  console.log('[OAuth] Using callback URL:', config.google.callbackUrl);
  
  const tenantId = req.query.tenant || req.tenant?.dbName;
  
  if (!tenantId) {
    console.error('[OAuth] No tenant found');
    return res.redirect(`${config.frontendUrl}/login?error=missing_tenant`);
  }
  
  console.log('[OAuth] Starting Google auth for tenant:', tenantId);
  console.log('[OAuth] Callback URL:', config.google.callbackUrl);
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: tenantId,
  })(req, res, next);
};

/*export const googleCallback = (req, res, next) => {
  console.log('[OAuth] googleCallback called');
  console.log('[OAuth] req.query:', req.query);
  console.log('[OAuth] req.query.state:', req.query.state);
  
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    console.log('[OAuth] Passport callback - err:', err?.message || 'none');
    console.log('[OAuth] Passport callback - user exists:', !!user);
    console.log('[OAuth] Passport callback - info:', info);
    
    if (err || !user) {
      console.error('OAuth error:', err || 'No user');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
    try {
      const tenantId = req.query.state;
      if (!tenantId) {
        console.error('[OAuth] No tenantId in state');
        throw new Error('Missing tenant');
      }
      
      console.log('[OAuth] Success! User:', user.email, 'Tenant:', tenantId);
      setAuthCookies(res, user._id, user.role, tenantId);
      return res.redirect(`${config.frontendUrl}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};/


// Master OAuth
export const masterGoogleAuth = (req, res, next) => {
  console.log('[OAuth] Master Google auth starting');
  passport.authenticate('google-master', {
    scope: ['profile', 'email'],
  })(req, res, next);
};

export const masterGoogleCallback = (req, res, next) => {
  passport.authenticate('google-master', { session: false }, async (err, masterUser, info) => {
    if (err || !masterUser) {
      console.error('Master OAuth error:', err || 'No user');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
    try {
      console.log('[OAuth] Master authenticated:', masterUser.email);
      setAuthCookies(res, masterUser._id, 'superadmin', null, true);
      return res.redirect(`${config.frontendUrl}/master/tenants`);
    } catch (error) {
      console.error('Master OAuth callback error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};*/


/*import { randomBytes } from 'crypto';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../../../config/env.js';
import connectDB from '../../../config/database.js';
import { MasterUserModel } from '../../../database/models/masterUser.model.js';
import { UserModel } from '../../../database/models/user.model.js';

const setAuthCookies = (res, userId, role, tenantId = null, isMaster = false) => {
  const payload = { sub: userId, role, tenantId };
  console.log('[Auth] Signing access token with payload:', payload);
  
  const accessToken = jwt.sign(
    { sub: userId, role, tenantId },
    config.jwt.accessSecret,
    { expiresIn: '15m', jwtid: randomBytes(16).toString('hex') }
  );
  const refreshToken = jwt.sign(
    { sub: userId, role, tenantId },
    config.jwt.refreshSecret,
    { expiresIn: '7d' }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',   // changed from 'strict'
  };
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  if (isMaster) {
    res.cookie('master_token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
};

// Tenant OAuth
/* export const googleAuth = (req, res, next) => {
  const state = req.tenant?.dbName;
  if (!state) {
    return res.redirect(`${config.frontendUrl}/login?error=missing_tenant`);
  }
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state,
  })(req, res, next);
};*
// Tenant OAuth
export const googleAuth = (req, res, next) => {
  // Try to get tenant from multiple sources
  let tenantId = req.tenant?.dbName;
  
  // If not in req.tenant, try from query parameter
  if (!tenantId && req.query.tenant) {
    tenantId = req.query.tenant;
  }
  
  // If still not found, try from host header (for localhost)
  if (!tenantId && req.headers.host) {
    const host = req.headers.host.split(':')[0];
    if (host !== 'localhost' && host !== '127.0.0.1') {
      tenantId = host;
    }
  }
  
  // Last resort - use default tenant from env
  if (!tenantId && process.env.DEFAULT_TENANT) {
    tenantId = process.env.DEFAULT_TENANT;
  }
  
  if (!tenantId) {
    console.error('[OAuth] No tenant found for Google auth');
    return res.redirect(`${config.frontendUrl}/login?error=missing_tenant`);
  }
  
  console.log('[OAuth] Starting Google auth for tenant:', tenantId);
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: tenantId,
  })(req, res, next);
};

/*export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err || !user) {
      console.error('OAuth error:', err || 'No user');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
    try {
      const tenantId = req.query.state;
      if (!tenantId) throw new Error('Missing tenant');
      setAuthCookies(res, user._id, user.role, tenantId);
      return res.redirect(`${config.frontendUrl}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};/
export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err || !user) {
      console.error('OAuth error:', err || 'No user');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
    try {
      const tenantId = req.query.state;
      if (!tenantId) throw new Error('Missing tenant');

      // The user object comes from passport strategy – it's a Mongoose document.
      // Ensure it has a valid _id (should be already saved)
      console.log('[OAuth] User authenticated:', {
        id: user._id,
        email: user.email,
        tenantId: user.tenantId,
      });

      // Double-check that the user actually exists in the tenant database
      // (In case the strategy returned an unsaved object – very unlikely)
      if (user.isNew) {
        console.warn('[OAuth] User is new – saving now...');
        await user.save();
        console.log('[OAuth] User saved, new id:', user._id);
      }

      setAuthCookies(res, user._id, user.role, tenantId);
      return res.redirect(`${config.frontendUrl}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};

// Master OAuth
export const masterGoogleAuth = passport.authenticate('google-master', {
  scope: ['profile', 'email'],
});

export const masterGoogleCallback = (req, res, next) => {
  passport.authenticate('google-master', { session: false }, async (err, masterUser, info) => {
    if (err || !masterUser) {
      console.error('Master OAuth error:', err || 'No user');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
    try {
      setAuthCookies(res, masterUser._id, 'superadmin', null, true);
      return res.redirect(`${config.frontendUrl}/master/tenants`);
    } catch (error) {
      console.error('Master OAuth callback error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};*/



/*import { randomBytes } from 'crypto';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../../../config/env.js';
import connectDB from '../../../config/database.js';
import { MasterUserModel } from '../../../database/models/masterUser.model.js';
import { UserModel } from '../../../database/models/user.model.js';

const setAuthCookies = (res, userId, role, tenantId = null, isMaster = false) => {
  const accessToken = jwt.sign(
    { sub: userId, role, tenantId },
    config.jwt.accessSecret,
    { expiresIn: '15m', jwtid: randomBytes(16).toString('hex') }
  );
  const refreshToken = jwt.sign(
    { sub: userId, role, tenantId },
    config.jwt.refreshSecret,
    { expiresIn: '7d' }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
  };
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  // Legacy cookie for backward compatibility
  res.cookie('token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  if (isMaster) {
    res.cookie('master_token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
};

// Tenant OAuth
export const googleAuth = (req, res, next) => {
  const state = req.tenant?.dbName;
  if (!state) {
    return res.redirect(`${config.frontendUrl}/login?error=missing_tenant`);
  }
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state,
  })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err || !user) {
      console.error('OAuth error:', err || 'No user');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
    try {
      const tenantId = req.query.state;
      if (!tenantId) throw new Error('Missing tenant');
      setAuthCookies(res, user._id, user.role, tenantId);
      return res.redirect(`${config.frontendUrl}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};

// Master OAuth
export const masterGoogleAuth = passport.authenticate('google-master', {
  scope: ['profile', 'email'],
});

export const masterGoogleCallback = (req, res, next) => {
  passport.authenticate('google-master', { session: false }, async (err, masterUser, info) => {
    if (err || !masterUser) {
      console.error('Master OAuth error:', err || 'No user');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
    try {
      setAuthCookies(res, masterUser._id, 'superadmin', null, true);
      return res.redirect(`${config.frontendUrl}/master/tenants`);
    } catch (error) {
      console.error('Master OAuth callback error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};*/

/*import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../../../config/env.js';
import connectDB from '../../../config/database.js';
import { MasterUserModel } from '../../../database/models/masterUser.model.js';
import { UserModel } from '../../../database/models/user.model.js';

/*const setAuthCookies = (res, userId, role, tenantId = null, isMaster = false) => {
  const accessToken = jwt.sign(
    { sub: userId, role, tenantId },
    config.jwt.accessSecret,
    { expiresIn: '15m', jwtid: require('crypto').randomBytes(16).toString('hex') }
  );
  const refreshToken = jwt.sign(
    { sub: userId, role, tenantId },
    config.jwt.refreshSecret,
    { expiresIn: '7d' }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
  };
  // New auth cookies
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  // Legacy cookie for old frontend
  res.cookie('token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  if (isMaster) {
    res.cookie('master_token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
};/
const setAuthCookies = (res, userId, role, tenantId = null, isMaster = false) => {
  const accessToken = jwt.sign(
    { sub: userId, role, tenantId },   // ✅ 'sub' not 'id'
    config.jwt.accessSecret,
    { expiresIn: '15m', jwtid: require('crypto').randomBytes(16).toString('hex') }
  );
  const refreshToken = jwt.sign(
    { sub: userId, role, tenantId },
    config.jwt.refreshSecret,
    { expiresIn: '7d' }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
  };
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // legacy
  if (isMaster) {
    res.cookie('master_token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
};

// Tenant OAuth
export const googleAuth = (req, res, next) => {
  const state = req.tenant?.dbName;
  if (!state) {
    return res.redirect(`${config.frontendUrl}/login?error=missing_tenant`);
  }
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state,
  })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err || !user) {
      console.error('OAuth error:', err || 'No user');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
    try {
      const tenantId = req.query.state;
      if (!tenantId) throw new Error('Missing tenant');
      setAuthCookies(res, user._id, user.role, tenantId);
      return res.redirect(`${config.frontendUrl}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};

// Master OAuth
export const masterGoogleAuth = passport.authenticate('google-master', {
  scope: ['profile', 'email'],
});

export const masterGoogleCallback = (req, res, next) => {
  passport.authenticate('google-master', { session: false }, async (err, masterUser, info) => {
    if (err || !masterUser) {
      console.error('Master OAuth error:', err || 'No user');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
    try {
      setAuthCookies(res, masterUser._id, 'superadmin', null, true);
      return res.redirect(`${config.frontendUrl}/master/tenants`);
    } catch (error) {
      console.error('Master OAuth callback error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};*/

/*import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../../../config/env.js';
import connectDB from '../../../config/database.js';
import { MasterUserModel } from '../../../database/models/masterUser.model.js';
import { UserModel } from '../../../database/models/user.model.js';

const setTokenCookie = (res, userId, role, tenantId = null, isMaster = false) => {
  const token = jwt.sign(
    { id: userId, role, tenantId },
    config.jwt.accessSecret,
    { expiresIn: '7d' }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
  };
  res.cookie('token', token, cookieOptions);
  if (isMaster) {
    res.cookie('master_token', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
};

// Tenant user OAuth – initial redirect
export const googleAuth = (req, res, next) => {
  const state = req.tenant?.dbName;
  if (!state) {
    return res.redirect(`${config.frontendUrl}/login?error=missing_tenant`);
  }
  const authenticator = passport.authenticate('google', {
    scope: ['profile', 'email'],
    state,
  });
  authenticator(req, res, next);
};

// Tenant user OAuth – callback
/*export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }

    try {
      const tenantId = req.query.state;
      if (!tenantId) throw new Error('Missing tenant');

      const tenantConn = await connectDB(tenantId);
      const User = tenantConn.model('User', UserModel.schema);

      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          user.authProvider = 'google';
          await user.save();
        } else {
          user = new User({
            username: profile.displayName.replace(/\s/g, '').toLowerCase(),
            email: profile.emails[0].value,
            googleId: profile.id,
            authProvider: 'google',
            role: 'editor',
            active: true,
            tenantId,
          });
          await user.save();
        }
      }

      setTokenCookie(res, user._id, user.role, tenantId);
      return res.redirect(`${config.frontendUrl}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};/
    export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      console.error('OAuth error:', err || 'No profile');
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }

    try {
      const tenantId = req.query.state;
      if (!tenantId) throw new Error('Missing tenant');

      const email = profile.emails?.[0]?.value;
      if (!email) {
        throw new Error('No email returned from Google');
      }

      const tenantConn = await connectDB(tenantId);
      const User = tenantConn.model('User', UserModel.schema);

      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          user.authProvider = 'google';
          await user.save();
        } else {
          user = new User({
            username: profile.displayName?.replace(/\s/g, '').toLowerCase() || email.split('@')[0],
            email,
            googleId: profile.id,
            authProvider: 'google',
            role: 'editor',
            active: true,
            tenantId,
          });
          await user.save();
        }
      }

      setTokenCookie(res, user._id, user.role, tenantId);
      return res.redirect(`${config.frontendUrl}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};



// Master OAuth – initial redirect
export const masterGoogleAuth = passport.authenticate('google-master', {
  scope: ['profile', 'email'],
});

// Master OAuth – callback
export const masterGoogleCallback = (req, res, next) => {
  passport.authenticate('google-master', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }

    try {
      const MasterUser = MasterUserModel;
      let master = await MasterUser.findOne({ googleId: profile.id });
      if (!master) {
        const allowedEmails = (process.env.MASTER_EMAILS || '').split(',');
        if (!allowedEmails.includes(profile.emails[0].value)) {
          return res.redirect(`${config.frontendUrl}/login?error=not_authorized`);
        }
        master = new MasterUser({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id,
        });
        await master.save();
      }

      setTokenCookie(res, master._id, 'superadmin', null, true);
      return res.redirect(`${config.frontendUrl}/master/tenants`);
    } catch (error) {
      console.error('Master OAuth error:', error);
      return res.redirect(`${config.frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
};*/

/*
const passport = require('passport');
const jwt = require('jsonwebtoken');
const MasterUser = require('../../../database/models/masterUser.model.js');
const connectDB = require('../../../config/database.js');  // ✅ fixed path

const setTokenCookie = (res, userId, role, tenantId = null, isMaster = false) => {
  const token = jwt.sign(
    { id: userId, role, tenantId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };
  res.cookie('token', token, cookieOptions);
  if (isMaster) {
    // Store a separate master token that never gets overwritten by tenant switching
    res.cookie('master_token', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
};

// Tenant user OAuth – initial redirect (uses 'google' strategy)
exports.googleAuth = (req, res, next) => {
  const state = req.tenant.dbName;
  const authenticator = passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state
  });
  authenticator(req, res, next);
};

// Tenant user OAuth – callback
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      const tenantId = req.query.state;
      if (!tenantId) throw new Error('Missing tenant');

      const tenantConn = await connectDB(tenantId);
      const User = tenantConn.model('User', require('../../../../models/User'));

      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          user.authProvider = 'google';
          await user.save();
        } else {
          user = new User({
            username: profile.displayName.replace(/\s/g, '').toLowerCase(),
            email: profile.emails[0].value,
            googleId: profile.id,
            authProvider: 'google',
            role: 'editor',
            active: true
          });
          await user.save();
        }
      }

      setTokenCookie(res, user._id, user.role, tenantId);
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
};

// ========== MASTER OAUTH – USE 'google-master' STRATEGY ==========
exports.masterGoogleAuth = passport.authenticate('google-master', {   // ✅ fixed
  scope: ['profile', 'email']
});

exports.masterGoogleCallback = (req, res, next) => {
  passport.authenticate('google-master', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      let master = await MasterUser.findOne({ googleId: profile.id });
      if (!master) {
        const allowedEmails = (process.env.MASTER_EMAILS || '').split(',');
        if (!allowedEmails.includes(profile.emails[0].value)) {
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=not_authorized`);
        }
        master = new MasterUser({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id
        });
        await master.save();
      }

      setTokenCookie(res, master._id, 'superadmin', null, true);
      return res.redirect(`${process.env.FRONTEND_URL}/master/tenants`);
    } catch (error) {
      console.error('Master OAuth error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
};*/

/*const passport = require('passport');
const jwt = require('jsonwebtoken');
const MasterUser = require('../models/MasterUser');
const connectDB = require('../config/db');  // ✅ fixed path

const setTokenCookie = (res, userId, role, tenantId = null) => {
  const token = jwt.sign(
    { id: userId, role, tenantId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};

// Tenant user OAuth – initial redirect
exports.googleAuth = (req, res, next) => {
  const state = req.tenant.dbName;   // tenant dbName as state
  const authenticator = passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state
  });
  authenticator(req, res, next);
};

// Tenant user OAuth – callback
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      const tenantId = req.query.state;
      if (!tenantId) throw new Error('Missing tenant');

      const tenantConn = await connectDB(tenantId);
      const User = tenantConn.model('User', require('../models/User'));

      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          user.authProvider = 'google';
          await user.save();
        } else {
          user = new User({
            username: profile.displayName.replace(/\s/g, '').toLowerCase(),
            email: profile.emails[0].value,
            googleId: profile.id,
            authProvider: 'google',
            role: 'editor',
            active: true
          });
          await user.save();
        }
      }

      setTokenCookie(res, user._id, user.role, tenantId);
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      // Log the full error stack and message
      console.error(error.stack);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
};

// Master OAuth – initial redirect
exports.masterGoogleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// Master OAuth – callback
exports.masterGoogleCallback = async (req, res, next) => {
  passport.authenticate('google-master', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      let master = await MasterUser.findOne({ googleId: profile.id });
      if (!master) {
        const allowedEmails = (process.env.MASTER_EMAILS || '').split(',');
        if (!allowedEmails.includes(profile.emails[0].value)) {
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=not_authorized`);
        }
        master = new MasterUser({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id
        });
        await master.save();
      }

      setTokenCookie(res, master._id, 'superadmin', null);
      return res.redirect(`${process.env.FRONTEND_URL}/master/tenants`);

    } catch (error) {
      console.error('Master OAuth error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
};*/
// Master OAuth – callback
/*exports.masterGoogleCallback = async (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      let master = await MasterUser.findOne({ googleId: profile.id });
      if (!master) {
        const allowedEmails = (process.env.MASTER_EMAILS || '').split(',');
        if (!allowedEmails.includes(profile.emails[0].value)) {
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=not_authorized`);
        }
        master = new MasterUser({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id
        });
        await master.save();
      }

      setTokenCookie(res, master._id, 'superadmin', null);
      return res.redirect(`${process.env.FRONTEND_URL}/master/tenants`);
    } catch (error) {
      console.error('Master OAuth error:', error);
      // Log the full error stack and message
      console.error(error.stack);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
};*/