export interface Icolumn {
	field: string, //This field can have a full stop(.) will allow us to read further into objects
	use?: string, //This will be used to display in the table heading

	//Indicates of this guy should be used to search
	use_in_search?: boolean,

	//Indicates If this should be used in displaying data
	use_in_display?: boolean,

	use_in_export?: boolean,
};


//The sample of Row to be returned
export type Irow = Record<string, any>;

export type renderFunction = (row: Irow, col: Icolumn, display_value: string) => JSX.Element | string;

export type stringRenderFunc = (row: Irow, col: Icolumn, display_value: string) => string;

export interface Iprop {
	rows: Irow[],
	columns: Icolumn[],
	per_page?: number,
	no_content_text?: string,
	debounce_search?: number,
	table_header?: string,
	show_search?: boolean,
	should_export?: boolean,
	use_server_side?: any,
	total_page_count?: number,
	use_bulk_action?: boolean,
	export_text?: string,
	bulk_action_options?: string[],

	rowRender?: renderFunction,
	onSearch?: (search_word: string, result?: Irow[] | []) => void,
	/**
	 * A function used in modifying a row member before it is used for downloading an excel sheet
	 */
	exportModify?: stringRenderFunc,
	onBulkActionSelect?: (selected_option: string, selected: Irow[]) => void,
}

export interface Istate {
	active_rows: Irow[] | [],
	page_number_list: number[],
	active_page_number: number,
	paginated_map: IPaginated,
	total_rows_count:number
}



export interface ItableLinks {
	//An array to store the page numbers
	page_number_list: number[],
	page_map: IPaginated,
	//a count of the pages just iterated
	total_data_count:number

	//This is all rows That are is either a copy of
	// props.rows or is the rows Filtered when a search occurs
	// all_rows: Irow[]
}



//Interface describing how the object holding our page number data will look like
export interface IPaginated {

	[key: number]: IPerPage
}

export interface IretainPage {
	active_number: number;
	page_map?: IPaginated
}


export interface IPerPage {
	page_row_array: Irow[]
	back_button_clickable: boolean,
	forward_button_clickable: boolean,
	//determine if this page is the currently active page
	is_active: boolean,
	//The array index this records starts from
	from_index: number,
	checked_set: Set<number>
}

