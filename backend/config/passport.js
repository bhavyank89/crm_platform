import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const CLIENT_ID = process.env.G_CLIENT_ID;
const CLIENT_SECRET = process.env.G_CLIENT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL; 

if (!CLIENT_ID || !CLIENT_SECRET || !BACKEND_URL) {
    throw new Error('Missing required Google OAuth environment variables.');
}

passport.use(
    new GoogleStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: `${BACKEND_URL}/api/auth/google/callback`, 
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value || '',
                        avatar: profile.photos?.[0]?.value || '',
                    });
                }

                return done(null, user);
            } catch (err) {
                console.error('Error in GoogleStrategy:', err);
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id); // Store user ID in session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        console.error('Error in deserializeUser:', err);
        done(err, null);
    }
});
