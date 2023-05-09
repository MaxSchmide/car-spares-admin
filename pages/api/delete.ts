import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { NextApiRequest, NextApiResponse } from "next"

const bucketName = "car-spares"

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { id } = req.query
		const doc = (id as string).split("/").pop()
		const client = new S3Client({
			region: "eu-north-1",
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY!,
				secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
			},
		})
		const command = new DeleteObjectCommand({
			Bucket: bucketName,
			Key: doc,
		})

		await client.send(command)

		return res.status(200).json({ message: "Deleted" })
	} catch (e) {
		console.error(e)
		res.status(500).json({ message: "Internal server error" })
	}
}
