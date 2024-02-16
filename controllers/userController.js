import { User } from "../models/userSchema.js";
import { CustomError } from "../utils/CustomError.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { signToken } from "./authController.js";

const filterReqOjb = (obj, ...allowedFields)=>{
    // console.log('allowed', allowedFields)       // allowed [ 'name', 'email' ]
    let newObj = {};
    Object.keys(obj).forEach((prop)=>{
        if(allowedFields.includes(prop)){
            // console.log("new", newObj)
            // console.log("prop", prop)
            newObj[prop] = obj[prop];
        }
    })
    return newObj
}

// *********************************************************************************************************

export const userController = {

    allUsers: asyncErrorHandler(async(req, res, next)=>{
        const users = await User.find({isActive: {$ne: false}});
        // const users = await User.find();
        return res.status(200).json({
            status: "success",
            length: users.length,
            data: {
                users
            }
        })
    }),

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

    /* 
        updateMe function update other info except  password
    */
    updateMe: asyncErrorHandler(async(req,res, next)=>{

        if(req.body.password || req.body.confirmPassword){
            return next(new CustomError('You can not update password and role here', 400))
        }

        // await user.save();  save() method expect value for all the required field.

        // const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {runValidators: true, new: true}); 
        const filteredObj = filterReqOjb(req.body, 'name','email', 'isActive'); 
        // here we want to update name and email and 'isActive' fields only, other fields will be ignored
        const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredObj, {runValidators: true, new: true}); 
        if(!updatedUser){
            return next(new CustomError('login first', 400))
        }
        return res.status(200).json({
            status: 'succuss',
            data: updatedUser
        })
        
    }),

    // to delete user we set... isActive: false, we r not deleteing user here just set it in-active

    deactive_account: asyncErrorHandler(async(req, res, next)=>{
        await User.findByIdAndUpdate(req.user._id, {isActive: false});
        return res.status(200).json({
            status: 'succuss',
            message:'Account has been Deactivated! Please login again to activate your account.'
        })
    }),



}
