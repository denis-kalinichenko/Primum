module.exports = function(mongoose, autoIncrement) {
    var userSchema = new mongoose.Schema({
        username: String,
        name: {
            first: String,
            last: String
        },
        birthday: Date,
        email: {
            main: String,
            valid: Boolean
        },
        sex: Number,
        userpic: {
            small: String,
            medium: String,
            origin: String
        },
        activity: {
            last_seen: Date,
            deleted: { type: Boolean, default: false }
        },
        reg: Date,
        password: String
    });
    userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'user_id', startAt: 1 });

    var validSchema = new mongoose.Schema({
        user_id: Number,
        email: String,
        key: String
    });
    var models = {
        Users : mongoose.model('User', userSchema),
        Valids : mongoose.model('Valid', validSchema)
    };

    return models;
};