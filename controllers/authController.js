import { User } from "../models/userSchema.js"
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js"
import jwt from 'jsonwebtoken';
import { Jwt_Secret, Login_Expires } from "../config/config.js";
import { CustomError } from "../utils/CustomError.js";
import util from 'util';
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto';

const signToken = (id)=>{
    return jwt.sign({id: id}, Jwt_Secret, {expiresIn: Login_Expires});
}

export const authController = {

    allUsers: asyncErrorHandler(async(req, res, next)=>{
        const users = await User.find();
        return res.status(200).json({
            status: "success",
            data: {
                users
            }
        })
    }),

// ***********************************************************************************************

    signup: asyncErrorHandler(async(req, res, next)=>{
        const newUser = await User.create(req.body);
        // const token = jwt.sign({id: newUser._id}, Jwt_Secret, {expiresIn: Login_Expires});
        const token =  signToken(newUser._id);

        return res.status(201).json({
            status: 'success',
            token: token,
            data:{
                user: newUser
            }
        })
    }),

// ***********************************************************************************************

    login: asyncErrorHandler(async(req, res, next)=>{
        // const {email, password} = req.body;
        const email = req.body.email;
        const password = req.body.password;
        
        if( !email || !password ){
            const error = new CustomError("Please provide Email and Password for login in!", 400);
            return next(error)
        }

        const user = await User.findOne({email: email}).select("+password");
        // in resoponse we dont send  the password back to client side thats why on model we set password: {{select: false}} 
        //  but here we need password thats why .select("+passwod")
        if(!user){
            const error = new CustomError( "Invalid email or password.", 401);
            return next(error)
        }
        const isPasswordMatch =  await user.compareDBPassword(password, user.password);
        // compareDBPassword() method defined in userSchema

        if(!isPasswordMatch ) {
            const error = new CustomError( "Invalid email or password.", 401);
            return next(error)
        }

        const token = signToken(user._id)

        return res.status(200).json({
            status: "success",
            token: token,
        })

    }),

// ***********************************************************************************************

    protectedtRoute: asyncErrorHandler(async(req, res, next)=>{
        // 1.   get the token if it exist
                const testToken = req.headers.authorization;
                // on the req object we have headers property on that we set authorization property
                let token;
                if(testToken && testToken.startsWith("Bearer")){
                    token = testToken.split(" ")[1]
                }
                // console.log('token', token);
                if(!token){
                   return next(new CustomError("You are not logged in!", 401));
                }

        // 2.   verify token
                // const decodedToken = await jwt.verify(token, Jwt_Secret);
               /*  
                    verify() is async function but it's not going to retrun promise here,
                    so we have to make it promisify() function and make it accordingly
                    node js has built in library to make function promisify()
                */

                const decodedToken = await util.promisify(jwt.verify)(token, Jwt_Secret);
                // console.log('decodedToken', decodedToken);

        // 3.   check If the user exists
                // There might be chance that user may no longer exists in db.
                const user = await User.findById(decodedToken.id);
                if(!user){
                    const error = new CustomError("The user with given token does not exist.", 401);
                    return next(error);
                }


        // 5.   allow user to access  the protected route
                req.user = user;
                /* 
                    on the req object we set user property(req.user) and assigned login user details as a value
                */

                next();
    }),

// ***********************************************************************************************

    /* 
        we make wrapper function restrict. which wraps middleware function.
        we call this wrapper function instead middleware function
    */
//    .delete(authController.protectedtRoute, authController.restrict('admin'), movieController.deleteMovie)
    restrict: (role)=>{
        return (req, res, next)=>{
            if(req.user.role != role){
                const error = new CustomError( "You do not have permission to perform this action on this resource.", 403);
                next(error);
            }
            /*  
                when user login, on the req obj we set req.user = user details,
                which has role property means req.user.role

            */
           next();
        }
    },

    /* 

        // .delete(authController.protectedtRoute, authController.restrict('admin', 'admin1'), movieController.deleteMovie)
        // if multiple role has permission to delete movie

    restrict: (...role)=>{
        return (req, res, next)=>{
            if(!role.includes(req.user.role)){
                const error = new CustomError( "You do not have permission to perform this action on this resource.", 403);
                next(error);
            }
           next();
        }
    }
    
 */

// ***********************************************************************************************

    forgotPassword: asyncErrorHandler(async(req, res, next)=>{
        let user = await User.findOne({email: req.body.email});
        if (!user) {
            return next(new CustomError('No user found with given email', 404));
        }

        // generate random token.
        const resetToken = user.createResetPasswordToken(); // it's an instance method created in userSchema.js
        await user.save({validateBeforeSave: false});   // here we dont want to validate userSchema, otherwise it ask for required field defined on userSchema.
        
        // req.protocol = http or https 
        // req.host = localhost or 127.0.0.1 
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
        const message = `you have a received a password reset request, please use this link to reset your password :\n\n ${resetUrl} \n\n This link will be valid for next 10 min.`;
        try {
            // sendEmail method defined in utils > sendEmail.js file
            await sendEmail({
                email: user.email,
                subject: 'Please Reset Your Password',
                message: message
            })
            return res.status(200).json({
                status: 'success',
                message: 'A password reset link has been sent to your email address.'
            })
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpires = undefined;
            user.save({validateBeforeSave: false})

            return next(new CustomError("There was an error sending password reset email. Please try again later", 500))
        }
        
        
        
    }),

// ***********************************************************************************************
    /* 
        when user request for forgot-password link, user will receive password-reset link with token in email
        token will be used as an route parameter
    */
//    '/reset-password/:token'
    resetPassword: asyncErrorHandler(async(req, res, next)=>{
        const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
        const user = await User.findOne({passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()}});
        if(!user){
            return next(new CustomError('Password reset token is invalid or expired', 400))
        }
        // once user find we set password and confirmPassword
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;

        // and also set these to field undefined;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;

        await user.save();

        // and then login user automated

        const loginToken = signToken(user._id);

        return  res.status(200).json({
            status:'success',
            token: loginToken
        })
    }),

// ***********************************************************************************************

    updatePassword: asyncErrorHandler(async(req, res, next)=>{
        // console.log('currentUser', req.user);
        const user = await User.findById(req.user._id).select("+password");
        // console.log('user',user);
        const isPasswordMatch = await user.compareDBPassword(req.body.currentPassword, user.password);
        if(!isPasswordMatch) {
            return next(new CustomError('Your current password is wrong!', 401));
        }

        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;

        await user.save();

        // login user and send new jwt 
        const token = signToken(user._id);
        res.status(200).json({
            status:"success",
            token:token,
            data:{
                user: user
            }
        })
    }),

}  
 
    /* node
    require('crypto').randomBytes(32).toString('hex') */
