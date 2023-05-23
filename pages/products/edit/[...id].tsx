import Layout from "@/components/Layout"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import ProductForm from "@/components/ProductForm"
import { IProduct } from "@/models/product.model"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { getSession } from "next-auth/react"

const EditProduct = () => {
	const {
		push,
		locale,
		query: { id },
	} = useRouter()

	const [product, setProduct] = useState<IProduct | null>(null)

	useEffect(() => {
		if (!id) toast.error("Failed to load product")
		axios.get("/api/products?id=" + id).then((res) => setProduct(res.data))
	}, [id])

	return (
		<Layout>
			<h1 className="text-secondary mb-8 text-2xl flex gap-2 items-center">
				<ArrowLeftIcon
					className="w-6 h-6 text-secondary cursor-pointer"
					onClick={() => push("/products", "/products", { locale })}
				/>
				{locale === "en" ? "Edit Product" : "Изменить товар"}
			</h1>
			{product && <ProductForm {...product} />}
		</Layout>
	)
}

export default EditProduct

export const getServerSideProps = async (context: any) => {
	const { req, defaultLocale } = context
	const session = await getSession({ req })
	if (!session) {
		return {
			redirect: {
				destination: `${defaultLocale}/auth/signin`,
			},
		}
	}
	return {
		props: {},
	}
}
