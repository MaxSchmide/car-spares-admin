import { NextApiRequest, NextApiResponse } from "next"
import multiparty from "multiparty"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import fs from "fs"
import mime from "mime-types"
import { mongooseConnect } from "@/lib/mongoose"
import { isAdminRequest } from "./auth/[...nextauth]"

const bucketName = "car-spares"

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		await mongooseConnect()
		await isAdminRequest(req, res)

		const form = new multiparty.Form()
		const { files } = await new Promise<any>((resolve, reject) => {
			form.parse(req, (err, fields, files) => {
				if (err) reject(err)
				resolve({ fields, files })
			})
		})
		const client = new S3Client({
			region: "eu-north-1",
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY!,
				secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
			},
		})

		const links = []

		for (const file of files.file) {
			const ext = file.originalFilename.trim().split(".").pop()
			const newFilename = Date.now() + "." + ext

			await client.send(
				new PutObjectCommand({
					Bucket: bucketName,
					Key: newFilename,
					Body: fs.readFileSync(file.path),
					ACL: "public-read",
					ContentType: mime.lookup(file.path) || undefined,
				})
			)

			const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`
			links.push(link)
		}
		return res.json({ links })
	} catch (e) {
		res.status(500).json({ message: "Internal server error" })
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
}
