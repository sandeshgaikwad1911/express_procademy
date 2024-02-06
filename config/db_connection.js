import mongoose from "mongoose";
import { Mongo_Url } from "./config.js";
export const connectDB = ()=>{
    mongoose.set('strictQuery', true)
    mongoose.connect(Mongo_Url,{
        useNewUrlParser: true,
        // useUnifiedTopology: true,
        
    })
    .then(()=>{console.log('database connected successfully.')})
    .catch((err)=>{console.log(err)})
    
}