import express from "express";
const router = express.Router();
import {movieController} from '../controllers/movieController.js'

router.route('/')
    .post(movieController.createMovie)

export default router;