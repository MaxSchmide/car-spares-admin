import { GroupBase } from "react-select"

export type Option = {
	value: string
	label: string
}

export type Group = GroupBase<Option>
