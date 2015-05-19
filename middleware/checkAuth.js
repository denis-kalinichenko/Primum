module.exports = function(req, res, next) {
    if(!req.session.username) {
        return next(res.redirect('/login'));
    }
    next();
};