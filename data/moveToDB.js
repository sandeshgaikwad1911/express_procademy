import mongoose from 'mongoose';
import fs from 'fs';
import { Movie } from '../models/movieSchema.js';

// connect to db
mongoose.connect("mongodb+srv://sandeshgaikwad1911:IsDXjlztXmrcxtfQ@cluster0.zcwlkcz.mongodb.net/cineflex",{useNewUrlParser: true})
.then(()=>{
    console.log("connected successfully to db");
})
.catch((err)=>{
    console.log(err)
});

// read movies.json file
const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'));
// console.log('movies', movies)


// delete all previous data from db
const deleteMovies = async()=>{
    try {
        await Movie.deleteMany();
        console.log('delete movies successfully')
    } catch (error) {
        console.log("err while deleting", error)
    }
}
// deleteMovies();

// import movies from json file
const importData = async()=>{
    try {
        await Movie.create(movies);
        console.log('added movies successfully')
    } catch (error) {
        console.log("err while importing moveis", error)
    }
}

importData();

/* 
    to run file => cd data enter => node moveToDB.js
*/


/* 
    when we call both method same time.. all data is deleted but only few data is added. not all data
        it dosen't work with

        setTimeout(()=>{
            importData();
        },0)

        learn in deep .. how node.js event loop works.
 */




