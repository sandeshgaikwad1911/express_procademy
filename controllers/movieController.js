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

    getAllMovies: async(req, res, next)=>{
        console.log("req.query",req.query);
        try {
            // const allMovies = await Movie.find();
            // const allMovies = await Movie.find(req.query);

            const excludeField = ["sort", "page", "limit", "fields"];
            const queryObj = {...req.query}

            excludeField.forEach((el)=>{
                delete queryObj[el]
                // if queryObj contain field that we want to exclude is going to delete
            });

            console.log("queryObj", queryObj);
            const allMovies = await Movie.find(queryObj);

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
    }

    
}


/* 
        http://localhost:4000/api/v1/?duration=90&rating=6
        console.log(req.query)      =>      { duration: '90', rating: '6' }

        we see duration is number but we get string inside obj, need to convert it into Number
        console.log(+req.query.duration)

        http://localhost:4000/api/v1/?duration=117&ratings=6.4&sort=1&page=11
        { duration: '117', ratings: '6.4', sort: '1', page: '11' }

*/

/* 
    Movie.find(req.query)    is not great approach,

    because sometime we fire query string which is not available field on Movie Object.(collction Object)
    for eg. http://localhost:4000/api/v1/?duration=117&ratings=6.4&sort=1&page=11
        we don't have sort and page field on Movie obj.

        so we need to remove or exclude some field from query string which is not available on Movie obj
        _ well we not exclude field from orignal query obj or query string.

        _ const excludeField = ["sort", "page", "limit", "fields"];

        _ we create shallow copy of req.query obj
        const queryObj = {...req.query}
        _and then we perform our operation on that shallow copy obj
        so we will exclude all that fueld that dont want on query obj.

        excludeField.forEach((el)=>{
            delete queryObj[el]
            // if queryObj contain field that we want to exclude is going to delete
        })


*/