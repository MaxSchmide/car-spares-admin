import mongoose, { Schema, model, models } from "mongoose"
import { ICategory } from "./category.model"
import { Category } from "./category.model"

const ProductSchema = new Schema({
	title: { type: String, required: true },
	brand: { type: String, required: true },
	description: String,
	application: String,
	article: { type: String, required: true },
	price: { type: Number, required: true },
	category: { type: mongoose.Types.ObjectId, ref: Category },
	images: [String],
	analogs: [{ type: String, required: true }],
	properties: { type: Object },
})

export const Product = models?.Product || model("Product", ProductSchema)

export interface IProduct {
	brand: string
	title: string
	description: string
	price: number
	category: ICategory
	images: string[]
	_id: string
	article: string
	__v: number
	analogs: string[]
	application: string
	properties: Object
	[key: string]: any
}
