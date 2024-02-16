import { PORT } from "./config/config.js";
import { connectDB } from "./config/db_connection.js";
import movieRoutes from './routes/movieRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

import expressRateLimit from 'express-rate-limit';
import helmet from 'helmet'

import express from "express";
import  { CustomError }  from "./utils/CustomError.js";
import { globalErrorHandler } from "./utils/globalErrorHandler.js";

const app = express();

app.use(helmet())

const rateLimiter = expressRateLimit({
    windowMs: 60 * 60 * 1000, // 1hour
    max: 100,   // 100 requests in  1hour
    message:  "Too many request from this IP, please try again after an hour!"
    // if we re-start application, again we have 100 requsts
});

app.use('/api', rateLimiter);
// we want to apply this middleware on all that api that  starts with '/api'

app.use(express.json({
    limit: '10kb'       // only accept 10kb data in requst, rest of data will truncate
}));

app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

// ---------------------------------------------------------------------------------------------------------------

// default route => if the route dosen't match specified all the route. it must be at last position.

/* app.all('*', (req, res, next)=>{
    return res.status(404).json({
        status: "fail",
        message: `can't find ${req.originalUrl} on the server`
    })
}) */
// app.all  => means all the route functions eg.    get(), put(), delete(), post(), patch()

/* app.all('*', (req, res, next)=>{
    const err = new Error(`Can't find ${req.originalUrl} on the server`);
    err.status = "fail";
    err.statusCode  = 404;

    next(err);  
        
    // next(err) .... here we are passing error object to global error handling middleware function.
    // 
    //     whenever we pass any argument to next function, express automatically knows that, this is an error.
    //     in that case express will skip all other middleware function currently in middleware stack and
    //     direclty call global error handling middleware.
    // 
})
 */
/* 
    new Error() constructor is used to create a new error object in javascript.

    we are going to pass this error object to this global error handling middleware function when we call it.
    and on that error object we expect  statusCode, status and message.
    so, on this error object we need to set these properties.

*/

// default route => if the route dosen't match specified all the route. it must be at last position.
app.all('*', (req, res, next)=>{
    const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404);
    // console.log('err', err)
   next(err);  // passing err object to globalErrorHandler middleware function.
})


// ---------------------------------------------------------------------------------------------------------------

    // global error handling middleware.

    // app.use((error, req, res, next)=>{
    //     error.statusCode = error.statusCode || 500;
    //     error.status = error.status ||  'error';
    //     res.status(error.statusCode).json({
    //         status: error.status,
    //         message: error.message
    //     })
    //     next();
    // })

    app.use(globalErrorHandler)

// ---------------------------------------------------------------------------------------------------------------

const port = PORT || 4001;

app.listen(port, ()=>{
    connectDB(); 
    console.log(`app is running on http://127.0.0.1:${port}`);
});

/* 
    npm run dev
    npm run prod
*/


/* 
    Error Handling

    1. Operational Errors =>   
        a]. Requst Time out  b]. Database connection Error    
        c].  trying to access invalid route  d].  inputting invalid data
    
    2.  Programming Errors =>   are simply bugs we make.    

    we mainly handle    operational errors => express comes with error handling out of the box, we have to write global error
    handling middleware, which catch and handle all the errors happening in the application.

*/

/* 
    "mongoose": "^6.9.2",
    "express": "^4.18.2",
*/

/* 
        1. Brut Force attack
            in this type of attack hacker basically tries to guess a password
            by trying millins of random password
        
            we can avoid such attack using,
                1. implement max login attempts.    for eg. after three fail login attempts wait user for 1hour
                2. implement rate limiting.

        2. Denial of service  (DoS) attack
            in this type of attack hacker send so many request to the server
            that it crashesh the server and application becomes unavailable

                we can avoid such attack using,
                1. limit amount of data coming in request
                2. implement rate limiting.

        we are applying rate limiting
            Rate limiting => will make sure that single ip address does not make to many request to the server,
            
            rate limiting count number of requst coming from same ip and
            if too many requset then it blocks coming requst from that ip

            npm i express-rate-limit
    */

    /* 
        helmet helps secure  Express apps by setting HTTP headers.
            see helmet github repo

            npm i helmet
    
    */


