import Layout from "@/components/Layout"
import ModalDelete from "@/components/ModalDelete"
import { Spinner } from "@/components/Spinner"
import { IProduct } from "@/models/product.model"
import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"

const ProductsPage = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [products, setProducts] = useState<IProduct[]>([])
	const [showModal, setShowModal] = useState(false)
	const [modalData, setModalData] = useState<IProduct>()

	const fetchProducts = async () => {
		setIsLoading(true)
		await axios.get("/api/products").then((res) => {
			setProducts(res.data)
			console.log(res.data)
			setIsLoading(false)
		})
	}

	useEffect(() => {
		fetchProducts()
	}, [])

	const openModalToDelete = (product: IProduct) => {
		setModalData(product)
		setShowModal(true)
	}

	const deleteProduct = async () => {
		await axios.delete("/api/products?id=" + modalData?._id)
		fetchProducts()
	}

	return (
		<Layout>
			<header className="mb-20">
				<Link
					href={"/products/new"}
					className="btn btn--secondary"
				>
					Add new product
				</Link>
			</header>
			<main>
				{!isLoading ? (
					products.length ? (
						<table className="basic w-full shadow-xl border-collapse">
							<thead className="bg-secondary text-white">
								<tr>
									<td>Product Name</td>
									<td>Category</td>
									<td></td>
								</tr>
							</thead>
							<tbody>
								{products.map((product) => (
									<tr key={product._id}>
										<td className="w-3/4">{product.title}</td>
										<td className="w-1/4">
											{product.categories.map((category) => (
												<p key={category._id}>{category.label}</p>
											))}
										</td>
										<td className="flex w-fit gap-2 items-center">
											<Link
												className="btn btn--success !p-2"
												href={"/products/edit/" + product._id}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth="1.5"
													stroke="currentColor"
													className="w-6 h-6"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
													/>
												</svg>
											</Link>
											<button
												onClick={() => openModalToDelete(product)}
												className="btn btn--danger !p-2"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth="1.5"
													stroke="currentColor"
													className="w-6 h-6"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
													/>
												</svg>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<h1> No products are aviable</h1>
					)
				) : (
					<Spinner size={10} />
				)}
			</main>
			<ModalDelete
				show={showModal}
				onClose={() => setShowModal(false)}
				onDelete={deleteProduct}
				product={modalData}
			/>
		</Layout>
	)
}

export default ProductsPage
