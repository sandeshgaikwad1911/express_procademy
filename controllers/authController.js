import { User } from "../models/userSchema.js"
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js"

export const authController = {

    signup: asyncErrorHandler(async(req, res, next)=>{
        const newUser = await User.create(req.body)
        return res.status(201).json({
            status: 'success',
            data:{
                user: newUser
            }
        })
    }),
}