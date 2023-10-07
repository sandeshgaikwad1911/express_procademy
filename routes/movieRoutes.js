import express from "express";
const router = express.Router();
import {movieController} from '../controllers/movieController.js'

router.route('/')
    .post(movieController.createMovie)
    .get(movieController.getAllMovies)

router.route('/:id')
    .get(movieController.getMovie)
    .patch(movieController.updateMovie)
    .delete(movieController.deleteMovie)

export default router;