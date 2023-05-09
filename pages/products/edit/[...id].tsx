import Layout from "@/components/Layout"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import ProductForm from "@/components/ProductForm"
import { IProduct } from "@/models/product.model"
const EditProduct = () => {
	const [product, setProduct] = useState<IProduct | null>(null)
	const {
		query: { id },
	} = useRouter()

	useEffect(() => {
		if (!id) toast.error("Failed to load product")
		axios.get("/api/products?id=" + id).then((res) => setProduct(res.data))
	}, [id])
	return (
		<Layout>
			<h1 className="text-secondary mb-8 text-2xl">Edit Product</h1>
			{product && <ProductForm {...product} />}
		</Layout>
	)
}

export default EditProduct
