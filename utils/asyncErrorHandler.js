// goal of this function is catch the error that occurs in async function
export const asyncErrorHandler = (func)=>{
    // func(req, res, next);
    //  here, func() function return promise, that promise either resolve or rejected
    // func(req, res, next).catch((err)=>next(err));
    // but here func()  function is called immediately, as soon as asyncErrorHandler function is called

    //  so return annonymous function from this asyncErrorHandler and then assign it to creteMovie
    // so this annonymous function will be called by express app.. on route
    // so when express call this function, it is going to pass req, res, next

    return (req, res, next)=>{
        func(req, res, next).catch((err)=>next(err))
    }

}

