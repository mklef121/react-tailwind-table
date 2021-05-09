import PropTypes from 'prop-types';
import React from "react";
import { Icolumn, Iprop, Irow, Istate, ItableLinks, IPerPage, IretainPage, ItableStyle } from "./table-types";
import utilsClass from "./utilsClass";
import {
	Footer, TableBulkAction, TableCaption, TableExport,
	TableHead, TableRow, TableSearch, TableTop
} from "./table-sub-components";
import "./css/tailwind.css";

// bulk_action_options
export default class ReactTable extends React.Component<Iprop, Istate> {

	static propTypes: {};
	static defaultProps: {};
	public state: Istate;

	/**
	 * When ever a search happens, it is debounced for `this.props.debounce_search` seconds in case user 
	 * input is steady. This property holds the debounced funtion gotten from @see {@link utilsClass.debounce}
	 */
	private processFilterdebounce !: (...input: any) => void;

	constructor(public props: Iprop) {
		super(props);

		this.state = this.initialPaginateSetup(this.props.rows, this.props.per_page as number);
	}

	//remmber the render function has been called before we perform these margics
	componentDidUpdate(prevProps: Iprop, prevState: Istate, _snapshot: any) {
		//If the component update was initiated inside the component it self 
		//Then do not recompute changes
		if (prevState !== this.state) return;

		//Since this calculation can get expensive for large data set, I decided to run it in a 
		// promise
		new Promise((resolve, _reject) => {
			//If the length of the data sent in has changed, then recompute entirely, Don't border about retaining
			//state or active page number
			if (this.props.rows.length !== prevProps.rows.length || this.props.per_page !== prevProps.per_page) {
				this.setState(this.initialPaginateSetup(this.props.rows, this.props.per_page as number));
			} else {

				this.setState(this.initialPaginateSetup(this.props.rows, this.props.per_page as number, {
					active_number: this.state.active_page_number,
					page_map: this.state.paginated_map
				}));
			}

			resolve(true);
		})
		// console.log(prevProps === this.props,"Props are the same");
		// console.log(prevState === this.state,"States are the same");
	}

	private bulkActClick = (_option: string) => {
	
		if(this.props.on_bulk_action){
			//The set containing page numbers of selected rows
			let selectedIndexes = this.state.paginated_map[this.state.active_page_number].checked_set;
			let selectedRows = this.state.active_rows.filter((_val,index) => selectedIndexes.has(index));

			this.props.on_bulk_action(_option,selectedRows);
		}

	}

	private onSearch = (search_text: string) => {

		let trim_search = utilsClass.ltrim(search_text, " ", "", true);
		trim_search = utilsClass.rtrim(trim_search, " ", "", true);

		//If search text is an empty or space string, then do not bother searching
		if (trim_search) {
			//Make sure The debounce function is set only once
			if (!this.processFilterdebounce) {
				this.processFilterdebounce = utilsClass.debounce(this.processFilter, this.props.debounce_search as number);
			}

			/**
			 * Still search with the original input. 
			 * Note that the search debounce is now calling `this.processFilter` function as registered above.
			 * Sending in the filterFunctionas its input
			 */
			this.processFilterdebounce(utilsClass.filterFunction(search_text, this.props.columns),search_text);   

		} else { //Once the search field is cleared totally. Load the table with the original data from  the user
			//clear all active debaounces set from if statement above
			(this.processFilterdebounce as any)?.clear()
			new Promise((resolve, _reject) => {

				this.setState(this.initialPaginateSetup(this.props.rows, this.props.per_page as number));
				resolve(true);
			})
		}
	}

	/**
	 * A function that uses a promise to filter all rows using a search keyword typed into the 
	 * Search input bar.
	 * @param filter_function 
	 */
	private processFilter = (filter_function: (row: Irow) => boolean, search_word:string) => {
		// The  Rows been searched can be very long, So I put this action
		//In a Promise, So it does not slow down The UI
		new Promise<Irow[]>((resolve) => {
			let result = this.props.rows.filter(filter_function)
			this.setState(this.initialPaginateSetup(result, this.props.per_page as number));
			resolve(result)
		}).then((rows: Irow[]) => {
			//Once the re-render has been processed, fire an event if the user registered a listener
			if(this.props.on_search) this.props.on_search(search_word, rows);
		})

	}

	private massChecking = (page_number: number, action: "check-all" | "uncheck-all") => {
		//Clone the current state, no need to recompute the pagination logic
		let state_clone: Istate | null = { ...this.state };
		let page_data: IPerPage | null = state_clone.paginated_map[page_number];

		page_data.page_row_array.forEach((_value, index) => {
			if (action === 'check-all') (page_data as IPerPage).checked_set.add(index);
			else if (action === 'uncheck-all') (page_data as IPerPage).checked_set.delete(index);
		});
		this.setState(state_clone);

		state_clone = null;
		page_data = null;

	}

	private checkBoxCheck = (page_number: number, index: number, ischecked: boolean) => {
		let state_clone: Istate | null = { ...this.state };
		//Once any member of the checkbox is checked, quickly set it in the state
		let set = state_clone.paginated_map[page_number].checked_set;
		if (ischecked) set.add(index);
		else set.delete(index)

		this.setState(state_clone);
		//Let the garbage collector do cleaning easier
		state_clone = null;

	}

	private getTotalPages(): number {
		return this.props.total_page_count ?? this.state.total_rows_count;
	}

	private onPageChange = (page_number: number) => {
		let state_clone: Istate | null = { ...this.state };

		//Set the active status of the `about to be former page` to false
		state_clone.paginated_map[state_clone.active_page_number].is_active = false;
		state_clone.active_page_number = page_number;

		//Set the now new page to active
		state_clone.paginated_map[page_number].is_active = true;
		state_clone.active_rows = state_clone.paginated_map[page_number].page_row_array;

		this.setState(state_clone);

		//Let the garbage collector do cleaning easier
		state_clone = null;
	}


	private initialPaginateSetup(rows: Irow[], rows_count: number, retain_page?: IretainPage): Istate {

		let paginated_values: ItableLinks = utilsClass.TableNumberLinks(rows, rows_count, retain_page);
		const active_pg_num = retain_page ? retain_page.active_number : 1;
		return {
			active_rows: paginated_values.page_number_list.length > 0 ? 
				paginated_values.page_map[active_pg_num].page_row_array : [],
			page_number_list: paginated_values.page_number_list,
			paginated_map: paginated_values.page_map,
			active_page_number: active_pg_num,
			total_rows_count: paginated_values.total_data_count
		}
	}

	/**
	 * Checks if there are bulk selected items in the table
	 * @returns boolean
	 */
	private isBulkSelected(): boolean {
		let setOfSelectedRowsIndexes = this.state.paginated_map[this.state.active_page_number]?.checked_set;

		return setOfSelectedRowsIndexes ? setOfSelectedRowsIndexes.size > 0 : false;

	}


	render() {
		const styling = this.props.styling as ItableStyle;
		const display_columns = this.props.columns.filter((column: Icolumn) => {
			//Dont show columns the developer indicated should be false
			return column.use_in_display !== false;
		});

		//dont show the bulk select button if there are no data from user or from search
		//Also don't show the bulk select if then user did not send in an array of `bulk_select_options` props
		const useBulk = this.state.page_number_list.length < 1 ?
			false : (this.props.bulk_select_options as string[]).length > 0 ? true : false
		return <div className="bg-white w-full flex flex-col pb-5" style={{ "boxShadow": "0px 2px 8px rgba(0, 0, 0, 0.04)" }}>
			{/* Table Caption*/
				this.props.table_header && <TableCaption text={this.props.table_header} />
			}

			{
				<TableTop>
					<TableSearch onSearch={this.onSearch} />
					{
						useBulk && this.isBulkSelected() ? <TableBulkAction action_options={this.props.bulk_select_options as string[]} 
																			eventSelected={this.bulkActClick}
																			bg_color={styling.base_bg_color as string} />
								: null
					}
					
					{ 
						this.props.should_export && <TableExport export_text={this.props.export_text as string}
							     								 paginated_data={this.state.paginated_map}
							     								 cols={this.props.columns}
																 file_name={this.props.export_csv_file as string}
							     								 processFunc={this.props.export_modify}
																 text_color={styling.base_text_color as string}/> 
					}

				</TableTop>
			}

			<table className="table-auto border-collapse w-full">
				<thead >
					<TableHead columns={display_columns} use_bulk_action={useBulk}
						active_page_number={this.state.active_page_number}
						page_data={this.state.paginated_map[this.state.active_page_number]}
						mass_checking={this.massChecking} />
				</thead>

				<tbody className="text-sm font-normal text-gray-700">
					{
						(this.state.active_rows.length > 0 &&
							(this.state.active_rows as Irow[]).map((row: Irow, index: number) =>
								<TableRow key={index.toString()} row={row} columns={display_columns}
									use_bulk_action={useBulk}
									render={this.props.row_render} index={index}
									active_page_number={this.state.active_page_number}
									checked_set={this.state.paginated_map[this.state.active_page_number].checked_set}
									setCheck={this.checkBoxCheck} />
							)) ||

						<tr className="hover:bg-table-col bg-table-col border-b border-gray-200 ">
							<td className="px-4 py-4 text-center"
								colSpan={display_columns.length} >

								{this.props.no_content_text}
							</td>
						</tr>
					}
				</tbody>
			</table>

			<Footer page_number_list={this.state.page_number_list}
				paginated_map={this.state.paginated_map}
				active_page={this.state.active_page_number}
				total_pages={this.getTotalPages()}
				onPageChange={this.onPageChange}
				bg_color={styling.base_bg_color as string} />
		</div>
	}

}




ReactTable.propTypes = {
	/**
	 * TODO: Implement server side render for table 
	 * @param props 
	 * @param propName 
	 * @param componentName 
	 * @returns 
	use_server_side: function(props: Record<string, any>, propName: string, componentName: string): Error | undefined {
		let value = props[propName];
		if (value === undefined) return;
		
		if (typeof value !== "boolean") {
			return new Error(
				`Prop '${propName}' must be boolean '${typeof value}' given. " 
				 '${componentName}' Validation failed.`)
		}
		if (value === true && !utilsClass.isInteger(props['total_page_count'])) {
			return new Error(
				`If prop ' ${propName} ' is 'true', Then total_page_count must be supplied too. 
				 '${componentName}' Validation failed.`
			);
		}

		return;

	},
	*/

	show_search: PropTypes.bool,
	should_export: PropTypes.bool,
	// use_server_side: PropTypes.bool,
	// use_bulk_action: PropTypes.bool,

	debounce_search: PropTypes.number,
	total_page_count: PropTypes.number,
	per_page: PropTypes.number,

	rows: PropTypes.array.isRequired,
	columns: PropTypes.array.isRequired,

	row_render: PropTypes.func,
	export_modify: PropTypes.func,
	on_search: PropTypes.func,
	on_bulk_action: PropTypes.func,

	no_content_text: PropTypes.string,
	table_header: PropTypes.string,
	export_text: PropTypes.string,
	bulk_select_options: PropTypes.arrayOf(PropTypes.string),
	styling: PropTypes.shape({
		base_bg_color: PropTypes.string,
		base_text_color: PropTypes.string
	}),
}

ReactTable.defaultProps = {
	no_content_text: 'No Data Availaible',
	per_page: 30,
	debounce_search: 300,
	show_search: true,
	should_export: true,
	// use_bulk_action: true,
	bulk_select_options: [],
	export_text: 'Export',
	export_csv_file: "file_name",
	styling:{
		base_bg_color:"bg-pink-700",
		base_text_color:"text-pink-700"
	}
};

