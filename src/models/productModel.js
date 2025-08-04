import mongoose  from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";



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