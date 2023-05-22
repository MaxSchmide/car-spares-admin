import Layout from "@/components/Layout"
import ProductForm from "@/components/ProductForm"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/router"

const NewProduct = () => {
	const { locale, push } = useRouter()
	return (
		<Layout>
			<h1 className="text-secondary mb-8 text-2xl flex gap-2 items-center">
				<ArrowLeftIcon
					className="w-6 h-6 text-secondary cursor-pointer"
					onClick={() => push("/products", "/products", { locale })}
				/>
				{locale === "en" ? "New Product" : "Добавить товар"}
			</h1>

			<ProductForm />
		</Layout>
	)
}

export default NewProduct
