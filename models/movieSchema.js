import mongoose from "mongoose";
const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name is required!'],
        unique: true,
        trim: true  // extra white-space is removed before and after string
    },
    description: {
        type: String,
        required: [true, 'description is required!'],
        trim: true  // extra white-space is removed before and after string
    },
    duration: {
        type: String,
        required: true
    },
    ratings: {
        type: Number
    },
    totalRating:{
        type: Number
    },
    releaseYear:{
        type: Number,
        required: [true, "release year is required field!"]
    },
    releaseDate: {
        type: Date
    },
    genres:{
        type: [String],     // string array
        required: [true, "genres is required field!"]
    },
    directors:{
        type: [String],     
        required: [true, "directors is required field!"]
    },
    actors:{
        type: [String],     
        required: [true, "actors is required field!"]
    },
    coverImage:{
        type: [String],    
        required: [true, "cover image is required field!"]
    },
    price: {
        type: Number,
        required: [true, 'price is required field!']
    }
},{timestamps: true})

export const Movie = mongoose.model('movies', movieSchema);