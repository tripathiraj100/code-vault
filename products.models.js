const mongoose = require("mongoose");
const productschema = new mongoose. Schema({
    name:{
        type:String,
        required : true
    },
    price: {
        type : Number,
        required : true
    },
    image : {
        type : String,
        required : true
    },
},{
    timestamps : true // createdat,updatedat
});

const Product = mongoose.model('Product',productschema); 
module.exports = Product;