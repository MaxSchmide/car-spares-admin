import Layout from "@/components/Layout"
import ModalDelete from "@/components/ModalDelete"
import { Spinner } from "@/components/Spinner"
import { ICategory } from "@/models/category.model"
import { CategoriesPageSelectStyle } from "@/utils/main"
import {
	ChevronDownIcon,
	ChevronUpDownIcon,
	ChevronUpIcon,
	PencilIcon,
	TrashIcon,
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
		await axios.delete("/api/categories?id=" + modalData?._id)
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
							className="mb-10 w-full flex items-center gap-8 mobile:flex-col"
						>
							<div className="input !py-1 !pr-0 w-full !mb-0 flex">
								<input
									className="bg-transparent outline-none w-3/4 mobile:w-1/2"
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
									placeholder="Select..."
									isClearable
									onChange={(e) => selectCategory(e)}
									classNames={{
										container: () => "mobile:!w-1/2",
									}}
								/>
							</div>
							{isPending ? (
								<button
									type="submit"
									className="w-1/6 mobile:w-1/2 btn btn--load flex items-center justify-center"
									disabled
								>
									<Spinner size={6} />
								</button>
							) : (
								<button
									type="submit"
									className="w-1/6 mobile:w-1/2 btn btn--secondary"
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
											<td className="mobile:hidden">Parent category</td>
											<td></td>
										</tr>
									</thead>
									<tbody>
										{categories.map((category) => (
											<tr key={category._id}>
												<td className="w-1/2 mobile:w-full">
													{category.label}
												</td>
												<td className="w-1/2 mobile:hidden">
													{category.parent?.label}
												</td>
												<td className="flex w-fit gap-2 items-center">
													<button
														className="btn btn--success !p-2"
														// href={"/products/edit/" + product._id}
													>
														<PencilIcon className="w-6 h-6" />
													</button>
													<button
														onClick={() => openModalToDelete(category)}
														className="btn btn--danger !p-2"
													>
														<TrashIcon className="w-6 h-6" />
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
