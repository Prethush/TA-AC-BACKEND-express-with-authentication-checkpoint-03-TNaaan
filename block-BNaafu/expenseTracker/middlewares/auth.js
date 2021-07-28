let User = require('../models/users');
module.exports = {

    loggedInUser: (req, res, next) => {
        if((req.session && req.session.userId) || (req.session.passport && req.session.passport.user)) {
            next();
        } else {
            req.flash("error", "Please Login First");
            res.redirect('/users/login');
        }
    },

    userInfo: (req, res, next) => {
        let userId = (req.session && req.session.userId) || (req.session.passport && req.session.passport.user);
        if(userId) {
            User.findById(userId, (err, user) => {
                if(err) return next(err);
                req.user = user;
                res.locals.user = user;
                return next();
            })
        } else {
            req.user = null;
            res.locals.user = null;
            next();
        }
    }
}