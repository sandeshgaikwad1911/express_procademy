import { Movie } from "../models/movieSchema.js";


export const movieController = {

    createMovie: async(req,res,next)=>{
        try {
            const movie = await Movie.create(req.body);
            return res.status(201).json({
                status: "success",
                data:{
                    movie: movie
                }
            })
        } catch (error) {
            return res.status(400).json({
                status: "fail",
                message: error.message
            })
        }
    },

// ----------------------------------------------------------------------------------------------
    
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

// ----------------------------------------------------------------------------------------------

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

    /* 
        [1].    {new: true}  ... returns updated document.
        [2].    {runValidators: true} .... while updating documents.. validators defined in model is not work by default
                    so we have to use {runValidators: true}
    */

// ----------------------------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------------------------

    /* getAllMovies: async(req, res, next)=>{
        try {
            const allMovies = await Movie.find({});
            return res.status(200).json({
                status: "success",
                length: allMovies?.length,
                data:{
                    allMovies: allMovies
                }
            })
        } catch (error) {
            res.status(404).json({
                status: "fail",
                message: error.message
            })
        }

    }, */

    // http://localhost:4000/api/v1
    
// ----------------------------------------------------------------------------------------------

    //  excluding fields from url which are not present on Modal

    /* getAllMovies: async(req, res, next)=>{
        try {

            let query = req.query;
            console.log("query",query)

            let queryObj = {...req.query}
            console.log("queryObj",queryObj)

            const excludeField = ["sort", "page", "limit"]
            excludeField.forEach((el)=>{
                delete queryObj[el]
            })

            console.log("queryObj after exclude fields", queryObj);

            // const allMovies = await Movie.find(query);
            const allMovies = await Movie.find(queryObj);

            return res.status(200).json({
                status: "success",
                length: allMovies?.length,
                data:{
                    allMovies: allMovies
                }
            })
        } catch (error) {
            res.status(404).json({
                status: "fail",
                message: error.message
            })
        }

    }, */

    /* 
        on req obj we have property called query ( req.query ) 
        which is basically object which stores query string as key value pair

        http://localhost:4000/api/v1?duration=109&releaseYear=2013
        let query = req.query;
        console.log("query",query)
        query { duration: '109', releaseYear: '2013' }

        as we see all the values are string types.. so when we want to use those
        values we need to convert them into proper data types.
        for eg.     Movie.find({duration: +Movie.find({duration: +req.query.duration});});        
        //  + sign before req.query.duration... indicates convert string into number

        we can achieve same result using mongoose special methods, 
        const allMovies = await Movie.find()
                .where("duration").equals(req.query.duration)
                .where("releaseYear").equals(req.query.releaseYear);
        but it dosen't work when there is no specifid query in url... here we r not using this in proper way..

        const allMovies = await Movie.find(query);
            if we dont specify anything in url query.. it return all the documents
            but it's not going to work in all the scenario like sort, page because these are not the properties of Movie Modal
            http://localhost:4000/api/v1?sort=1&page=10?duration=117     
                we have no such property like sort or page or limit on Movie Modal
                so we will have to exclude such options, we are not exclude it from url.. we make shallow copy req.query obj

                const queryObj = req.query      // reference to same obje
                const queryObj = {...req.query}  // it creates shallow copy

                we perform operation on shallow copy obj not on actual query obj
            
                let queryObj = {...req.query}
                console.log("queryObj",queryObj)

                const excludeField = ["sort", "page", "limit"]
                excludeField.forEach((el)=>{
                    delete queryObj[el]
                })

                console.log("queryObj after exclude fields", queryObj);

                // const allMovies = await Movie.find(query);
                const allMovies = await Movie.find(queryObj);

    */
 

// ----------------------------------------------------------------------------------------------

// advance filtering on query

getAllMovies: async(req, res, next)=>{
    try {

        // const allMovies = await Movie.find({duration: {$gte: 150}, price: {$lte: 60}});

        // let query = req.query;
        // console.log('query', query)

        // let queryString = JSON.stringify(query)
        // console.log('queryString', queryString)

        // queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
        // console.log('modified query string', queryString)

        // const queryObj = JSON.parse(queryString)
        // console.log('queryObj', queryObj);

        // const allMovies = await Movie.find(queryObj);

        const allMovies = await Movie.find({})
            .where("duration").gte(req.query.duration);
        
        return res.status(200).json({
            status: "success",
            length: allMovies?.length,
            data:{
                allMovies: allMovies
            }
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }

},

/* 
    const allMovies = await Movie.find({duration: {$gte: 150}, price: {$lte: 60}});

    http://localhost:4000/api/v1?duration[gte]=150&price[lte]=60
        let query = req.query;
        console.log('query', query)
        query { duration: { gte: '150' }, price: { gte: '60' } }
    we need to add $ sign before gte... to achieve desired result
    1.  first we need to convert query obj into string to use regular expression
            let queryString = JSON.stringify(query)
    2.  queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
            \b .. \b   that means excatmatch,
            (match)=>   here match receives (gte|gt|lte|lt)   and we add $ sign before them
    3. then convert queryString into JsonObj using JSON.parse(quetyString)

    **we can also achieve same functionality using mongoose special method
        http://localhost:4000/api/v1?duration=150&price=60
        const allMovies = await Movie.find({})
            .where("duration").gte(150)
            .where("price").lte(60);

*/

// ----------------------------------------------------------------------------------------------


}
