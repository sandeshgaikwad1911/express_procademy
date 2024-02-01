import mongoose from "mongoose";
import fs from 'fs';

const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name is required!'],
        unique: true,
        trim: true,  // extra white-space is removed before and after string
        // select: false   // this property will not be shown
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
    console.log('pre', this)        // this means document currently is in process.
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
    next()
})

// ------------------------------------------------------------------------------------------------------------

export const Movie = mongoose.model('movies', movieSchema);


/* 
    Virtual Properties : are the field we define on our schema but that fields is not persisted
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
    document middleware : just like express middleware we have mongoose document middleware,

    before document saved we can run some  logic       => pre()
                    or
    we can also run some logic after document is saved. => post()
*/