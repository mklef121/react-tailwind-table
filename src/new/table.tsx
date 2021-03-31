import PropTypes from 'prop-types';
import React from "react";
import { Icolumn, Iprop, Irow, Istate, ItableLinks, IPerPage, IretainPage } from "./table-types";
import utilsClass from "./utilsClass";
import {
	Footer, TableBulkAction, TableCaption, TableExport,
	TableHead, TableRow, TableSearch, TableTop
} from "./table-sub-components";
import "./css/tailwind.css";


export default class ReactTable extends React.Component<Iprop, Istate> {

	static propTypes: {};
	static defaultProps: {};
	public state: Istate;
	private processFilterdebounce !: (...input: any) => void;

	constructor(public props: Iprop) {
		super(props);

		this.state = this.initialPaginateSetup(this.props.rows, this.props.per_page as number);
	}

	//remmber the render function has been called before we perform these margics
	componentDidUpdate(prevProps: Iprop, prevState: Istate, _snapshot: any) {
		//Then component update was initiated inside the component it self 
		if (prevState !== this.state) return;

		//Since this calculation can get expensive for large data set, I decoded to run it in a 
		// promise
		new Promise((resolve, _reject) => {
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

	bulkActClick(_option: string) {

	}

	public onSearch = (search_text: string) => {

		let trim_search = utilsClass.ltrim(search_text, " ", "", true);
		trim_search = utilsClass.rtrim(trim_search, " ", "", true);

		if (trim_search) {

			//Make sure The debounce function is set only once
			if (!this.processFilterdebounce) {
				this.processFilterdebounce = utilsClass.debounce(this.processFilter, this.props.debounce_search as number);
			}

			//Still search with the original input.
			//Note that the search debounce is now Calling this.processFilter function
			//Sending in the filterFunctionas its input
			this.processFilterdebounce(utilsClass.filterFunction(search_text, this.props.columns));

		} else {
			//clear all active debaounces set from if statement above
			(this.processFilterdebounce as any)?.clear()
			new Promise((resolve, _reject) => {

				this.setState(this.initialPaginateSetup(this.props.rows, this.props.per_page as number));
				resolve(true);
			})
		}
	}

	private processFilter = (filter_function: (row: Irow) => boolean) => {

		// The  Rows been searched can be very long, So I put this action
		//In a Promise, So it does not slow down The UI
		new Promise((resolve) => {
			let result = this.props.rows.filter(filter_function)
			this.setState(this.initialPaginateSetup(result, this.props.per_page as number));
			resolve(true)
		})

	}

	public massChecking = (page_number: number, action: "check-all" | "uncheck-all") => {
		let state_clone: Istate | null = { ...this.state };
		let page_data: IPerPage | null = state_clone.paginated_map[page_number];

		page_data.page_row_array.forEach((_value, index) => {
			if (action === 'check-all') (page_data as IPerPage).checked_set.add(index);
			else if (action === 'uncheck-all') (page_data as IPerPage).checked_set.delete(index);
		});
		// console.log(page_data.checked_set);
		this.setState(state_clone);

		state_clone = null;
		page_data = null;

	}

	public checkBoxCheck = (page_number: number, index: number, ischecked: boolean) => {
		let state_clone: Istate | null = { ...this.state };
		//Once any member of the checkbox is checked, quickly set it in the state
		let set = state_clone.paginated_map[page_number].checked_set;
		if (ischecked) set.add(index);
		else set.delete(index)

		this.setState(state_clone);
		//Let the garbage collector do cleaning easier
		state_clone = null;

	}

	getTotalPages(): number {
		return this.props.total_page_count ?? this.state.total_rows_count;
	}

	public onPageChange = (page_number: number) => {
		let state_clone: Istate | null = { ...this.state };
		// console.log(state_clone,this.state);

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


	initialPaginateSetup(rows: Irow[], rows_count: number, retain_page?: IretainPage): Istate {

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


	render() {
		const display_columns = this.props.columns.filter((column: Icolumn) => {
			//Dont show columns the developer indicated should be false
			return column.use_in_display !== false;
		});

		//dont show the bulk select button if there are no data from user
		// or if paginated data have no data(probably from search)
		const useBulk = this.props.rows.length === 0 || this.state.page_number_list.length < 1  ? 
						false : this.props.use_bulk_action
		return <div className="bg-white w-full flex flex-col pb-5" style={{ "boxShadow": "0px 2px 8px rgba(0, 0, 0, 0.04)" }}>
			{/* Table Caption*/
				this.props.table_header && <TableCaption text={this.props.table_header} />
			}

			{
				<TableTop>
					<TableSearch onSearch={this.onSearch} />
					{
						useBulk ? <TableBulkAction action_options={["come", "go", "she"]} eventSelected={this.bulkActClick} />
								: null
					}
					
					<TableExport export_text={this.props.export_text as string}
							     paginated_data={this.state.paginated_map}
							     cols={this.props.columns}
							     processFunc={this.props.exportModify}/> 

				</TableTop>
			}

			<table className="table-auto border-collapse w-full">
				<thead >
					<TableHead columns={display_columns} use_bulk_action={useBulk as boolean}
						active_page_number={this.state.active_page_number}
						pageData={this.state.paginated_map[this.state.active_page_number]}
						massChecking={this.massChecking} />
				</thead>

				<tbody className="text-sm font-normal text-gray-700">
					{
						(this.state.active_rows.length > 0 &&
							(this.state.active_rows as Irow[]).map((row: Irow, index: number) =>
								<TableRow key={index.toString()} row={row} columns={display_columns}
									use_bulk_action={useBulk as boolean}
									render={this.props.rowRender} index={index}
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
				onPageChange={this.onPageChange} />
		</div>
	}

}




ReactTable.propTypes = {
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

	show_search: PropTypes.bool,
	should_export: PropTypes.bool,
	// use_server_side: PropTypes.bool,
	use_bulk_action: PropTypes.bool,

	debounce_search: PropTypes.number,
	total_page_count: PropTypes.number,
	per_page: PropTypes.number,

	rows: PropTypes.array.isRequired,
	columns: PropTypes.array.isRequired,

	rowRender: PropTypes.func,
	exportModify: PropTypes.func,
	onSearch: PropTypes.func,
	onBulkActionSelect: PropTypes.func,

	no_content_text: PropTypes.string,
	table_header: PropTypes.string,
	export_text: PropTypes.string,
	bulk_action_options: PropTypes.arrayOf(PropTypes.string),


}

ReactTable.defaultProps = {
	no_content_text: 'No Data Availaible',
	per_page: 30,
	debounce_search: 300,
	show_search: true,
	should_export: true,
	use_bulk_action: true,
	bulk_action_options: [],
	export_text: 'Export'
};

