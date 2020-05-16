import * as React from 'react';

export interface Icolumn {
	field: string, //This field can have a full stop(.) will allow us to read further into objects
	use: string, //This will be used to display in the table heading

	//Indicates of this guy should be used to search
	use_in_search?: boolean,

	//Indicates If this should be used in displaying data
	use_in_display?: boolean,

};

//The sample of Row to be returned
export interface Irow {
	[key: string]: any
}

export type RowArray = Irow[];

export type renderFunction = (row: Irow, col: Icolumn,display_value:string) => JSX.Element;

export interface Iprop {
	rows: Irow[],
	columns: Icolumn[],
	row_render?: renderFunction,
	per_page?: number,
	no_content_text?: string,
	debounce_search?: number,
	table_header?:string,
	show_search?:boolean
}


/**
 * Interface describing data after the active page has been set
 * @props pagination: Has the full paginated data for the rows prop
 * @props back_button_clickable: indicates if back button is clickable
 * @props forward_button_clickable: Dictates if the forward button is clickable
 * @props current_rows: The rows to be shown in the table(The current page rows)
 * @props active_page_number: The currently selected page number
 * @param {string} search_string: The Text used in the search field
 *
 */
export interface ItableState {

	pagination: ItableLinks,
	back_button_clickable: boolean,
	forward_button_clickable: boolean,
	current_rows: Irow[],
	active_page_number: number,
	search_string: string,

}


//Interface describing how the object holding our page number data will look like
export interface IpageNum {
	[key: number]: {
		page_row_array: Irow[]
		back_button_clickable: boolean,
		forward_button_clickable: boolean,
		//determine if this page is the currently active page
		is_active: boolean
	}
}

export interface ItableLinks {
	//An array to store the page numbers
	page_number_store: number[],
	page_map: IpageNum,

	//This is all rows That are is either a copy of
	// props.rows or is the rows Filtered when a search occurs
	all_rows: Irow[]
}

export interface InavComponProp {
	//An array to store the page numbers
	back_button_clickable: boolean,
	forward_button_clickable: boolean,
}

export interface IpageActiveSet {
	table_links: ItableLinks,
	back_button_clickable: boolean,
	forward_button_clickable: boolean,
	current_rows: Irow[],
	active_page_number: number

}


export interface IpaginateProps extends ItableState {
	backButtonOnclick: (event: React.MouseEvent) => void,
	forwardButtonOnclick: (event: React.MouseEvent) => void,
	pageNumberClick: (event: React.MouseEvent, page_number: number) => void,

}


export type stringObj = { [key: string]: any };
