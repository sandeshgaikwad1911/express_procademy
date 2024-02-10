import express from "express";
const router = express.Router();
import {movieController} from '../controllers/movieController.js'
import { authController } from "../controllers/authController.js";

router.route('/highest-rated').get(movieController.getHighestRated, movieController.getAllMovies)

router.route('/movies-stats').get(movieController.getMovieStats)

router.route('/movies-by-genres/:genre').get(movieController.getMovieByGenres)

router.route('/')
    .get(authController.protectedtRoute, movieController.getAllMovies)
    .post(movieController.createMovie)

router.route('/:id')
    .get(authController.protectedtRoute, movieController.getMovie)
    .patch(authController.protectedtRoute, authController.restrict('admin'), movieController.updateMovie)
    .delete(authController.protectedtRoute, authController.restrict('admin'), movieController.deleteMovie)
    // .delete(authController.protectedtRoute, authController.restrict('admin', 'admin1'), movieController.deleteMovie)
export default router;