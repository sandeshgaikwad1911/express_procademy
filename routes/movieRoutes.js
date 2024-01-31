import express from "express";
const router = express.Router();
import {movieController} from '../controllers/movieController.js'

router.route('/highest-rated').get(movieController.getHighestRated, movieController.getAllMovies)

router.route('/movies-stats').get(movieController.getMovieStats)

router.route('/movies-by-genres/:genre').get(movieController.getMovieByGenres)

router.route('/')
    .post(movieController.createMovie)
    .get(movieController.getAllMovies)

router.route('/:id')
    .get(movieController.getMovie)
    .patch(movieController.updateMovie)
    .delete(movieController.deleteMovie)

export default router;