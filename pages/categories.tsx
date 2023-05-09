import Layout from "@/components/Layout"
import { Spinner } from "@/components/Spinner"
import { Option } from "@/models/selectForm.models"
import { CategoriesPageSelectStyle } from "@/utils/main"
import axios from "axios"
import { useState } from "react"
import { toast } from "react-hot-toast"
import Select, { SingleValue } from "react-select"
import makeAnimated from "react-select/animated"

// ############## TEMP DATA ########################
const categories = [
	{ value: "Кузов", label: "Кузов" },
	{ value: "Ходовая", label: "Ходовая" },
	{ value: "Мотор", label: "Мотор" },
	{ value: "Расходники", label: "Расходники" },
	{ value: "Аксессуары", label: "Аксессуары" },
	{ value: "Прочее", label: "Прочее" },
]
// ###################################################

const CategoriesPage = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<string>("")
	const [newCategroy, setNewCategory] = useState("")
	const animatedComponents = makeAnimated()

	const selectCategory = (e: SingleValue<Option>) => {
		setSelectedCategory(e?.value!)
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
	return (
		<Layout>
			<h1 className="text-3xl mb-8 text-secondaryShade font-bold">
				Categories
			</h1>
			<h2 className="mb-2">Add new category</h2>
			<form
				onSubmit={(e) => createCategory(e)}
				className="w-full flex items-center gap-8"
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
						value={{ value: selectedCategory, label: selectedCategory }}
						// placeholder="Parent category..."
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
		</Layout>
	)
}

export default CategoriesPage
