module.exports = function(mongoose, autoIncrement) {
    var userSchema = new mongoose.Schema({
        username: String,
        name: {
            first: String,
            last: String
        },
        email: {
            main: String,
            valid: Boolean,
            valid_key: String
        },
        userpic: { //TODO npm mongoose-file
            small: String,
            medium: String,
            origin: String
        },
        activity: {
            last: {
              seen: Date,
                ip: String
            },
            reg: Date,
            deleted: Boolean
        },
        password: String //TODO add MD5 hashing (npm install MD5)
    });
    userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'user_id', startAt: 1 });

    var models = {
        Users : mongoose.model('User', userSchema)
    };

    return models;
};
