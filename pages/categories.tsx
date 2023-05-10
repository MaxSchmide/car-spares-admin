import Layout from "@/components/Layout"
import { Spinner } from "@/components/Spinner"
import { ICategory } from "@/models/category.model"
import { Option } from "@/models/selectForm.models"
import { CategoriesPageSelectStyle } from "@/utils/main"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Select, { SingleValue } from "react-select"
import makeAnimated from "react-select/animated"

const CategoriesPage = () => {
	const [categories, setCategories] = useState<ICategory[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<string>()
	const [newCategroy, setNewCategory] = useState("")
	const animatedComponents = makeAnimated()

	const selectCategory = (e: SingleValue<Option>) => {
		setSelectedCategory(e?._id!)
	}

	const createCategory = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)

		const category = {
			label: newCategroy,
			value: newCategroy,
		}

		await axios
			.post("/api/categories", {
				...category,
				selectedCategory,
			})
			.then(() => {
				setSelectedCategory("")
				setNewCategory("")
				setIsLoading(false)
				toast.success("Added")
			})
	}

	const fetchCategories = async () => {
		const res = await axios.get("/api/categories")
		setCategories(res.data)
	}

	useEffect(() => {
		fetchCategories()
	}, [isLoading])

	return (
		<Layout>
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
						value={newCategroy}
						onChange={(e) => setNewCategory(e.target.value)}
					/>
					<Select
						options={categories}
						components={animatedComponents}
						styles={CategoriesPageSelectStyle}
						placeholder="Parent category..."
						isClearable
						onChange={(e) => selectCategory(e)}
					/>
				</div>
				{isLoading ? (
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
						SAVE
					</button>
				)}
			</form>
			{categories.length ? (
				<table className="basic w-full shadow-xl border-collapse">
					<thead className="bg-secondary text-white">
						<tr>
							<td>Name</td>
							<td>Parent category</td>
						</tr>
					</thead>
					<tbody>
						{categories.map((c) => (
							<tr key={c.value}>
								<td>{c.label}</td>
								<td>{c.parent?.label}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<Spinner size={10} />
			)}
		</Layout>
	)
}

export default CategoriesPage
