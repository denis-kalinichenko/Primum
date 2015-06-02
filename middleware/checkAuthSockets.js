module.exports = function(socket) {
    if(!socket.request.session.username) {
        return false;
    }
};