import { mongooseConnect } from "@/lib/mongoose"
import { Category } from "@/models/category.model"
import { NextApiRequest, NextApiResponse } from "next"
import { isAdminRequest } from "./auth/[...nextauth]"

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		await mongooseConnect()
		await isAdminRequest(req, res)

		const {
			method,
			body: { label, parent, _id },
		} = req
		switch (method) {
			case "GET":
				res.json(await Category.find().populate("parent"))
				break
			case "POST":
				const categoryDoc = await Category.create({
					label,
					parent,
				})
				res.json(categoryDoc)
				break
			case "PUT":
				await Category.updateOne(
					{ _id },
					{
						label,
						parent,
					}
				)
				res.json(true)
				break
			case "DELETE":
				if (req.query?.id) {
					await Category.deleteOne({ _id: req.query.id })
					res.status(200).json(true)
				}
				break
			default:
				res.status(400).json({ message: "Invalid request" })
		}
	} catch (error) {
		res.status(500).json({ message: "Internal server error" })
	}
}
