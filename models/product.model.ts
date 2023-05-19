import mongoose, { Schema, model, models } from "mongoose"
import { ICategory } from "./category.model"
import { Category } from "./category.model"

const ProductSchema = new Schema({
	title: { type: String, required: true },
	description: String,
	article: { type: String, required: true },
	price: { type: Number, required: true },
	categories: [{ type: mongoose.Types.ObjectId, ref: Category }],
	images: [String],
	analogs: [{ type: String, required: true }],
})

export const Product = models?.Product || model("Product", ProductSchema)

export interface IProduct {
	title: string
	description: string
	price: number
	categories: ICategory[]
	images: string[]
	_id: string
	article: string
	__v: number
	analogs: string[]
	[key: string]: any
}
