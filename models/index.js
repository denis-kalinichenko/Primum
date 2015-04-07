module.exports = function(mongoose, autoIncrement) {
    var userSchema = new mongoose.Schema({
        username: String,
        name: {
            first: String,
            last: String
        },
        birthday: Date, //TODO remove it
        email: {
            main: String,
            valid: Boolean,
            valid_key: String
        },
        sex: Number, //TODO remove it
        userpic: {
            small: String,
            medium: String,
            origin: String
        },
        activity: {
            last_seen: Date,
            last_ip: String,
            deleted: Boolean
        },
        reg: Date,
        password: String //TODO add MD5 hashing (npm install MD5)
    });
    userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'user_id', startAt: 1 });

    var validSchema = new mongoose.Schema({ //TODO remove it
        user_id: Number,
        email: String,
        key: String
    });
    var models = {
        Users : mongoose.model('User', userSchema),
        Valids : mongoose.model('Valid', validSchema) //TODO remove it
    };

    return models;
};
