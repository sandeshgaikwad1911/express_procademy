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
    else if(Node_Env == "development"){
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
    const message = `There is already movie with name '${error.keyValue.name}', Please use another name.`
    return new CustomError(message, 404);
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
        return res.status(500).json({
            status: "error",
            message: "Something went wrong! Please, try again later"
        })
        /* 
            some errors will be created by mongoose, and those errors will not have propety like isOperational
            so, else part will have errors like, mongoose validation errors, etc,

            but above we have general message only for all the erros..
            we need  to send specific messages for each type of error.
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

        if(error.name === "CastError"){
          error = castErrorHandler(error)
        }
        if(error.code == 11000){
            error = duplicateKeyHandler(error)
        }
        prodErrors(res, error)
    }
}

