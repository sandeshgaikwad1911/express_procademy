import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';

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
        default: 'user'
    },
    password: {
        type: String,
        required: [true, "Please enter a password."],
        minLength: 8,
        select: false   // password will not be shown in response
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
    passwordChangedAt: Date
    /* 
        passwordChangedAt field will be available on user document only if this field has some value
        that means when user changed the password.
        if user not changed password this passwordChangedAt field will be undefined.
        that means it will not be available on user document.
    */
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




export const  User = mongoose.model("users", userSchema);