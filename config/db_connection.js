import mongoose from "mongoose";
import { Mongo_Url } from "./config.js";

export const connectDB = async()=>{
    try {
        await mongoose.connect(Mongo_Url,{
            useNewUrlParser: true
        });
        console.log('database connected successfully.')
    } catch (error) {
        console.log(error);
    }
}
