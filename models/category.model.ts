import mongoose, { Schema, model, models } from "mongoose"

const CategorySchema = new Schema({
	label: { type: String, required: true },
	parent: { type: mongoose.Types.ObjectId, ref: "Category" },
	properties: [{ type: Object }],
})

export const Category = models?.Category || model("Category", CategorySchema)

export interface ICategory {
	label: string
	_id: string
	__v: number
	parent?: Omit<ICategory, "parent">
	properties?: IProperty[]
	[key: string]: any
}

export type IProperty = {
	name: string
	values: string[]
}
