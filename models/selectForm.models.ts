import { GroupBase } from "react-select"

export type Option = {
	value: string
	label: string
	_id?: string
	__v?: number
}

export type Group = GroupBase<Option>
