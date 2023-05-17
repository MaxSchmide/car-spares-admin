import Layout from "@/components/Layout"
import ProductForm from "@/components/ProductForm"
import { useRouter } from "next/router"

const NewProduct = () => {
	const { locale } = useRouter()
	return (
		<Layout>
			<h1 className="text-secondary mb-8 text-2xl">
				{locale === "en" ? "New Product" : "Добавить товар"}
			</h1>

			<ProductForm />
		</Layout>
	)
}

export default NewProduct
