import { PORT } from "./config/config.js";
import { connectDB } from "./config/db_connection.js";
import movieRoutes from './routes/movieRoutes.js'

import express from "express";
const app = express();

app.use(express.json());

app.use('/api/v1/movies', movieRoutes);

const port = PORT || 4001;

app.listen(port, ()=>{
    connectDB(); 
    console.log(`app is running on http://localhost:${port}`);
});