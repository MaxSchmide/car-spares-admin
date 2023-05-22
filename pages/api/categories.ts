import { mongooseConnect } from "@/lib/mongoose"
import { Category } from "@/models/category.model"
import { ObjectId } from "mongodb"
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
			body: { label, parent, _id, properties },
			query,
		} = req
		switch (method) {
			case "GET":
				res.json(await Category.find().populate("parent"))
				break
			case "POST":
				const categoryDoc = await Category.create({
					label,
					parent,
					properties,
				})
				res.json(categoryDoc)
				break
			case "PUT":
				await Category.updateOne(
					{ _id },
					parent
						? {
								label,
								parent,
								properties,
						  }
						: { label, properties, $unset: { parent: "" } }
				)
				res.json(true)
				break
			case "DELETE":
				const allChildCategories = await findChildCategories(
					query._id as string
				)
				await Category.deleteMany({ _id: { $in: allChildCategories } })
				res.status(200).json(true)
				break
			default:
				res.status(400).json({ message: "Invalid request" })
		}
	} catch (error) {
		res.status(500).json({ message: "Internal server error" })
	}
}

const findChildCategories = async (id: string) => {
	const listOfCategories: string[] = [id]

	const categories = await Category.find({
		parent: new ObjectId(id),
	})

	for (const category of categories) {
		const children = await findChildCategories(category._id.valueOf())
		listOfCategories.push(...children)
	}

	return listOfCategories
}
