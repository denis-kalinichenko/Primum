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
        reg: Date
    });
    userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'user_id' });

    var models = {
        Users : mongoose.model('User', userSchema)
    };

    return models;
};