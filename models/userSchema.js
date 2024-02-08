import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Please enter an email address"],
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    photo: {
        type: String,
        // default: 'default.jpg'
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: 8
    },
    confirmPassword: {
        type: String,
        required: ['Please confirm your password'],
        validate: {
            validator: function(val){
               return val == this.password;
            },
            message: 'password and confirmPassword does not match'
        }
        // validator is only work with save() or create() function only. does not work with findOneAndUpdate()
    }
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


export const  User = mongoose.model("users", userSchema);