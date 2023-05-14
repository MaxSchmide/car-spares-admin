import { Schema, model, models } from "mongoose"

const AdminSchema = new Schema({
	email: { type: String, required: true },
	role: { type: String, required: true },
})

export const Admin = models.Admin || model("Admin", AdminSchema)

export interface IAdmin {
	_id: string
	__v: number
	email: string
	role: string
}
