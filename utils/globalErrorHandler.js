/* 

import { Node_Env } from "../config/config.js";

export function globalErrorHandler(error, req, res, next){
    // console.log('globalErrorHandler error', error)
    error.statusCode = error.statusCode || 500;
    error.status = error.status ||  'error';

    if(Node_Env == "development"){
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
            stackTrace: error.stack,
            error: error
        })
    }
    else if(Node_Env == "production"){
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        })
    }
}

*/

// *************************************************************************************************************

import { Node_Env } from "../config/config.js";
import { CustomError } from "./CustomError.js";

// --------------------------------------------------------------------------------------------------------------

const castErrorHandler = (error)=>{
    const message =  `Invalid value ${error.value} for ${error.path}`
    return new CustomError(message, 404);
}

const duplicateKeyHandler = (error)=>{
    const name_email = error.keyValue.name || error.keyValue.email 
    const message = `There is already '${name_email}' available, Please provide different value.`
    return new CustomError(message, 404);
}

const validationErrorHandler = (err)=>{
   const errors =  Object.values(err.errors).map((val)=>val.message);
   const errorMessages = errors.join(". ");
   const errMessage = `Invalid input data: ${errorMessages}`
   return new CustomError(errMessage , 400)   
}

const tokenExpiredHandler = (err)=>{
    return new CustomError("Token has expired. Please login again", 401);
}

const invalidTokenHandler = (err)=>{
    return new CustomError('Invalid Token!', 401);
}

// --------------------------------------------------------------------------------------------------------------

const devErrors = (res, error)=>{
    return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error
    })
}

// --------------------------------------------------------------------------------------------------------------

const prodErrors = (res, error)=>{
    if(error.isOperational){
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        })
        /* 
            isOperational =>    is from CustomError.js 
            on CustomError class we created property isOperational
            and most of the error we are going to create from our CustomError class.
        */
    }
    else{
        return res.status(error.statusCode).json({
            status: "error",
            message: "Something went wrong! Please, try again later"
        })
        /* 
            some errors will be created by mongoose, and those errors will not have propety like isOperational
            so, else part will have errors like, mongoose validation errors, etc,

            but above we have general message only for all the erros..
            we need  to send specific messages for each type of error.
            so,
            we have to make mongoose validation error also isOperational error, so we can send meanigfull
            message to client.
        */
    }  
}

// --------------------------------------------------------------------------------------------------------------

export function globalErrorHandler(error, req, res, next){
    // console.log('globalErrorHandler error', error)
    error.statusCode = error.statusCode || 500;
    error.status = error.status ||  'error';

    if(Node_Env == "development"){
        devErrors(res, error)
    }
    else if(Node_Env == "production"){

        if(error.name == "CastError"){
          error = castErrorHandler(error)
        }
        if(error.code == 11000){
            error = duplicateKeyHandler(error)
        }
        if(error.name == "ValidationError"){
            error =  validationErrorHandler(error)
        }
        if(error.name == "TokenExpiredError"){
            error = tokenExpiredHandler(error)
        }
        if(error.name == "JsonWebTokenError"){
            error = invalidTokenHandler(error);
        }
        prodErrors(res, error)
    }
}




