export type Column = {
	label: string
	accessor: string
	sortable: boolean
}

export type TableProps = {
	data: any
	columns: Column[]
	buttons?: "edit" | "delete"
	handleModal: (param: any) => void
}

export type TableHeadProps = {
	buttons?: boolean
	columns: Column[]
	handleSorting: (sortField: string, sortOrder: string) => void
}

export type TableBodyProps = {
	columns: Column[]
	tableData: any
	buttons?: "edit" | "delete"
	handleModal: (param: any) => void
}
