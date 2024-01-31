// import { Movie } from "../models/movieSchema.js";


// export const movieController = {

//     createMovie: async(req,res,next)=>{
//         try {
//             const movie = await Movie.create(req.body);
//             return res.status(201).json({
//                 status: "success",
//                 data:{
//                     movie: movie
//                 }
//             })
//         } catch (error) {
//             return res.status(400).json({
//                 status: "fail",
//                 message: error.message
//             })
//         }
//     },

// // ----------------------------------------------------------------------------------------------
    
//     getMovie: async(req,res,next)=>{
//         try {
//             // const movie = await Movie.findOne({_id: req.params.id})
//             const movie = await Movie.findById(req.params.id);
//             if(!movie){
//                 return res.status(400).json({
//                     status: "fail",
//                     message: "This movie is not available"
//                 })
//             }
            
//             return res.status(200).json({
//                 status: "success",
//                 data:{
//                     movie: movie
//                 }
//             })
//         } catch (error) {
//             res.status(400).json({
//                 status: "fail",
//                 message: error.message
//             })
//         }
//     },

// // ----------------------------------------------------------------------------------------------

//     updateMovie: async(req,res,next)=>{
        
//         try {
//             const updateMovie = await Movie.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
//             if(!updateMovie){
//                 return res.status(400).json({
//                     status: "fail",
//                     message: "This movie is not available"
//                 })
//             }
//             return res.status(200).json({
//                 status: "success",
//                 data:{
//                     movie: updateMovie
//                 }
//             })
//         } catch (error) {
//             res.status(400).json({
//                 status: "fail",
//                 message: error.message
//             })
//         }
//     },

//     /* 
//         [1].    {new: true}  ... returns updated document.
//         [2].    {runValidators: true} .... while updating documents.. validators defined in model is not work by default
//                     so we have to use {runValidators: true}
//     */

// // ----------------------------------------------------------------------------------------------

//     deleteMovie: async(req,res,next)=>{
//         try {
//             const movie = await Movie.findByIdAndDelete({_id: req.params.id})
//             if(!movie){
//                 return res.status(400).json({
//                     status: "fail",
//                     message: 'movie not found'
//                 })
//             }
            
//             return res.status(200).json({
//                 status: "success",
//                 data: null
//             })
//         } catch (error) {
//             res.status(400).json({
//                 status: "fail",
//                 message: error.message
//             })
//         }
//     },

// // ----------------------------------------------------------------------------------------------

//     /* getAllMovies: async(req, res, next)=>{
//         try {
//             const allMovies = await Movie.find({});
//             return res.status(200).json({
//                 status: "success",
//                 length: allMovies?.length,
//                 data:{
//                     allMovies: allMovies
//                 }
//             })
//         } catch (error) {
//             res.status(404).json({
//                 status: "fail",
//                 message: error.message
//             })
//         }

//     }, */

//     // http://localhost:4000/api/v1/movies
    
// // ----------------------------------------------------------------------------------------------

//     //  excluding fields from url which are not present on Modal

//     /* getAllMovies: async(req, res, next)=>{
//         try {

//             let query = req.query;
//             console.log("query",query)

//             let queryObj = {...req.query}
//             console.log("queryObj",queryObj)

//             const excludeField = ["sort", "page", "limit"]
//             excludeField.forEach((el)=>{
//                 delete queryObj[el]
//             })

//             console.log("queryObj after exclude fields", queryObj);

//             // const allMovies = await Movie.find(query);
//             const allMovies = await Movie.find(queryObj);

//             return res.status(200).json({
//                 status: "success",
//                 length: allMovies?.length,
//                 data:{
//                     allMovies: allMovies
//                 }
//             })
//         } catch (error) {
//             res.status(404).json({
//                 status: "fail",
//                 message: error.message
//             })
//         }

//     }, */

//     /* 
//         on req obj we have property called query ( req.query ) 
//         which is basically object which stores query string as key value pair

//         http://localhost:4000/api/v1/movies?duration=109&releaseYear=2013
//         let query = req.query;
//         console.log("query",query)
//         query { duration: '109', releaseYear: '2013' }

//         as we see all the values are string types.. so when we want to use those
//         values we need to convert them into proper data types.
//         for eg.   Movie.find({duration: +req.query.duration});});        
//         //  + sign before req.query.duration... indicates convert string into number

//         we can achieve same result using mongoose special methods, 
//         const allMovies = await Movie.find()
//                 .where("duration").equals(req.query.duration)
//                 .where("releaseYear").equals(req.query.releaseYear);
//         but it dosen't work when there is no specifid query in url... here we r not using this in proper way..

//         const allMovies = await Movie.find(query);
//             if we dont specify anything in url query.. it return all the documents
//             but it's not going to work in all the scenario like sort, page because these are not the properties of Movie Modal
//             http://localhost:4000/api/v1/movies?sort=1&page=10?duration=117     
//                 we have no such property like sort or page or limit on Movie Modal
//                 so we will have to exclude such options, we are not exclude it from url.. we make shallow copy req.query obj

//                 const queryObj = req.query      // reference to same object
//                 const queryObj = {...req.query}  // it creates shallow copy

//                 we perform operation on shallow copy obj not on actual query obj
            
//                 let queryObj = {...req.query}
//                 console.log("queryObj",queryObj)

//                 const excludeField = ["sort", "page", "limit"]
//                 excludeField.forEach((el)=>{
//                     delete queryObj[el]
//                 })

//                 console.log("queryObj after exclude fields", queryObj);

//                 // const allMovies = await Movie.find(query);
//                 const allMovies = await Movie.find(queryObj);

//     */
 

// // ----------------------------------------------------------------------------------------------

// // advance filtering on query

// // getAllMovies: async(req, res, next)=>{
// //     try {

// //         // const allMovies = await Movie.find({duration: {$gte: 150}, price: {$lte: 60}});

// //         // http://localhost:4000/api/v1/movies?duration=117&price=90
// //         //  const allMovies = await Movie.find({})
// //         //     .where("duration").gte(req.query.duration)
// //         //     .where("price").lte(req.query.price);


// //         // http://localhost:4000/api/v1/movies?duration[gte]=150&price[lte]=60
// //         // [gte] auto converted to {gte} 
// //         let query = req.query;
// //         // console.log('query', query)         //  { duration: { gte: '150' }, price: { lte: '60' } }         

// //         let queryString = JSON.stringify(query)
// //         // console.log('queryString', queryString)         //  {"duration":{"gte":"150"},"price":{"lte":"60"}}

// //         queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
// //         // console.log('modified query string', queryString)       //  {"duration":{"$gte":"150"},"price":{"$lte":"60"}}

// //         const queryObj = JSON.parse(queryString)
// //         // console.log('queryObj', queryObj);          //  { duration: { '$gte': '150' }, price: { '$lte': '60' } }

// //         const allMovies = await Movie.find(queryObj);
     
// //         return res.status(200).json({
// //             status: "success",
// //             length: allMovies?.length,
// //             data:{
// //                 allMovies: allMovies
// //             }
// //         })
// //     } catch (error) {
// //         res.status(404).json({
// //             status: "fail",
// //             message: error.message
// //         })
// //     }

// // },

// /* 
//     const allMovies = await Movie.find({duration: {$gte: 150}, price: {$lte: 60}});

//     http://localhost:4000/api/v1/movies?duration[gte]=150&price[lte]=60
//         let query = req.query;
//         console.log('query', query)
//         query { duration: { gte: '150' }, price: { gte: '60' } }
//     we need to add $ sign before gte... to achieve desired result
//     1.  first we need to convert query obj into string to use regular expression
//             let queryString = JSON.stringify(query)
//     2.  queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
//             \b .. \b   that means excatmatch,
//             (match)=>   here match receives (gte|gt|lte|lt)   and we add $ sign before them
//     3. then convert queryString into JsonObj using JSON.parse(quetyString)

//     **we can also achieve same functionality using mongoose special method
//         http://localhost:4000/api/v1/movies?duration=150&price=60
//         const allMovies = await Movie.find({})
//             .where("duration").gte(150)
//             .where("price").lte(60);

// */

// // ----------------------------------------------------------------------------------------------

// getHighestRated: async(req,res,next)=>{
//     // manipulate req obj and add limit and sort property.
//     req.query.limit = "5"           
//     req.query.sort = "-ratings"
//     next()
// },
// // we are pre-filling query strings with some values in request
// // without specifing query string in the url.

// // http://localhost:4000/api/v1/movies/highest-rated

// // ----------------------------------------------------------------------------------------------

// getAllMovies: async(req, res, next)=>{
//     try {

//         let queryString = JSON.stringify(req.query)
//         queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
//         const queryObj = JSON.parse(queryString)

//         let query =  Movie.find(queryObj);
//               // here sort() method is mongoose sort method, 
//              // and can be used on query object only, thats why removed await keyword from Movie.find()
//             // otherwise it return array

// // -----------------------------------------------------------------------------------------------------------------

//         // sorting logic
    
//         if(req.query.sort){

//              // if want to sortBy single field then url will be
//             // http://localhost:4000/api/v1/movies?sort=price           // ascending order
//            // http://localhost:4000/api/v1/movies?sort=-price          // descending order
//           // query = query.sort(req.query.sort)

//             // if want to sortBy more than 1 field then url will be http://localhost:4000/api/v1/movies?sort=-price,ratings
//             // also working with single field
//             // first it sort result by price, then sorted result again sort by ratings
//             const sortBy = req.query.sort.split(",").join(" ")
//             // query = query.sort("price ratings")      // this is how mongoose sort with multiple fields
//             // console.log('sortBy', sortBy)
//             query = query.sort(sortBy)
//         }
//         else{
//             query = query.sort("-releaseYear");   // default sorting is based on releaseYear
//         }

// // -----------------------------------------------------------------------------------------------------------------

//         // specific fields only

//         // for client it is always ideal to receive as little data as possibe
//         // in order to reduce bandwidth that is consumed with each request
//         // it is also true when we have really heavy data set
        
//         if(req.query.fields){
//             // query = query.select("name price duration")          // we want this for mongoose
//             // http://localhost:4000/api/v1/movies?fields=name,price,duration   // we have this in url.   // display specified fields only
//             // http://localhost:4000/api/v1/movies?fields=-price,-duration              // exclude specified fields show all other fields
//             // we can't use mixture of both fields
//             const fields = req.query.fields.split(',').join(' ');
//             // console.log('fields', fields);
//             query = query.select(fields);
//         }
//         else{
//             query = query.select("-__v");               // exclude __v field.
//             // query = query.select("-__v, -_id");      // exclude __v,_id field.
//         }

// // -----------------------------------------------------------------------------------------------------------------

//         // pagination

//         const page = req.query.page*1 || 1;
//         const limit = req.query.limit*1 || 10;
//         // on req.query object we get string value but we have to convert it into number so req.query.page*1
//         // on page1 we display 1-10 items means skipping 0 items,
//         // on page 2 we display 11-20 items means skipping 10 itmes
//         // on page 3 we display 21-30 items means skipping 20 itmes
//         // so we have to calculate how many records we have to skip based on page number and limit.
//         const skip = (page - 1) * limit;
//         query = query.skip(skip).limit(limit);

//         // http://localhost:4000/api/v1/movies?limit=2

//         // http://localhost:4000/api/v1/movies?page=1&limit=3
//         // here we have total 8 records only.. so limit we take is 3 only

//         if(req.query.page){
//             const totalDocuments = await Movie.countDocuments();
//             if(skip >= totalDocuments){
//                 throw new Error("This page is not found!");
//             }
//         }
// // -----------------------------------------------------------------------------------------------------------------

//         // top 5 highest rated movies
//         // http://localhost:4000/api/v1/movies?sort=-ratings&limit=5

// // -----------------------------------------------------------------------------------------------------------------

//        const allMovies = await query;
     
//         return res.status(200).json({
//             status: "success",
//             length: allMovies?.length,
//             data:{
//                 allMovies: allMovies
//             }
//         })
//     } catch (error) {
//         res.status(404).json({
//             status: "fail",
//             message: error.message
//         })
//     }

// },


// }


// // *************************************************************************************************************************************



import { Movie } from "../models/movieSchema.js";
import ApiFeatures from "../utils/ApiFeatures.js";

export const movieController = {

    createMovie: async(req,res,next)=>{
        try {
            const movie = await Movie.create(req.body);
            return res.status(201).json({
                status: "success",
                data:{
                    movie: movie
                }
            })
        } catch (error) {
            return res.status(400).json({
                status: "fail",
                message: error.message
            })
        }
    },

// ----------------------------------------------------------------------------------------------
    
    getMovie: async(req,res,next)=>{
        try {
            // const movie = await Movie.findOne({_id: req.params.id})
            const movie = await Movie.findById(req.params.id);
            if(!movie){
                return res.status(400).json({
                    status: "fail",
                    message: "This movie is not available"
                })
            }
            
            return res.status(200).json({
                status: "success",
                data:{
                    movie: movie
                }
            })
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            })
        }
    },

// ----------------------------------------------------------------------------------------------

    updateMovie: async(req,res,next)=>{
        
        try {
            const updateMovie = await Movie.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
            if(!updateMovie){
                return res.status(400).json({
                    status: "fail",
                    message: "This movie is not available"
                })
            }
            return res.status(200).json({
                status: "success",
                data:{
                    movie: updateMovie
                }
            })
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            })
        }
    },

    /* 
        [1].    {new: true}  ... returns updated document.
        [2].    {runValidators: true} .... while updating documents.. validators defined in model is not work by default
                    so we have to use {runValidators: true}
    */

// ----------------------------------------------------------------------------------------------

    deleteMovie: async(req,res,next)=>{
        try {
            const movie = await Movie.findByIdAndDelete({_id: req.params.id})
            if(!movie){
                return res.status(400).json({
                    status: "fail",
                    message: 'movie not found'
                })
            }
            
            return res.status(200).json({
                status: "success",
                data: null
            })
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            })
        }
    },

// ----------------------------------------------------------------------------------------------

    /* getAllMovies: async(req, res, next)=>{
        try {
            const allMovies = await Movie.find({});
            return res.status(200).json({
                status: "success",
                length: allMovies?.length,
                data:{
                    allMovies: allMovies
                }
            })
        } catch (error) {
            res.status(404).json({
                status: "fail",
                message: error.message
            })
        }

    }, */

    // http://localhost:4000/api/v1/movies
    
// ----------------------------------------------------------------------------------------------

    //  excluding fields from url which are not present on Modal

    /* getAllMovies: async(req, res, next)=>{
        try {

            let query = req.query;
            console.log("query",query)

            let queryObj = {...req.query}
            console.log("queryObj",queryObj)

            const excludeField = ["sort", "page", "limit"]
            excludeField.forEach((el)=>{
                delete queryObj[el]
            })

            console.log("queryObj after exclude fields", queryObj);

            // const allMovies = await Movie.find(query);
            const allMovies = await Movie.find(queryObj);

            return res.status(200).json({
                status: "success",
                length: allMovies?.length,
                data:{
                    allMovies: allMovies
                }
            })
        } catch (error) {
            res.status(404).json({
                status: "fail",
                message: error.message
            })
        }

    }, */

    /* 
        on req obj we have property called query ( req.query ) 
        which is basically object which stores query string as key value pair

        http://localhost:4000/api/v1/movies?duration=109&releaseYear=2013
        let query = req.query;
        console.log("query",query)
        query { duration: '109', releaseYear: '2013' }

        as we see all the values are string types.. so when we want to use those
        values we need to convert them into proper data types.
        for eg.   Movie.find({duration: +req.query.duration});});        
        //  + sign before req.query.duration... indicates convert string into number

        we can achieve same result using mongoose special methods, 
        const allMovies = await Movie.find()
                .where("duration").equals(req.query.duration)
                .where("releaseYear").equals(req.query.releaseYear);
        but it dosen't work when there is no specifid query in url... here we r not using this in proper way..

        const allMovies = await Movie.find(query);
            if we dont specify anything in url query.. it return all the documents
            but it's not going to work in all the scenario like sort, page because these are not the properties of Movie Modal
            http://localhost:4000/api/v1/movies?sort=1&page=10?duration=117     
                we have no such property like sort or page or limit on Movie Modal
                so we will have to exclude such options, we are not exclude it from url.. we make shallow copy req.query obj

                const queryObj = req.query      // reference to same object
                const queryObj = {...req.query}  // it creates shallow copy

                we perform operation on shallow copy obj not on actual query obj
            
                let queryObj = {...req.query}
                console.log("queryObj",queryObj)

                const excludeField = ["sort", "page", "limit"]
                excludeField.forEach((el)=>{
                    delete queryObj[el]
                })

                console.log("queryObj after exclude fields", queryObj);

                // const allMovies = await Movie.find(query);
                const allMovies = await Movie.find(queryObj);

    */
 

// ----------------------------------------------------------------------------------------------

// advance filtering on query

// getAllMovies: async(req, res, next)=>{
//     try {

//         // const allMovies = await Movie.find({duration: {$gte: 150}, price: {$lte: 60}});

//         // http://localhost:4000/api/v1/movies?duration=117&price=90
//         //  const allMovies = await Movie.find({})
//         //     .where("duration").gte(req.query.duration)
//         //     .where("price").lte(req.query.price);


//         // http://localhost:4000/api/v1/movies?duration[gte]=150&price[lte]=60
//         // [gte] auto converted to {gte} 
//         let query = req.query;
//         // console.log('query', query)         //  { duration: { gte: '150' }, price: { lte: '60' } }         

//         let queryString = JSON.stringify(query)
//         // console.log('queryString', queryString)         //  {"duration":{"gte":"150"},"price":{"lte":"60"}}

//         queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
//         // console.log('modified query string', queryString)       //  {"duration":{"$gte":"150"},"price":{"$lte":"60"}}

//         const queryObj = JSON.parse(queryString)
//         // console.log('queryObj', queryObj);          //  { duration: { '$gte': '150' }, price: { '$lte': '60' } }

//         const allMovies = await Movie.find(queryObj);
     
//         return res.status(200).json({
//             status: "success",
//             length: allMovies?.length,
//             data:{
//                 allMovies: allMovies
//             }
//         })
//     } catch (error) {
//         res.status(404).json({
//             status: "fail",
//             message: error.message
//         })
//     }

// },

/* 
    const allMovies = await Movie.find({duration: {$gte: 150}, price: {$lte: 60}});

    http://localhost:4000/api/v1/movies?duration[gte]=150&price[lte]=60
        let query = req.query;
        console.log('query', query)
        query { duration: { gte: '150' }, price: { gte: '60' } }
    we need to add $ sign before gte... to achieve desired result
    1.  first we need to convert query obj into string to use regular expression
            let queryString = JSON.stringify(query)
    2.  queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
            \b .. \b   that means excatmatch,
            (match)=>   here match receives (gte|gt|lte|lt)   and we add $ sign before them
    3. then convert queryString into JsonObj using JSON.parse(quetyString)

    **we can also achieve same functionality using mongoose special method
        http://localhost:4000/api/v1/movies?duration=150&price=60
        const allMovies = await Movie.find({})
            .where("duration").gte(150)
            .where("price").lte(60);

*/

// ----------------------------------------------------------------------------------------------

    getHighestRated: async(req,res,next)=>{
        // manipulate req obj and add limit and sort property.
        req.query.limit = "5"           
        req.query.sort = "-ratings"
        next()
    },
// we are pre-filling query strings with some values in request
// without specifing query string in the url.

// http://localhost:4000/api/v1/movies/highest-rated

// ----------------------------------------------------------------------------------------------
    // sorting, paginaation, limitingFields
    getAllMovies: async(req, res, next)=>{
        try {

            const features = new ApiFeatures(Movie.find(), req.query).filter().sort().limitFields().paginate()
            let allMovies = await features.query
            // let queryString = JSON.stringify(req.query)
            // queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
            // const queryObj = JSON.parse(queryString)

            // let query =  Movie.find(queryObj);
            //       // here sort() method is mongoose sort method, 
            //      // and can be used on query object only, thats why removed await keyword from Movie.find()
            //     // otherwise it return array

    // -----------------------------------------------------------------------------------------------------------------

            // sorting logic
        
            // if(req.query.sort){

            //      // if want to sortBy single field then url will be
            //     // http://localhost:4000/api/v1/movies?sort=price           // ascending order
            //    // http://localhost:4000/api/v1/movies?sort=-price          // descending order
            //   // query = query.sort(req.query.sort)

            //     // if want to sortBy more than 1 field then url will be http://localhost:4000/api/v1/movies?sort=-price,ratings
            //     // also working with single field
            //     // first it sort result by price, then sorted result again sort by ratings
            //     const sortBy = req.query.sort.split(",").join(" ")
            //     // query = query.sort("price ratings")      // this is how mongoose sort with multiple fields
            //     // console.log('sortBy', sortBy)
            //     query = query.sort(sortBy)
            // }
            // else{
            //     query = query.sort("-releaseYear");   // default sorting is based on releaseYear
            // }

    // -----------------------------------------------------------------------------------------------------------------

            // specific fields only

            // for client it is always ideal to receive as little data as possibe
            // in order to reduce bandwidth that is consumed with each request
            // it is also true when we have really heavy data set
            
            // if(req.query.fields){
            //     // query = query.select("name price duration")          // we want this for mongoose
            //     // http://localhost:4000/api/v1/movies?fields=name,price,duration   // we have this in url.   // display specified fields only
            //     // http://localhost:4000/api/v1/movies?fields=-price,-duration              // exclude specified fields show all other fields
            //     // we can't use mixture of both fields
            //     const fields = req.query.fields.split(',').join(' ');
            //     // console.log('fields', fields);
            //     query = query.select(fields);
            // }
            // else{
            //     query = query.select("-__v");               // exclude __v field.
            //     // query = query.select("-__v, -_id");      // exclude __v,_id field.
            // }

    // -----------------------------------------------------------------------------------------------------------------

            // pagination

            // const page = req.query.page*1 || 1;
            // const limit = req.query.limit*1 || 10;
            // // on req.query object we get string value but we have to convert it into number so req.query.page*1
            // // on page1 we display 1-10 items means skipping 0 items,
            // // on page 2 we display 11-20 items means skipping 10 itmes
            // // on page 3 we display 21-30 items means skipping 20 itmes
            // // so we have to calculate how many records we have to skip based on page number and limit.
            // const skip = (page - 1) * limit;
            // query = query.skip(skip).limit(limit);

            // // http://localhost:4000/api/v1/movies?limit=2

            // // http://localhost:4000/api/v1/movies?page=1&limit=3
            // // here we have total 8 records only.. so limit we take is 3 only

            // if(req.query.page){
            //     const totalDocuments = await Movie.countDocuments();
            //     if(skip >= totalDocuments){
            //         throw new Error("This page is not found!");
            //     }
            // }
    // -----------------------------------------------------------------------------------------------------------------

            // top 5 highest rated movies
            // http://localhost:4000/api/v1/movies?sort=-ratings&limit=5

    // -----------------------------------------------------------------------------------------------------------------

        //    const allMovies = await query;
        
            return res.status(200).json({
                status: "success",
                length: allMovies?.length,
                data:{
                    allMovies: allMovies
                }
            })
        } catch (error) {
            res.status(404).json({
                status: "fail",
                message: error.message
            })
        }

    },

// ----------------------------------------------------------------------------------------------

        // aggregation

    getMovieStats: async(req, res, next)=>{
        try {
            const stats = await Movie.aggregate([
                {$match: {ratings: {$gte: 4.5}}},
                {$group: {
                    // _id: null,       // if we don't include _id inside $group shows error => "a group specification must include an _id"
                    _id: "$releaseYear",    // whenever we specify field for _id... grouping is done based on that field
                    movieCount: {$sum: 1},
                    averageRating: {$avg : "$ratings"},
                    averagePrice: {$avg : "$price"},
                    minPrice: {$min: "$price"},
                    maxPrice: {$max: "$price"},
                    totalPrice: {$sum: "$price"},
                }},
                {$sort: {minPrice: 1}}      // minPrice is field we created at $group
            ])
            return res.status(200).json({
                status: "success",
                count: stats.length,
                data: {
                    stats: stats
                }
            })
        } catch (error) {
            res.status(404).json({
                status: "fail",
                message: error.message
            })
        }
    },

// ----------------------------------------------------------------------------------------------

    getMovieByGenres: async(req, res, next)=>{
        try {
            const genre = req.params.genre;
            const movies = await Movie.aggregate([
                {$unwind:  "$genres"},   
                // de-structure array into multiple document.
                // genres field is an array.
                {$group: {
                    _id: "$genres",
                    movieCount: {$sum: 1},
                    movies: {$push: "$name"},
                }},
                {$addFields: {genre: "$_id"}},
                {$project: {_id: 0}},
                {$sort: {movieCount: -1}},
                // {$limit: 6}
                {$match: {genre: genre}}
            ]);
            return res.status(200).json({
                status: "success",
                count: movies.length,
                data: {
                    movies: movies
                }
            })
        } catch (error) {
            return res.status(404).json({
                status: "fail",
                message: error.message
            })
        }
    },


}


// *************************************************************************************************************************************
