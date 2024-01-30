class ApiFeatures{

    constructor(query, queryStr){
        this.query = query;       // Movie.find() = query
        this.queryStr = queryStr        // req.query = queryStr
    }

    filter(){
        let queryString = JSON.stringify(this.queryStr)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
        const queryObj = JSON.parse(queryString)

       this.query =  this.query.find(queryObj);

       return this;
    // here this pointing to the current instance
    // using Apifeatures class we can create multiple objects
    // why we need to return this here, because we create another methods
    // and we want to  chain that methods so that we can use .filter().sort().page() etc..

    };

    sort(){
        if(this.queryStr.sort){
           const sortBy = this.queryStr.sort.split(",").join(" ")
           this.query = this.query.sort(sortBy)
       }
       else{
           this.query = this.query.sort("-releaseYear");   // default sorting is based on releaseYear
       }

       return this;

    };

    limitFields(){
        if(this.queryStr.fields){    
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else{
            this.query = this.query.select("-__v");               // exclude __v field.
            // query = query.select("-__v, -_id");      // exclude __v,_id field.
        }
        return this;
    };

    paginate(){
        const page = this.queryStr.page*1 || 1;
        const limit = this.queryStr.limit*1 || 10;
    
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        // http://localhost:4000/api/v1/movies?limit=2

        // http://localhost:4000/api/v1/movies?page=1&limit=3
        // here we have total 8 records only.. so limit we take is 3 only

        // if(this.queryStr.page){
        //     const totalDocuments = await Movie.countDocuments();
        //     if(skip >= totalDocuments){
        //         throw new Error("This page is not found!");
        //     }
        // }

        return this;
    };


}

export default ApiFeatures

/*
        this.query and this.queryStr are properties of Apifeatures class and can be accessible anywhere inside this class
        query and queryStr can be used inside constructor only.

*/