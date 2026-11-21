import { Product } from "../models/Product.js";

export const createProduct = async(req,res) => {
    try{
        const newProduct = await Product.create(req.body);
        res.status(201).json({success: true, data:newProduct});
    }
    catch(error) {
        res.status(400).json({success:false, message: error.message})
    }
}

export const getProducts = async(req,res) => {
    try{
        const products = await Product.find();
        res.status(200).json({success: true, data:products});
    } 
    catch(error) {
        res.status(500).json({success:false, message:error.message});
    }
}

export const getSingleProduct = async(req,res) => {
    try{
        const singleProduct = await Product.findById(req.params.id);

        if(!singleProduct) {
            res.status(404).json({success:false, message:'Product not Found'})
        }
        res.status(200).json({success:true, data: singleProduct});
    }
    catch(error) {
        res.status(500).json({success:false, message:error.message});
    }
}

export const deleteProduct = async(req,res) => {
    try{
        const deletedProduct = await Product.findByIdAndDelete(req.params.id); 
        if(!deletedProduct) {
            res.status(404).json({success:false, message: 'Product not Found'})
        }
        res.status(200).json({success:true, message: 'Product deleted Successfully'})
    }
    catch(error) {
        res.status(500).json({success:false, message:error.message})
    }
}