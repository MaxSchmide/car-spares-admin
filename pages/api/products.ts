import { mongooseConnect } from "@/lib/mongoose"
import { Product } from "@/models/product.model"
import type { NextApiRequest, NextApiResponse } from "next"
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
			body: { title, description, price, _id, categories, images },
		} = req
		switch (method) {
			case "GET":
				if (req.query?.id) {
					res.json(
						await Product.findOne({ _id: req.query.id }).populate("categories")
					)
				} else {
					res.json(await Product.find().populate("categories"))
				}
				break
			case "POST":
				const productDoc = await Product.create({
					title,
					description,
					price,
					images,
					categories,
				})
				res.json(productDoc)
				break
			case "PUT":
				await Product.updateOne(
					{ _id },
					{ title, description, price, images, categories }
				)
				res.json(true)
				break
			case "DELETE":
				if (req.query?.id) {
					await Product.deleteOne({ _id: req.query.id })
					res.json(true)
				}
				break
			default:
				res.status(400).json({ message: "Invalid request" })
		}
	} catch (e) {
		console.error(e)
		res.status(500).json({ message: "Internal server error" })
	}
}
