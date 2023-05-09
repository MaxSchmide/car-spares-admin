import { Schema, model, models } from "mongoose"

const ProductSchema = new Schema({
	title: { type: String, required: true },
	description: String,
	price: { type: Number, required: true },
	categories: { type: [String], required: true },
	images: [String],
})

export const Product = models.Product || model("Product", ProductSchema)

export interface IProduct {
	title: string
	description: string
	price: number
	categories: string[]
	images: string[]
	_id: string
	__v: number
}
