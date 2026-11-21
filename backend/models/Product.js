import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    sku: {
        type: String,
        required: false,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    }

}, { timestamps: true });

export const Product = mongoose.model('Product', ProductSchema);
