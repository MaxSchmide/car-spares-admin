import { mongooseConnect } from "@/lib/mongoose"
import { Category } from "@/models/category.model"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		// await mongooseConnect()
		const {
			method,
			body: { label, value, selectedCategory },
		} = req
		switch (method) {
			case "GET":
				if (req.query.id) {
					res.json(await Category.findOne({ _id: req.query.id }))
				} else {
					res.json(await Category.find())
				}
				break
			case "POST":
				// const categoryDoc = await Category.create({
				// 	label,
				// 	value,
				// 	parent: selectedCategory,
				// })
				// res.json(categoryDoc)
				res.json("ok")
				break
			default:
				res.status(404).json({ message: "Invalid request" })
		}
	} catch (error) {
		res.status(500).json({ message: "Internal server error" })
	}
}
