import { Movie } from "../models/movieSchema.js";


export const movieController = {

    createMovie: async(req,res,next)=>{
        try {
            const movie = await Movie.create(req.body);
            res.status(201).json({
                status: "success",
                data:{
                    movie: movie,
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