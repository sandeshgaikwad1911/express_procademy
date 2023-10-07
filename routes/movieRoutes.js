import express from "express";
const router = express.Router();
import {movieController} from '../controllers/movieController.js'

router.route('/')
    .post(movieController.createMovie)
    .get(movieController.allMovies)

export default router;