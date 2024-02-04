export function globalErrorHandler (error, req, res, next){
    // console.log('globalErrorHandler error', error)
    error.statusCode = error.statusCode || 500;
    error.status = error.status ||  'error';
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    })
    next();
}