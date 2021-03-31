import React, {Fragment, useState } from "react";
import Button from "./Button";
import CheckedBox from "./svgs/CheckedBox";
import UnCheckedBox from "./svgs/UnCheckedBox";
import IndeterminateCheckBox from "./svgs/IndeterminateCheckBox";
import Import from "./svgs/Import";
import Search from "./svgs/search";
import { Icolumn, Irow, renderFunction, IPaginated, IPerPage, stringRenderFunc } from "./table-types";
import utilsClass from "./utilsClass";

export interface ItableRow {
	row: Irow,
	columns: Icolumn[],
	use_bulk_action: boolean,
	index: number,
	render?: renderFunction,
	checked_set: Set<number>,
	active_page_number: number,
	setCheck: (page_number: number, index: number, ischecked: boolean) => void
}

export function TableRow(props: ItableRow) {

	return (
		<tr className={`hover:bg-table-col border-b border-gray-200 
						${utilsClass.isEven(props.index + 1) ? 'bg-table-col' : ''}`}>

			{props.use_bulk_action &&
				<td className="px-2 py-4 pl-4 text-base ">
					<input className="w-4 h-4" type="checkbox"
						checked={props.checked_set.has(props.index)}
						onChange={(ev) => props.setCheck(props.active_page_number, props.index, ev.target.checked)} />
				</td>
			}

			{
				props.columns.map((column: Icolumn, index: number) => {
					return <TableData key={index.toString()} col={column} row={props.row} render={props.render} />
				})
			}
		</tr>
	)
}



export function TableData(props: { col: Icolumn, row: Irow, render?: renderFunction }) {

	var display_value = utilsClass.unwindObject(props.row, props.col.field);
	return (
		<td className="px-2 py-4 " style={{ "fontSize": "0.9rem" }}>

			{
				(props.render && props.render(props.row, props.col, display_value)) || display_value
			}
		</td>
	)
}

interface Ithead {
	columns: Icolumn[],
	use_bulk_action: boolean,
	pageData: IPerPage,
	active_page_number: number,
	massChecking: (page_number: number, action: "check-all" | "uncheck-all") => void
}

export function TableHead(props: Ithead) {

	//This data might be undefined, so use this operator
	let rows_lenth = props.pageData?.page_row_array.length;
	let checked_length = props.pageData?.checked_set.size;

	let page = props.active_page_number;

	let all_is_checked = rows_lenth === checked_length && rows_lenth !== 0;

	let some_ischecked = checked_length > 0 && !all_is_checked;

	let none_is_checked = checked_length === 0;


	const display_columns = props.columns.filter((column: Icolumn) => {
		//Dont show columns the developer indicated should be false
		return column.use_in_display !== false;
	});

	return <tr className="bg-brand-table-color text-left" style={{ "fontFamily": 'Source Sans Pro' }}>

		{
			props.use_bulk_action &&
			<th className="text-base font-semibold text-black py-3.5 px-2 pl-4" style={{ "fontSize": "0.95rem" }}>
				{
					all_is_checked && < CheckedBox onClick={() => props.massChecking(page, 'uncheck-all')}
						className="fill-current text-gray-700 w-4 h-4 cursor-pointer" />
				}

				{
					some_ischecked && < IndeterminateCheckBox onClick={() => props.massChecking(page, 'check-all')}
						className="fill-current text-gray-700 w-5 h-5 cursor-pointer" />
				}

				{
					none_is_checked && < UnCheckedBox onClick={() => props.massChecking(page, 'check-all')}
						className="fill-current text-gray-700 w-5 h-5 cursor-pointer" />
				}
			</th>
		}

		{
			display_columns.map((column: Icolumn, index) => {
				// if item is the first in array, then padd left
				// if it is last, then pad right
				return <th key={index.toString()}
					className={`text-base font-semibold text-black py-3.5 px-2 
			    					${!props.use_bulk_action && index === 0 ? 'pl-4 ' : ''}
			    					${index === (display_columns.length - 1) ? 'pr-4 ' : ''}`}
					style={{ "fontSize": "0.95rem" }}>
					{column.use ? column.use : column.field}
				</th>

			})
		}
	</tr>
}



export function TableCaption(props: { text: string }) {

	return <div className="flex mt-4 px-4 mb-1">
		<h4 className="text-base font-semibold tracking-wide leading-7 ml-1 text-gray-700 react-table-top">
			{props.text}
		</h4>
	</div>

}


export function TableSearch(props: { onSearch: (text: string) => void }) {
	// leading-snug border border-gray-300 block w-full appearance-none bg-gray-100 text-sm text-gray-600 py-1 px-4 pl-8 rounded-lg

	return <div className="relative flex items-center mt-3 md:mt-0">
		<input type="text" name="search"
			className="text-xs py-2 h-10 px-4 pl-6 w-52 md:w-auto focus:outline-none leading-9 tracking-wide 
			text-gray-700 border  border-gray-300 bg-gray-100 rounded-lg"
			placeholder="SEARCH"
			onChange={(ev: React.ChangeEvent<HTMLInputElement>) => props.onSearch(ev.target.value)} />
		<Search className="absolute w-2.5 h-2.5 ml-2" style={{ top: '0.9rem' }} />
	</div>

}

export function TableExport(props: { export_text: string, paginated_data: IPaginated, cols: Icolumn[], processFunc?: stringRenderFunc }) {

	return <div className="flex items-center text-brand-color cursor-pointer order-first md:order-none self-end md:self-auto"
		onClick={() => processDownload(props.paginated_data, props.cols, props.processFunc)} >
		<Import className="fill-current w-3 h-3 mr-2 " />
		<p className="font-normal text-base">{props.export_text}</p>
	</div>

}

export function TableTop(props: { children?: React.ReactNode }) {
	return <Fragment>
		{
			props.children && <div className="flex flex-col md:flex-row md:items-center py-2 justify-between px-4 mt-4 mb-2 react-table-top" >
				{props.children}

			</div>
		}
	</Fragment>

}





export function TableBulkAction(props: { action_options: string[], eventSelected: (option: string) => void }) {

	const [currentOption, setOption] = useState('nothing');

	function optionChange(event: React.ChangeEvent<HTMLSelectElement>) {
		let value = event.target.value;
		setOption(value)
	}

	function takeAction() {
		if (currentOption !== 'nothing') {
			props.eventSelected(currentOption);

		}
	}

	return <div className="flex items-center mt-3 md:mt-0">
		<div className="w-52 md:w-48 relative mr-2 flex ">
			<select
				onChange={optionChange}
				value={currentOption}
				className="leading-tight block appearance-none w-full bg-white flex-shrink 
								   border border-gray-200 px-3 py-2 pr-8 rounded ">
				<option value="nothing">Choose Bulk Action</option>
				{
					props.action_options.map((value: string, index: number) => {
						return <option key={index.toString()} value={value}>{value}</option>
					})
				}
			</select>
			<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
				<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
					<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
				</svg>
			</div>
		</div>

		<Button px="px-4" className="leading-4" onClick={takeAction} >Apply</Button>
	</div>
}


interface Ifooter {
	page_number_list: number[],
	paginated_map: IPaginated,
	active_page: number,
	total_pages: number,
	onPageChange: (page_number: number) => void
}

export function Footer(props: Ifooter) {
	const { active_page, page_number_list, paginated_map } = props;

	let page_count = props.page_number_list.length;


	function pageClick(page_number: number) {
		props.onPageChange(page_number);
	}

	function nextBackBtnClick(direction: "nxt" | "bck") {
		if (direction === "nxt" && paginated_map[active_page].forward_button_clickable) {
			props.onPageChange(active_page + 1);
			return;
		}
		if (direction === "bck" && paginated_map[active_page].back_button_clickable) {
			props.onPageChange(active_page - 1);
			return;
		}

	}

	return page_count > 0 ?
		<div className="flex flex-col md:flex-row justify-between mt-6 items-center px-4">
			<div>
				<p className="text-sm">
					Showing
				<strong> {paginated_map[active_page].from_index + 1}</strong>  to
				<strong> {paginated_map[active_page].from_index + paginated_map[active_page].page_row_array.length}</strong> of
				<strong> {props.total_pages}</strong> entries
			</p>
			</div>

			<div className="flex rounded overflow-hidden border mt-2 md:mt-0">

				<div className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-around border-r 
							${paginated_map[active_page].back_button_clickable ?
						'cursor-pointer' : 'cursor-not-allowed'}`}
					onClick={() => nextBackBtnClick('bck')}>
					<p className={`text-sm  
							${paginated_map[active_page].back_button_clickable ?
							'text-gray-700' : 'text-gray-400'}`}>
						<svg className="transform rotate-180 fill-current" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0.772277 9.90938L0.837937 9.85312L5.73111 5.60312C5.89682 5.45937 6 5.24375 6 5.00313C6 4.7625 5.89369 4.54688 5.73111 4.40312L0.847317 0.15625L0.766024 0.0843749C0.687858 0.0312499 0.59406 0 0.494007 0C0.221991 0 0 0.23125 0 0.51875V9.48125C0 9.76875 0.221991 10 0.494007 10C0.597186 10 0.694111 9.96562 0.772277 9.90938Z" />
						</svg>
					</p>
				</div>

				{
					/* I want each line to have between 7-9 boxes of pagination, This logic solved it*/

					/* Else */
					page_number_list.length <= 7 ?

						page_number_list.map((page_number) => {
							let is_active_page = page_number === active_page;
							return <NumberBox key={page_number} is_active_page={is_active_page}
								page_number={page_number} pageClick={pageClick} />
						})

						/* Else IF */
						: active_page >= 1 && active_page <= 6 ?

							<ActivePageBegining pageClick={pageClick} page_number_list={page_number_list}
								active_page={active_page} />

							/* Else IF */
							: active_page >= page_count - 5 && active_page <= page_count ?
								<ActivePageEnding pageClick={pageClick} page_number_list={page_number_list}
									active_page={active_page} />

								/* Else */
								: <ActivePageMiddle pageClick={pageClick} page_number_list={page_number_list}
									active_page={active_page} />
				}



				<div className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-around border-r 
						${paginated_map[active_page].forward_button_clickable
						? 'cursor-pointer' : 'cursor-not-allowed'}`}
					onClick={() => nextBackBtnClick('nxt')}>
					<p className={`text-sm  
							${paginated_map[active_page].forward_button_clickable ?
							'text-gray-700' : 'text-gray-400'}`}>
						<svg className="fill-current" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0.772277 9.90938L0.837937 9.85312L5.73111 5.60312C5.89682 5.45937 6 5.24375 6 5.00313C6 4.7625 5.89369 4.54688 5.73111 4.40312L0.847317 0.15625L0.766024 0.0843749C0.687858 0.0312499 0.59406 0 0.494007 0C0.221991 0 0 0.23125 0 0.51875V9.48125C0 9.76875 0.221991 10 0.494007 10C0.597186 10 0.694111 9.96562 0.772277 9.90938Z" />
						</svg>
					</p>
				</div>


			</div>
		</div>

		: null;
}

function ActivePageBegining(props: { page_number_list: number[]; active_page: number; pageClick: (page: number) => void }) {

	//Get the page that is last
	let last_page: number = props.page_number_list[props.page_number_list.length - 1];
	return <Fragment>
		{
			props.page_number_list.slice(0, 7).map((page_number) => {
				let is_active_page = page_number === props.active_page;
				return <NumberBox key={page_number} is_active_page={is_active_page}
					page_number={page_number} pageClick={props.pageClick} />
			})
		}

		<DottedBox />

		<NumberBox page_number={last_page} is_active_page={false} pageClick={props.pageClick} />

	</Fragment>

}

function ActivePageMiddle(props: { page_number_list: number[]; active_page: number; pageClick: (page: number) => void }) {

	//Get the page that is last
	let first_page: number = props.page_number_list[0];
	let page_count = props.page_number_list.length;
	let last_page: number = props.page_number_list[page_count - 1];

	return <Fragment>

		{/*  The First */}
		<NumberBox page_number={first_page} is_active_page={false} pageClick={props.pageClick} />

		<DottedBox />

		{
			props.page_number_list.slice(props.active_page - 4, props.active_page + 3).map((page_number) => {
				let is_active_page = page_number === props.active_page;
				return <NumberBox key={page_number} is_active_page={is_active_page}
					page_number={page_number} pageClick={props.pageClick} />
			})
		}

		<DottedBox />
		{/*  The last */}

		<NumberBox page_number={last_page} is_active_page={false} pageClick={props.pageClick} />


	</Fragment>

}



function ActivePageEnding(props: { page_number_list: number[]; active_page: number; pageClick: (page: number) => void }) {

	//Get the page that is last
	let first_page: number = props.page_number_list[0];
	let page_count = props.page_number_list.length;
	return <Fragment>

		<NumberBox page_number={first_page} is_active_page={false} pageClick={props.pageClick} />

		<DottedBox />
		{
			props.page_number_list.slice(page_count - 7, page_count).map((page_number) => {
				let is_active_page = page_number === props.active_page;
				return <NumberBox key={page_number} is_active_page={is_active_page}
					page_number={page_number} pageClick={props.pageClick} />
			})
		}

	</Fragment>

}



function DottedBox() {

	return <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-around border-r ">
		<p className="text-sm text-gray-700 ">
			<span className="hidden md:flex"> . . . </span>
			<span className="flex md:hidden"> ... </span>
		</p>
	</div>
}


function NumberBox(props: { page_number: number, is_active_page: boolean, pageClick: (page: number) => void }) {
	return <div className={`w-7 h-7 md:w-8 md:h-8 flex items-center flex-shrink md:flex-shrink-0 justify-around border-r cursor-pointer
									${props.is_active_page ? 'bg-brand-color' : ''}`}
		onClick={() => props.pageClick(props.page_number)}>
		<p className={`${props.is_active_page ? 'text-white' : ''} text-sm`}>

			{
				props.page_number
			}
		</p>
	</div>
}


function processDownload(paginated_data: IPaginated, colums: Icolumn[], processFunc?: stringRenderFunc) {

	let all_rows: Irow[] | null = [];
	var page: string; //suppose to be :number
	var file_name = "my_data.csv";
	for (page in paginated_data) {
		all_rows = all_rows.concat(paginated_data[page].page_row_array)
	}


	let blob = utilsClass.generateCSV(colums, all_rows, processFunc),
		url = window.URL.createObjectURL(blob);

	// @ts-ignore
	if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
		window.navigator.msSaveBlob(blob, file_name);
	else {
		var link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", file_name);
		document.body.appendChild(link); // Required for Fire fox

		link.click(); // This will download the data file named "my_data.csv".

		setTimeout(() => {
			window.URL.revokeObjectURL(url);
			document.body.removeChild(link);
			all_rows = null;
		}, 0)
	}
}

