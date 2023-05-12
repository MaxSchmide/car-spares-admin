import mongoose, { Schema, model, models } from "mongoose"
import { ICategory } from "./category.model"

const ProductSchema = new Schema({
	title: { type: String, required: true },
	description: String,
	price: { type: Number, required: true },
	categories: [{ type: mongoose.Types.ObjectId, ref: "Category" }],
	images: [String],
})

export const Product = models.Product || model("Product", ProductSchema)

export interface IProduct {
	title: string
	description: string
	price: number
	categories: ICategory[]
	images: string[]
	_id: string
	__v: number
}
