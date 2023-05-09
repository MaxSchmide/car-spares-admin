import { Schema, model, models } from "mongoose"

const CategorySchema = new Schema({
	label: { type: String, required: true },
	value: { type: String, required: true },
	parent: String,
})

export const Category = models.Category || model("Category", CategorySchema)

export interface ICategory {
	label: string
	value: string
	parent?: string
	_id: string
	__v: number
}
