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
