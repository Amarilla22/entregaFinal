import mongoose, { mongo } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
/*
const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {type: String, unique: true, required: true}
})

const userModel = mongoose.model(userCollection,userSchema)

export default userModel
*/
const productCollection = "products"


const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },       
  description: { type: String, required: true }, 
  price: { type: Number, required: true },        
  category: { type: String, required: true },     
  stock: { type: Number, required: true },        
  status: { type: Boolean, default: true }, 
});


ProductSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection,ProductSchema)

export default productModel