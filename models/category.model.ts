import mongoose, { Schema, model, models } from "mongoose"

const CategorySchema = new Schema({
	label: { type: String, required: true },
	parent: { type: mongoose.Types.ObjectId, ref: "Category" },
})

export const Category = models?.Category || model("Category", CategorySchema)

export interface ICategory {
	label: string
	_id: string
	__v: number
	parent?: Omit<ICategory, "parent">
	[key: string]: any
}
