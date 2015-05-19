var User = require('models/user').User;

module.exports = function(req, res, next) {
    req.user = res.locals.user = null;

    if (!req.session.username) return next();

    User.findOne({ username: req.session.username }, function(err, user) {
        if (err) return next(err);

        req.user = res.locals.user = user;
        next();
    });
};