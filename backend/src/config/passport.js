import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './env.js';
import { getMasterConnection, default as connectDB } from './database.js';
import { UserModel } from '../database/models/user.model.js';
import { MasterUserModel } from '../database/models/masterUser.model.js';

// Tenant user strategy
passport.use('google', new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackUrl,
  passReqToCallback: true,
  scope: ['profile', 'email'],
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const tenantId = req.query.state;
    console.log('[Passport] Processing login for tenant:', tenantId);
    
    if (!tenantId) {
      return done(new Error('Missing tenant state'), null);
    }
    
    const conn = await connectDB(tenantId);
    const User = conn.model('User', UserModel.schema);
    const email = profile.emails?.[0]?.value;
    
    if (!email) {
      return done(new Error('No email from Google'), null);
    }
    
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user
      user.googleId = profile.id;
      user.authProvider = 'google';
      user.tenantId = tenantId;
      await user.save();
      console.log('[Passport] Updated user:', user.email);
    } else {
      // Create new user
      user = new User({
        username: profile.displayName.replace(/\s/g, '').toLowerCase(),
        email: email,
        googleId: profile.id,
        authProvider: 'google',
        role: 'editor',
        active: true,
        tenantId: tenantId,
      });
      await user.save();
      console.log('[Passport] Created new user:', user.email);
    }
    
    return done(null, user);
  } catch (err) {
    console.error('[Passport] Error:', err);
    return done(err, null);
  }
}));

// Master admin strategy
passport.use('google-master', new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.masterCallbackUrl,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const masterConn = await getMasterConnection();
    const MasterUser = masterConn.model('MasterUser', MasterUserModel.schema);
    const email = profile.emails?.[0]?.value;
    
    let master = await MasterUser.findOne({ email });
    
    if (!master) {
      const allowedEmails = (process.env.MASTER_EMAILS || '').split(',');
      if (!allowedEmails.includes(email)) {
        return done(new Error('Not authorized'), null);
      }
      master = new MasterUser({
        email: email,
        name: profile.displayName,
        googleId: profile.id,
      });
      await master.save();
      console.log('[Passport] Created master user:', email);
    }
    
    return done(null, master);
  } catch (err) {
    console.error('[Passport] Master error:', err);
    return done(err, null);
  }
}));

export default passport;
