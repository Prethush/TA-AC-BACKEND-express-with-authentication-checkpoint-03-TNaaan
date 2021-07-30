var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/users');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    var email = profile._json.email;

    var githubData = {
        email: email,
        isVerified: true,
        github: {
            username: profile.username,
            image: profile._json.avatar_url
        },
        providers: [profile.provider]
    }
    User.findOne({email}, (err, user) => {
        if(err) return done(err, false);
        if(!user) {
            User.create(githubData, (err, addedUser) => {
                if(err) return done(err, false);
                return done(null, addedUser);
            })
        } else {
            if(user.providers.includes(profile.provider)) {
                return done(null, user);
            } else {
                user.providers.push(profile.provider);
                user.github = {...githubData.github};
                user.save((err, updatedUser) => {
                    if(err) return done(err, false);
                    return done(null, updatedUser);
                })
            }
        }
    })

}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    var email = profile._json.email;

    var googleData = {
        email: email,
        isVerified: true,
        google: {
            username: profile.displayName,
            image: profile._json.picture
        },
        providers: [profile.provider]
    }
    User.findOne({email}, (err, user) => {
        if(err) return done(err, false);
        if(!user) {
            User.create(googleData, (err, addedUser) => {
                if(err) return done(err, false);
                return done(null, addedUser);
            })
        } else {
            if(user.providers.includes(profile.provider)) {
                return done(null, user);
            } else {
                user.providers.push(profile.provider);
                user.google = {...googleData.google};
                user.save((err, updatedUser) => {
                    if(err) return done(err, false);
                    return done(null, updatedUser);
                })
            }
        }
    })
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if(err) return done(err, false);
        done(null, user);
    })
})

