const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//================================
// User Schema
//================================
var UserSchema = new Schema({
    emp_id: {
        type: String,
        required: true,
        unique: true
    },
    emp_name: {
      type: String,
      required: true
    },
    dept_name: {
        type: String,
        required: true
    },
    emp_countrycode: {
        type: String,
        required: true
    },
    emp_contactnumber: {
        type: String,
        required: true
    },
    emp_address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    salt: { 
        type: String 
    },
    hash: { 
        type: String 
    },
    otp: { 
        type: String 
    },
    otptime: { 
        type: Date,
        default: Date.now 
    },
    lastlogin: {
        type: Date
    }
},{
    timestamps: true
});

//Method to generate password(hash) using salt
UserSchema.virtual('password').get(function () {
    return this._password;
}).set(function (password) {
    this._password = password;
    var salt = this.salt = bcrypt.genSaltSync(10); //old value "defaultSalt";
    this.hash = bcrypt.hashSync(password, salt); //password
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.hash, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
module.exports = mongoose.model('User',UserSchema);
