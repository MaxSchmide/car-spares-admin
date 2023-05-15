import Layout from "@/components/Layout"
import ModalDelete from "@/components/ModalDelete"
import { Spinner } from "@/components/Spinner"
import { ICategory } from "@/models/category.model"
import { CategoriesPageSelectStyle } from "@/utils/main"
import {
	ChevronDownIcon,
	ChevronUpDownIcon,
	ChevronUpIcon,
} from "@heroicons/react/24/outline"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Select, { SingleValue } from "react-select"
import makeAnimated from "react-select/animated"

const CategoriesPage = () => {
	const router = useRouter()
	const { status } = useSession()

	const [categories, setCategories] = useState<ICategory[]>([])
	const [isFetching, setIsFetching] = useState(false)
	const [isPending, setIsPending] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
		null
	)
	const [modalData, setModalData] = useState<ICategory>()
	const [showModal, setShowModal] = useState(false)
	const [categoryTitle, setCategoryTitle] = useState("")
	const [order, setOrder] = useState<string>("asc")
	const [sortField, setSortField] = useState<string>("")

	const animatedComponents = makeAnimated()
	const signedIn = status === "authenticated"

	const handleSortingChange = (accessor: string) => {
		const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc"
		setOrder(sortOrder)
		setSortField(accessor)
		if (accessor) {
			const sorted = [...categories].sort((a, b) => {
				if (a[accessor] === null) return 1
				if (b[accessor] === null) return -1
				if (a[accessor] === null && b[accessor] === null) return 0
				return (
					a[accessor].toString().localeCompare(b[accessor].toString(), "en", {
						numeric: true,
					}) * (sortOrder === "asc" ? 1 : -1)
				)
			})
			setCategories(sorted)
		}
	}

	const getSortIcons = (accessor: string): any => {
		return sortField === accessor && order === "asc" ? (
			<ChevronUpIcon className="h-6 w-6 text-white" />
		) : sortField === accessor && order === "desc" ? (
			<ChevronDownIcon className="h-6 w-6 text-white" />
		) : (
			<ChevronUpDownIcon className="h-6 w-6 text-white" />
		)
	}

	const selectCategory = (e: SingleValue<ICategory>) => {
		setSelectedCategory(e)
	}

	const deleteCategory = async () => {
		await axios.delete("/api/categories?_id=" + modalData?._id)
		fetchCategories()
	}

	const openModalToDelete = (category: ICategory) => {
		setModalData(category)
		setShowModal(true)
	}

	const createCategory = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsPending(true)

		const data = {
			label: categoryTitle,
			parent: selectedCategory?._id,
		}

		await axios.post("/api/categories", data).then(() => {
			setSelectedCategory(null)
			setCategoryTitle("")
			setIsPending(false)
			toast.success("Added")
		})
		fetchCategories()
	}

	const fetchCategories = useCallback(async () => {
		setIsFetching(true)
		await axios
			.get("/api/categories")
			.then((res) => {
				setCategories(res.data)
				setIsFetching(false)
			})
			.catch((e) => {
				e.response.status === 403
					? router.push("auth/error?error=AccessDenied")
					: console.log(e)
			})
	}, [router])

	useEffect(() => {
		signedIn && fetchCategories()
	}, [fetchCategories, signedIn])

	return (
		<>
			{signedIn && (
				<Layout>
					<main>
						<h1 className="text-3xl mb-8 text-secondaryShade font-bold">
							Categories
						</h1>
						<h2 className="mb-2">Add new category</h2>
						<form
							onSubmit={(e) => createCategory(e)}
							className="mb-10 w-full flex items-center gap-8"
						>
							<div className="input !py-1 !pr-0 w-full !mb-0 flex">
								<input
									className="bg-transparent outline-none w-3/4"
									placeholder="Enter category name..."
									type="text"
									id="category"
									value={categoryTitle}
									onChange={(e) => setCategoryTitle(e.target.value)}
								/>
								<Select
									options={categories.map((cat) => {
										return { ...cat, value: cat._id }
									})}
									components={animatedComponents}
									styles={CategoriesPageSelectStyle}
									value={selectedCategory}
									placeholder="Parent category..."
									isClearable
									onChange={(e) => selectCategory(e)}
								/>
							</div>
							{isPending ? (
								<button
									type="submit"
									className="w-1/6 btn btn--load flex items-center justify-center"
									disabled
								>
									<Spinner size={6} />
								</button>
							) : (
								<button
									type="submit"
									className="w-1/6 btn btn--secondary"
								>
									Save
								</button>
							)}
						</form>
						{!isFetching ? (
							categories.length ? (
								<table className="basic">
									<thead>
										<tr>
											<td
												className="flex gap-2"
												onClick={() => handleSortingChange("label")}
											>
												Name
												{getSortIcons("label")}
											</td>
											<td>Parent category</td>
											<td></td>
										</tr>
									</thead>
									<tbody>
										{categories.map((category) => (
											<tr key={category._id}>
												<td className="w-1/2">{category.label}</td>
												<td className="w-1/2">{category.parent?.label}</td>
												<td className="flex w-fit gap-2 items-center">
													<button
														className="btn btn--success !p-2"
														// href={"/products/edit/" + product._id}
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
													</button>
													<button
														onClick={() => openModalToDelete(category)}
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
								<h1>No categories are aviable</h1>
							)
						) : (
							<Spinner size={10} />
						)}
						<ModalDelete
							show={showModal}
							onClose={() => setShowModal(false)}
							onDelete={deleteCategory}
							category={modalData}
						/>
					</main>
				</Layout>
			)}
		</>
	)
}

export default CategoriesPage
