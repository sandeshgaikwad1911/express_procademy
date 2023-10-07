import { PORT } from "./config/config.js";
import { connectDB } from "./config/db_connection.js";
import movieRoutes from './routes/movieRoutes.js'

import express from "express";
const app = express();

app.use(express.json());

app.use('/api/v1', movieRoutes);


const port = PORT || 4001;

app.listen(4000, ()=>{
    connectDB(); 
    console.log(`app is running on http://localhost:${port}`);
});