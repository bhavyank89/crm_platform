import passport_google_oauth20 from 'passport-google-oauth20';
import passport from 'passport';
import User from '../models/User.js'
import dotenv from 'dotenv';
dotenv.config();

const GoogleStrategy = passport_google_oauth20.Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.G_CLIENT_ID,
            clientSecret: process.env.G_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Create or find user
                console.log(profile);
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                    });
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
