import Layout from "@/components/Layout"
import ProductForm from "@/components/ProductForm"

const NewProduct = () => {
	return (
		<Layout>
			<h1 className="text-secondary mb-8 text-2xl">New Product</h1>

			<ProductForm />
		</Layout>
	)
}

export default NewProduct
