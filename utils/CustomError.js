//  in order make class a error class we need to inherit built-in error class so
export class CustomError extends  Error {

    constructor(message, statusCode){
        super(message);    // calling constructor of Error class and specify error message.
        /* 
            when we pass message to constructor of error class and 
            when we instante [new CustomError("Internal Server Error", 500)] this customError class
            then message is automatically set to super(message)
        */

       this.statusCode = statusCode;
       
       // this.something =>  means adding property on CustomError class
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";

        this.isOperational = true;
        // in production we want to send those errors only, that are operational

        Error.captureStackTrace(this, this.constructor)
        /* captureStackTrace    tells where the actually error happens in the code.
            Error class captures this StackTrace for any error that happpens in the code
            this means current object 
            this.constructor means CustomError class
        */
    }
}


// const error = new CustomError("Internal Server Error", 500);    // it's calling constructor.