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
        try {
            const allMovies = await Movie.find();
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
            const movie = await Movie.findById(req.params.id)

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