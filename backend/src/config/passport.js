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
/*import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './env.js';
import { getMasterConnection, default as connectDB } from './database.js';
import { UserModel } from '../database/models/user.model.js';
import { MasterUserModel } from '../database/models/masterUser.model.js';

console.log('[Passport] Google Callback URL:', config.google.callbackUrl);
console.log('[Passport] Master Google Callback URL:', config.google.masterCallbackUrl);
// Tenant user strategy (must be named 'google')
passport.use('google', new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackUrl,
  passReqToCallback: true,
  scope: ['profile', 'email'],
  prompt: 'consent',
  profile: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Get tenant from state parameter
    const tenantId = req.query.state;
    if (!tenantId) {
      console.error('[Passport] No tenant in state');
      return done(new Error('Missing tenant state'), null);
    }
    
    console.log('[Passport] Processing Google login for tenant:', tenantId);
    
    const conn = await connectDB(tenantId);
    const User = conn.model('User', UserModel.schema);
    let user = await User.findOne({ googleId: profile.id });
    
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('No email returned from Google'), null);
    }

    /*if (!user) {
      // Try to find by email first
      user = await User.findOne({ email });
      if (user) {
        // Update existing user with Google ID
        user.googleId = profile.id;
        user.authProvider = 'google';
        user.tenantId = tenantId;  // Ensure tenantId is set
        await user.save();
        console.log('[Passport] Updated existing user with Google ID:', user._id);
      } else {
        // Create new user
        user = new User({
          username: profile.displayName.replace(/\s/g, '').toLowerCase(),
          email,
          googleId: profile.id,
          authProvider: 'google',
          role: 'editor',
          active: true,
          tenantId,  // Set tenantId
        });
        await user.save();
        console.log('[Passport] Created new user:', user._id);
      }
    } else {
      // User exists, ensure tenantId is correct
      if (!user.tenantId) {
        user.tenantId = tenantId;
        await user.save();
        console.log('[Passport] Updated existing user with tenantId');
      } 
    }/
   // In passport.js, replace the user creation block with:
      if (!user) {
        // First try to find by email
        user = await User.findOne({ email });
        if (user) {
          // Update existing user with Google info
          user.googleId = profile.id;
          user.authProvider = 'google';
          user.tenantId = tenantId;
          // Use save() without any pre-save middleware issues
          await user.save();
          console.log('[Passport] Updated existing user with Google ID:', user._id);
        } else {
          // Create new user - explicitly set only what we need
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
          console.log('[Passport] Created new user:', user._id);
        }
      } else {
        // User already exists, ensure tenantId is set
        if (!user.tenantId) {
          user.tenantId = tenantId;
          await user.save();
          console.log('[Passport] Updated existing user with tenantId');
        }
      }
          
 
  } catch (err) {
    console.error('[Passport] Error:', err);
    return done(err, null);
  }
}));
// Master admin strategy (must be named 'google-master')
passport.use('google-master', new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.masterCallbackUrl,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const masterConn = await getMasterConnection();
    const MasterUser = masterConn.model('MasterUser', MasterUserModel.schema);
    let master = await MasterUser.findOne({ googleId: profile.id });
    if (!master) {
      const allowedEmails = (process.env.MASTER_EMAILS || '').split(',');
      if (!allowedEmails.includes(profile.emails[0].value)) {
        return done(new Error('Not authorized'), null);
      }
      master = new MasterUser({
        email: profile.emails[0].value,
        name: profile.displayName,
        googleId: profile.id,
      });
      await master.save();
    }
    return done(null, master);
  } catch (err) {
    return done(err, null);
  }
}));
export default passport;*/


/*import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './env.js';
import { getMasterConnection, default as connectDB } from './database.js';
import { UserModel } from '../database/models/user.model.js';
import { MasterUserModel } from '../database/models/masterUser.model.js';

// Tenant user strategy (must be named 'google')
passport.use('google', new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackUrl,
  passReqToCallback: true,
  scope: ['profile', 'email'],          // explicit scope
  prompt: 'consent',
  // Ensure we get full profile
  profile: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const tenantId = req.query.state;
    //if (!tenantId) return done(new Error('Missing tenant state'), null);
    if (!tenantId) {
      console.error('[OAuth] No tenantId in request state');
      return done(new Error('Missing tenant ID'), null);
    }
    const conn = await connectDB(tenantId);
    const User = conn.model('User', UserModel.schema);
    let user = await User.findOne({ googleId: profile.id });
    
    console.log('Full profile:', JSON.stringify(profile, null, 2));
    // Get email safely
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('No email returned from Google'), null);
    }

    if (!user) {
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.googleId = profile.id;
        user.authProvider = 'google';
        user.tenantId = tenantId;
        await user.save();
      } else {
        user = new User({
          username: profile.displayName.replace(/\s/g, '').toLowerCase(),
          email,
          googleId: profile.id,
          authProvider: 'google',
          role: 'editor',
          active: true,
          tenantId,
        });
        await user.save();
      }

    }else {
      // User already exists, ensure tenantId is set
      if (!user.tenantId) {
        user.tenantId = tenantId;
        await user.save();
        console.log(`[OAuth] Updated existing user with tenantId: ${user._id}`);
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Master admin strategy (must be named 'google-master')
passport.use('google-master', new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.masterCallbackUrl,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const masterConn = await getMasterConnection();
    const MasterUser = masterConn.model('MasterUser', MasterUserModel.schema);
    let master = await MasterUser.findOne({ googleId: profile.id });
    if (!master) {
      const allowedEmails = (process.env.MASTER_EMAILS || '').split(',');
      if (!allowedEmails.includes(profile.emails[0].value)) {
        return done(new Error('Not authorized'), null);
      }
      master = new MasterUser({
        email: profile.emails[0].value,
        name: profile.displayName,
        googleId: profile.id,
      });
      await master.save();
    }
    return done(null, master);
  } catch (err) {
    return done(err, null);
  }
}));

export default passport;*/


/*
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './env.js';
import { getMasterConnection } from './database.js';
import connectDB from './database.js';
import { UserModel } from '../database/models/user.model.js';
import { MasterUserModel } from '../database/models/masterUser.model.js';

// Tenant user strategy
passport.use('google', new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackUrl,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const tenantId = req.query.state;
    if (!tenantId) return done(new Error('Missing tenant state'), null);
    const conn = await connectDB(tenantId);
    const User = conn.model('User', UserModel.schema);
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
    return done(null, user);
  } catch (err) {
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
    let master = await MasterUser.findOne({ googleId: profile.id });
    if (!master) {
      const allowedEmails = (process.env.MASTER_EMAILS || '').split(',');
      if (!allowedEmails.includes(profile.emails[0].value)) {
        return done(new Error('Not authorized'), null);
      }
      master = new MasterUser({
        email: profile.emails[0].value,
        name: profile.displayName,
        googleId: profile.id,
      });
      await master.save();
    }
    return done(null, master);
  } catch (err) {
    return done(err, null);
  }
}));

export default passport;*/
/*last stable
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = (passport) => {
  // Tenant users strategy
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));

  // Master admin strategy – use separate callback URL
  passport.use('google-master', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.MASTER_GOOGLE_CALLBACK_URL, // ✅ critical
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));
};*/

/*const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = (passport) => {
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    // Profile is passed to controller
    return done(null, profile);
  }));
};*/