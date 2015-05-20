var User = require('models/user').User;
var Friendship = require('models/friendship').Friendship;
var FriendError = require('models/friendship').FriendError;


module.exports = function(req, res, next) {
    req.user = res.locals.user = null;

    if (!req.session.username) return next();

    User.findOne({ username: req.session.username }, function(err, user) {

        if (err) return next(err);

        Friendship.getFriendsRequests(user.user_id, function(err, friendships) {
            if (err) return next(err);

            req.user = res.locals.user = user;

            friendships['_lenght'] = friendships.length;
            req.friendsRequests = res.locals.friendsRequests = friendships;

            next();
        });

    });


};