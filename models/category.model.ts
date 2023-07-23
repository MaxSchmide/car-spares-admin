import mongoose, { Schema, model, models } from "mongoose"

const CategorySchema = new Schema({
	label: { type: String, required: true },
	parent: { type: mongoose.Types.ObjectId, ref: "Category" },
	properties: [{ type: Object }],
	image: { type: Object },
})

export const Category = models?.Category || model("Category", CategorySchema)

export interface ICategory {
	label: string
	_id: string
	__v: number
	parent?: Omit<ICategory, "parent">
	properties?: IProperty[]
	image: Omit<ICategoryImage, "id">
	[key: string]: any
}

export type IProperty = {
	name: string
	values: string[]
}

export type ICategoryImage = {
	id: string
	name: string
	src: string
}
