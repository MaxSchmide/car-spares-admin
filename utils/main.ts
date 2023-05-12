import { ICategory } from "@/models/category.model"
import { GroupBase, StylesConfig } from "react-select"

export const ProductPageSelectStyle: StylesConfig<
	ICategory,
	true,
	GroupBase<ICategory>
> = {
	option: (styles, { isDisabled, isFocused, isSelected }) => {
		return {
			...styles,
			backgroundColor: isDisabled
				? undefined
				: isSelected
				? "#4940e5"
				: isFocused
				? "#e4e6eb"
				: undefined,
			":active": {
				...styles[":active"],
				backgroundColor: isSelected ? "#4940e5" : "#e4e6eb",
			},
		}
	},
	control: (styles, { menuIsOpen }) => ({
		...styles,
		padding: "2px",
		backgroundColor: "transparent",
		borderColor: menuIsOpen ? "#928cef" : "#C0C4CE",
		borderWidth: "2px",
		boxShadow:
			"var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
		"--tw-shadow":
			"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
		"--tw-shadow-colored":
			"0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color)",
		":hover": {
			borderColor: "#928cef",
		},
	}),

	input: (styles) => ({
		...styles,
		backgroundColor: "transparent",
	}),
	multiValue: (styles) => ({
		...styles,
		backgroundColor: "#4940e5",
	}),
	multiValueLabel: (style) => {
		return { ...style, color: "white" }
	},
	multiValueRemove: (style) => {
		return {
			...style,
			":hover": {
				opacity: 0.5,
			},
		}
	},
}

export const CategoriesPageSelectStyle: StylesConfig<
	ICategory,
	false,
	GroupBase<ICategory>
> = {
	container: (styles) => ({
		...styles,
		width: "30%",
	}),
	control: (styles) => ({
		...styles,
		backgroundColor: "transparent",
		border: "none",
		boxShadow: "none",
	}),
	option: (styles, { isDisabled, isFocused, isSelected }) => {
		return {
			...styles,
			backgroundColor: isDisabled
				? undefined
				: isSelected
				? "#4940e5"
				: isFocused
				? "#e4e6eb"
				: undefined,
			":active": {
				...styles[":active"],
				backgroundColor: isSelected ? "#4940e5" : "#e4e6eb",
			},
		}
	},
}
