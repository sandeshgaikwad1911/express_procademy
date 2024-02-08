import { PORT } from "./config/config.js";
import { connectDB } from "./config/db_connection.js";
import movieRoutes from './routes/movieRoutes.js'
import authRoutes from './routes/authRoutes.js'

import express from "express";
import  { CustomError }  from "./utils/CustomError.js";
import { globalErrorHandler } from "./utils/globalErrorHandler.js";

const app = express();

app.use(express.json());

app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/users', authRoutes);

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
    console.log(`app is running on http://localhost:${port}`);
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
