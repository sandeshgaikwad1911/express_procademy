import { Movie } from "../models/movieSchema.js";


export const movieController = {

    createMovie: async(req,res,next)=>{
        try {
            const movie = await Movie.create(req.body);
            res.status(201).json({
                status: "success",
                data:{
                    movie: movie
                }
            })
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            })
        }
    },

    getMovie: async(req,res,next)=>{
        try {
            // const movie = await Movie.findOne({_id: req.params.id})
            const movie = await Movie.findById(req.params.id);
            if(!movie){
                return res.status(400).json({
                    status: "fail",
                    message: "This movie is not available"
                })
            }

            return res.status(200).json({
                status: "success",
                data:{
                    movie: movie
                }
            })
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            })
        }
    },

    updateMovie: async(req,res,next)=>{
        try {
            const updateMovie = await Movie.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
            if(!updateMovie){
                return res.status(400).json({
                    status: "fail",
                    message: "This movie is not available"
                })
            }
            return res.status(200).json({
                status: "success",
                data:{
                    movie: updateMovie
                }
            })
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            })
        }
    },

    deleteMovie: async(req,res,next)=>{
        try {
            const movie = await Movie.findByIdAndDelete({_id: req.params.id})
            if(!movie){
                return res.status(400).json({
                    status: "fail",
                    message: 'movie not found'
                })
            }
            
            return res.status(200).json({
                status: "success",
                data: null
            })
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            })
        }
    },

    getAllMovies: async(req, res, next)=>{
        console.log("req.query", req.query);
        try {
            // const allMovies = await Movie.find();

            // const allMovies = await Movie.find(req.query);

            /* 
                const allMovies = await Movie.find()
                    .where('duration').equals(req.query.duration)
                    .where('ratings').equals(req.query.ratings)
            */

            /*
                const queryObj = {...req.query}
                const excludeField = ['limit', "sort", "page"];
                excludeField.forEach((el)=>{
                    // delete queryObj.el  // not work
                    delete queryObj[el]
                    // delete operator in js.. learn more
                })
                const allMovies = await Movie.find(queryObj);
            */

            
            /*
                const allMovies = await Movie.find({duration: {$gte: 117}, ratings: {$gte: 7.4}, price: {$lte: 60} })
       
                            or      mongoose special method.
                
                // http://localhost:4000/api/v1/?duration=117&ratings=7&price=60
                const allMovies = await Movie.find()
                    .where('duration').gte(req.query.duration)
                    .where('ratings').gte(req.query.ratings)
                    .where('price').lte(req.query.price)

                        or

                http://localhost:4000/api/v1/?duration[gte]=117&ratings[gte]=7&price[lte]=60
                let queryString;
                queryString = JSON.stringify(req.query);
                queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
                // \b => exact match. /g => global

                const queryObj = JSON.parse(queryString);
                console.log('queryObj', queryObj)

                const allMovies = await Movie.find(queryObj);

            */
                

            if(allMovies?.length < 1){
                return res.status(400).json({
                    status: 'fail',
                    message: 'no movie found'
                })
            }

            return res.status(200).json({
                status: "success",
                data:{
                    length: allMovies?.length,
                    allMovies: allMovies
                }
            })
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            })
        }

    },

    
}


/*      http://localhost:4000/api/v1/?ratings=6.4
        console.log(req.query) => req.query { ratings: '6.4' }

        http://localhost:4000/api/v1/?duration=90&rating=6
        console.log(req.query)      =>      { duration: '90', rating: '6' }

        we see duration or ratings are number but we get string inside obj, need to convert it into Number
        console.log(+req.query.duration)

*/

/* 
    http://localhost:4000/api/v1/?ratings=6.4&duration=117

    Movie.find(req.query)

        or

    const allMovies = await Movie.find()
                .where('duration').equals(req.query.duration)
                .where('ratings').equals(req.query.ratings)

      => its not great approach sometime, <=

    because sometime we fire query which is not available field on Movie Object.(collction Object)
    for eg. http://localhost:4000/api/v1/?duration=117&ratings=6.4&sort=1&page=11
        we don't have sort and page field on Movie obj.

        so we need to remove or exclude some field from query string which is not available on Movie obj
        _ well we not exclude field from orignal query obj or query string.

        _ we create shallow copy of req.query obj
            const queryObj = {...req.query}
        _and then we perform our operation on that shallow copy obj
        so we will exclude all that field that dont want on query obj.
        
        _ const excludeField = ["sort", "page", "limit"];

        excludeField.forEach((el)=>{
            // delete queryObj.el     // not work
            delete queryObj[el]
            // delete operator in js.. learn more
            
            // if queryObj contain field from excludeField Array is going to delete
        })
        const allMovies = await Movie.find(queryObj);
*/


/* 
        http://localhost:4000/api/v1/
        const allMovies = await Movie.find({duration: {$gte: 117}, ratings: {$gte: 7.4}, price: {$lte: 60} })

                 to achive above thing using query parameter.

        http://localhost:4000/api/v1/?duration[gte]=117&ratings[gte]=7&price[lte]=60
        const allMovie = await Movie.find(req.query)

        console.log(req.query);
        {
            duration: { gte: '117' },
            ratings: { gte: '7' },
            price: { lte: '60' }
        } 
    

        we are converting this query obj to string. so we can apply string method or regular expression. so we can achive desired goal.

        let queryString = JSON.stringify(req.query)
            console.log('queryString', queryString)
        {"duration":{"gte":"117"},"ratings":{"gte":"7"},"price":{"lte":"100"}}

        we need to convert all operator corresponding to mongoDB operator. like gte we have $gte

        let queryString;
        queryString = JSON.stringify(req.query);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
        // \b => exact match. /g => global

        // again need to convert string to obj
        const queryObj = JSON.parse(queryString);
        console.log('queryObj', queryObj)

        const allMovies = await Movie.find(queryObj);

                    OR

        http://localhost:4000/api/v1/?duration=117&ratings=7&price=60
                const allMovies = await Movie.find()
                    .where('duration').gte(req.query.duration)
                    .where('ratings').gte(req.query.ratings)
                    .where('price').lte(req.query.price)

        

*/