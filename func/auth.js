/**
 * Created by Denis on 2015-04-07.
 */

module.exports = {
    checkAuth: function(req, res, next) {
        console.log(req);
        if (!req.session.user_id) {
            res.send('You are not authorized to view this page');
        } else {
            next();
        }
    }
};