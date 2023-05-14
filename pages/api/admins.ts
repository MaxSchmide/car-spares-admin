import { mongooseConnect } from "@/lib/mongoose"
import { NextApiRequest, NextApiResponse } from "next"
import { isAdminRequest } from "./auth/[...nextauth]"
import { Admin } from "@/models/admin.model"

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		await mongooseConnect()
		await isAdminRequest(req, res)

		const {
			method,
			query,
			body: { email, role },
		} = req

		switch (method) {
			case "GET":
				res.json(await Admin.find())
				break
			case "POST":
				const adminDoc = await Admin.create({
					email,
					role,
				})
				res.json(adminDoc)
				break
			case "DELETE":
				const { _id } = query
				await Admin.deleteOne({ _id })
				res.json(true)
				break
			default:
				res.status(400).json({ message: "Invalid request" })
		}
	} catch (error) {
		res.status(500).json({ message: "Internal server error" })
	}
}
