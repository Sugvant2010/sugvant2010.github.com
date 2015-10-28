var mongoose = require('mongoose'),
    validate = require('mongoose-validate'),
    bcrypt = require('bcrypt-nodejs');


var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'Логин не может быть короче 3 символов'],
        maxlength: [20, 'Логин не может быть длиннее 20 символов']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: { validator: validate.email, message: 'Некорректный email адрес' }
    },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.pre('save', function(next) {
    var user = this;
    var SALT_FACTOR = 5;

    if (!user.isModified('password')) { return next(); }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) { return next(err); }

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { return cb(err); }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Users', userSchema);