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

    allMovies: async(req, res, next)=>{
        try {
            const allMovies = await Movie.find();
            return res.status(200).json({
                status: "success",
                data:{
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


    deleteMovie: ()=>{

    },

    udateMovie: ()=>{

    }
}