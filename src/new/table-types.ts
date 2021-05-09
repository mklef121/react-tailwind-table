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

/**
 * A function whose return value is either a JSX element or a string
 */
export type renderFunction = (row: Irow, col: Icolumn, display_value: string) => JSX.Element | string;

/**
 * A function when invoked, returns a string.
 */
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
	// use_bulk_action?: boolean,
	export_text?: string,
	bulk_select_options?: string[],
	export_csv_file ?: string,

	row_render?: renderFunction,
	on_search?: (search_word: string, result?: Irow[] | []) => void,
	/**
	 * A function used in modifying a row member before it is used for downloading an excel sheet
	 */
	export_modify?: stringRenderFunc,
	
	on_bulk_action?: (selected_option: string, selected: Irow[]) => void,

	styling ?: ItableStyle
}

export interface ItableStyle {
	base_bg_color ?: string,
	base_text_color ?: string
}

export interface Istate {
	/**
	 * The rows currently being shown on the table or rows for the current active page number
	 */
	active_rows: Irow[] | [], 
	/**
	 * All page numbers are stored in an array
	 */
	page_number_list: number[],

	/**
	 * Holds the current active page number
	 */
	active_page_number: number,
	/**
	 * An `OBJECT MAP` whose key is each page number and points to 
	 * the 
	 */
	paginated_map: IPaginated,

	/**
	 * A number that holds the count of all rows
	 */
	total_rows_count:number
}



export interface ItableLinks {
	/**
	 * An array to store the page numbers
	 */
	page_number_list: number[],

	/**
	 * An `OBJECT MAP` whose key is each page number and points to 
	 * the `IperPage` data for the page. 
	 */
	page_map: IPaginated,
	/**
	 * a count of the pages just iterated
	 */
	total_data_count:number

	//This is all rows That are is either a copy of
	// props.rows or is the rows Filtered when a search occurs
	// all_rows: Irow[]
}



/**
 * `Record like` Interface describing how the object holding each page data will look like
 */
export interface IPaginated {

	[key: number]: IPerPage
}

export interface IretainPage {
	active_number: number;
	page_map?: IPaginated
}


export interface IPerPage {
	/**
	 * All row data for this page
	 */
	page_row_array: Irow[]
	/**
	 * If this page is active, can the pagination back button be clickable ?
	 */
	back_button_clickable: boolean,
	/**
	 * If this page is active, can the Forward pagination button be clickable ?
	 */
	forward_button_clickable: boolean,
	//determine if this page is the currently active page
	is_active: boolean,
	/**
	 * The array index this records starts from
	 */
	from_index: number,
	/**
	 * A set that holds the index of all rows that a marked as checked(selected) for bulk 
	 * actions on this page. This holds data each page(paginated rows). This means if there are 20 pages, each page will have
	 * its own `Set`, this 20 Sets in `ItableLinks.page_map` data
	 */
	checked_set: Set<number>
}

