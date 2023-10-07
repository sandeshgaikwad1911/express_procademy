import mongoose from "mongoose";
const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    description: String,
    duration: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 1.0
    }
},{timestamps: true})

export const Movie = mongoose.model('movies', movieSchema);