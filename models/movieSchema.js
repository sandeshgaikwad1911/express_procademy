import mongoose, { Schema } from "mongoose";
import fs from 'fs';

import validator from "validator";

const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name is required!'],
        unique: true,
        trim: true,  // extra white-space is removed before and after string
        // select: false   // this property will not be shown
        minlength: [3, 'movie name must be atleast 3 character'],
        maxlenght: [100, 'movie name must not have more than 100 characters'],

        // validator libray
        // validate: [validator.isAlpha, "Name should contain alphabate only."] //  isAlpha => space between world not allowed
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
        type: Number,
        // min: 1,      // built-in validation
        // max: 10      // built-in validation

        //  custom validation
        validate: {
            validator : function(value){
                // return this.ratings >= 1 && value <= 10;     // will work with creating document only not with updating document
                return value >= 1 && value <= 10;               // work with creating as well updating document.
            },
            message: "rating must be above 0 and below 11"
            // message:  props => `${props.value} is out of range`
        }
        // validate is from mongoose, validator is library we installed
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
        required: [true, "genres is required field!"],
        enum: {
            values: ["Action", "Adventure", "Thriller", "Sci-Fi", "Crime", "Drama", "Comedy", "Romance", "Biography"],
            message: "This genre does not exist."
        }
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
    },

    // pre() hook
    createdBy: {
        type: String
    }
},
    {
        toJSON: {virtuals: true},   // This makes the `virtual` fields available when we convert a document to JSON.
        toObject: {virtuals: true}   
    },
    {timestamps: true})

// -------------------------------------------------------------------------------------------------------------

movieSchema.virtual("durationInHours").get(function(){
    return this.duration / 60;
})

// ------------------------------------------------------------------------------------------------------------

movieSchema.pre("save", function(next){
    // console.log('pre', this)        // this means document currently is in process.
    this.createdBy = "Sandesh Gaikwad"  // createdBy must be present on mongoose modalSchema
    next();
})
// save event will happen only when we call .save() or .create() method of mongoose
// save event will not happen when we call insertOne() or findByIdAndUpdate() etc... 

// ------------------------------------------------------------------------------------------------------------

movieSchema.post("save", function(doc, next){
    // post hook callback function dosen't have access to this keyowrd, isntead it has doc means currently saved document
    const content = `"${doc.name}" has been created by "${doc.createdBy}" \n`
    fs.writeFileSync("./Log/log.txt", content, {flag: 'a'}, (err)=>{
        console.log('post hook error', err.message)
    })
    // {flag: 'a'}  => means append new document to existing document
    next();
})

// ------------------------------------------------------------------------------------------------------------

    // Query middleware.

/* movieSchema.pre("find", function(next){
    // this return current query object on find method. we can chain another query method provided by mongoose
    this.find({releaseYear: {$lte: new Date().getFullYear()}})
    next();
})
movieSchema.pre("findOne", function(next){
    // this return current query object on find method. we can chain another query method provided by mongoose
    this.find({releaseYear: {$lte: new Date().getFullYear()}})
    next();
}) */

 /*
    here query middleware is work on find() and findOne() methods or 
    we can use regular expressin /^find/  ... so it works on all methods..that start with find
    findById behind the scene use findOne()  method
 */

movieSchema.pre(/^find/, function(next){
    // this return current query object on find method. we can chain another query method provided by mongoose
    this.find({releaseYear: {$lte: new Date().getFullYear()}})
    next();
}) 

// ------------------------------------------------------------------------------------------------------------
    // aggregate middleware

movieSchema.pre("aggregate", function(next){
    // console.log('aggregate this =>', this)
    this.pipeline().unshift({$match: {releaseYear: {$lte: new Date().getFullYear()}}})
    next();
})

// this.pipeline returns an array on that array we use unshif().. so add element at first  position of array

// ------------------------------------------------------------------------------------------------------------

export const Movie = mongoose.model('movies', movieSchema);


/* 
    mongoose Virtual Properties : are the field we define on our schema but that fields is not persisted
    means that field is not saved in database.

    we use virtual propertis by deriving it from existing field
    for eg. we store dob.. and from that dob .. we calculate age.. so age can be virtual property
    that can be derived from dob field.

    here, we have duration in minute and we have to convert it into  durationInHours and minutes.. so durationInHours will be a virtual property

    {toJSON: {virtuals: true}}  => each time with output it shows virtuals property.

    virtual property gets created each time when we get some data from database.
    .get() is basically getter property.

    virtual propery can't use inside query  => Movie.find({durationInHours: })
*/

/* 
    mongoose document middleware : just like express middleware we have mongoose document middleware,

    before document saved we can run some  logic       => pre()
                    or
    we can also run some logic after document is saved. => post()
*/

/* 
    Mongoose Query Middleware : allow us to run function or middleware before or after some qeuery executed.
    
    this keyword inside Query middleware points to the current query object iteselt... 
    unlike document middleware this keyword points to the current docuement.

    our requirement is as such.. we r going to store those movies also whose realeaseYear is more than current year but
    in result we shows only movies whose realeaseYear is current  year or less than current year.

*/

/* 
    Mongoose Aggregation Middleware : allow us to run function or middleware before or after aggregation happens.

    getMovieByGenres: () and getMovieByGenres: ()  methods we have same code like,
    {$match: {releaseYear: {$lte: new Date().getFullYear()}}},
    so we can make a common method out of them. that is aggregation middleware

    for eg.  we want to shows  all movie which are released in current year or less than current year.
*/

/* 
    built-in data validators :

    1. minlength and maxlength can be used on String only, we have match and enum on String also.
    2. for numbers we use min and max
    3. for Dates we can also use min and max
    4. enum: we can choose from list of array

*/