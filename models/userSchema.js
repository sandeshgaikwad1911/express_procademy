import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name."],
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Please enter an email address."],
        validate: [validator.isEmail, "Please enter a valid email."]
    },
    photo: {
        type: String,
        // default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        // enum: ['user', 'admin', 'admin1'],
        default: 'user',
        select: false    // // when we query for all users password will not be shown in response
    },
    password: {
        type: String,
        required: [true, "Please enter a password."],
        minLength: 8,
        select: false   // when we query for all users password will not be shown in response
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function(val){
               return val === this.password;
            },
            message: 'password and confirmPassword does not match'
        }
        // validator is work with save() or create() function only. does not work with findOneAndUpdate()
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,

})

userSchema.pre('save', async function(next){
    /*  
        we want to encrypt password if it is updating or creating new one,
        if it is not change then don't do anything, eg. if use updating email.

        isModified() is function where we check field, if it is modified or not
    */
    if (!this.isModified("password")){
        return next();
    }
    // we encrypt password before saving to database.
    this.password = await bcrypt.hash(this.password, 12);
    // once the password field encrypted we have to set confirmPassword field undefined,
    // we don't want to save confirmPassword field in database.
    this.confirmPassword = undefined
    next();
})

userSchema.methods.compareDBPassword = async function(pswd, paswdDB){
    return await bcrypt.compare(pswd, paswdDB)  // returns true or false
}

userSchema.methods.createResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // expire token after  10 min
    // console.log('resetToken=>', resetToken, 'this.pwdRstToken',  this.passwordResetToken)
    return resetToken;
    /* 
        here we return plain  text token because it should be sent via mail and anyone user see it.
        but in database we store encrypted token.
        and token will expires in 10min
    */
}

/* userSchema.pre(/^find/, function(next){
    this.find({isActive: true})
    next();
}) */

export const  User = mongoose.model("users", userSchema);