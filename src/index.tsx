import React from 'react';
import "./css/table-style.css";
import "./css/output.css";
import ThreeDotsvg from "./svg-components/ThreeDotsvg";
import LeftSvg from "./svg-components/LeftSvg";
import RightSvg from "./svg-components/RightSvg";
import utils from "./utilities/utils"
import PropTypes from 'prop-types';
import {Icolumn, Irow, renderFunction, Iprop, ItableLinks, 
        ItableState, IpaginateProps, IpageActiveSet} from "./types"



/*
Sample above is  shouldComponentUpdate
{
  field: "front_end_position",
  use: "Position"
},
{
  field: "player.name", //Object destructure
  use: "Name"
}
*/


/**
 *@class
 * This Is the primary building block of a table designed in tailwind css
 * The abstraction is key in enforcing reacts component based system
 */
export default class Table extends React.Component<Iprop, ItableState > {

  public state: ItableState ;
  public props !: Iprop;
  private search_debounce !: (...input: any) => void;
  static defaultProps = {
    no_content_text: 'No Data Availaible',
    per_page: 10,
    debounce_search: 300,
    table_header:"",

  };
  static propTypes = {
      // You can declare that a prop is a specific JS type. By default, these
      // are all optional.
      rows: PropTypes.array.isRequired,
      columns: PropTypes.array.isRequired,
      debounce_search: PropTypes.number,
      per_page: PropTypes.number,
      no_content_text:  PropTypes.string,
      table_header:  PropTypes.string
  }
  public constructor(props: Iprop) {
    //The props is setup in the parent component
    super(props);

    var page_set_up: IpageActiveSet | null = Table.setInitialPage(props.rows, props.per_page as number)
      
    this.state = {
        pagination: page_set_up.table_links,
        forward_button_clickable: page_set_up.forward_button_clickable,
        back_button_clickable: page_set_up.back_button_clickable,
        current_rows: page_set_up.current_rows,
        active_page_number: page_set_up.active_page_number,
        search_string: '',

    }

    
    page_set_up = null;

  }

  /**
   * React calls the render function of a component anytime props changes from its ancesstor
   * Even if the change is not from its direct parent. This becomes very technical for me since
   * It is a paginated component, recalculating pagination on every re-render can be very expensive
   * Since data rows can be very large. So the best bet is to comapare the nextProps with the previous. 
   * So that everytime this component wants to re-rendered, I compare if there was
   * A change in the props. Secondly, this Function is not called on initialization, Thus further data about our table
   * Must be calculated here.
   *
   *  NOTE:: in vue js I could easily do this with watchers, or @observable in aurelia, unfortunately
   *      I could only achieve this with the depreciated methosd in React
   */

  public UNSAFE_componentWillReceiveProps(nextProps:Iprop){
    
    //The only values that will cause us to force recalculating pagination is
    // props.rows and props.per_page. Thus update the table only when these two values change.
    // Else, The pagination will be messed up on any change in props


    if (nextProps.per_page && nextProps.per_page !== this.props.per_page) {
      //update state
      this.setComponentState( Table.setInitialPage(nextProps.rows, nextProps.per_page as number) )
      return;
    }

    //Only update my table when 
    if (!utils.isObjectEqual(nextProps.rows, this.props.rows)) {
      var per_page = nextProps.per_page ? nextProps.per_page : this.props.per_page;
      //update state
      this.setComponentState( Table.setInitialPage(nextProps.rows, per_page as number) )
      return;
    }

  }

  // public componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    // console.log(arguments);
  // }

  public static setInitialPage(rows: Irow[],per_page:number) {
    //Set the first state at either page start or search finish
    return Table.setPageActive(utils.TableNumberLinks(rows, per_page), 1);

  }

  //Whenever the left button or the right button is clicked, i can use the 
  //Table State to determine if they are supposed to be clicked
  public backButtonOnclick = (event: React.MouseEvent) => {
    event.type;
    if (!this.state.back_button_clickable) {
      return;
    }

    let nexbutton: number = this.state.active_page_number - 1;

    this.setPage(nexbutton);
  }


  public searchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {

    const original_value = event.target.value;
    const trimmed_value = original_value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

    //Only run the filter operation when the value is not empty
    if (trimmed_value) {

      //Make sure The debounce function is set only once
      if (!this.search_debounce) {
        this.search_debounce = utils.debounce(this.processFilter, this.props.debounce_search as number);
      }

      //Still search with the original input.
      //Note that the search debounce is now Calling this.processFilter function
      //Sending in the filterFunctionas its input
      this.search_debounce(utils.filterFunction(original_value, this.props.columns));

    } else {

      //If The currently displayed page, is not the entire data from the props
      // Then Set state to initial value
      if (this.state.pagination.all_rows.length !== this.props.rows.length) {

        this.setComponentState(Table.setInitialPage(this.props.rows, this.props.per_page as number));

      }
    }
  }

  private processFilter = (filter_function: (row: Irow) => boolean) => {

    // The  Rows been searched can be very long, So I put this action
    //In a Promise, So it does not slow down The UI
    var search_promise = new Promise<Irow[] | []>((resolve) => {
      resolve(this.props.rows.length > 0 ? this.props.rows.filter(filter_function) : this.props.rows)
    });

    search_promise.then((result) => {
      
      this.setComponentState(Table.setInitialPage(result, this.props.per_page as number))
    });

  }

  public forwardButtonOnclick = (event: React.MouseEvent) => {
    event.type;
    if (!this.state.forward_button_clickable) {
      return;
    }

    let nexbutton: number = this.state.active_page_number + 1;

    this.setPage(nexbutton);
  }

  public pageNumberClick = (event: React.MouseEvent, page_number: number) => {
    event.type;
    if (this.state.active_page_number === page_number) {
      
      return;
    }

    this.setPage(page_number);
  }

  //Deactivate currently active page and set the new one
  public setPage(page_number: number) {

    let stateclone: ItableState | null = { ...this.state};
    //Make sure the Former
    stateclone.pagination.page_map[stateclone.active_page_number].is_active = false;

    let new_data: IpageActiveSet | null = Table.setPageActive(stateclone.pagination, page_number);

    this.setComponentState(new_data);

    //Set up these values to null, so it frees memory
    stateclone = null;
    new_data = null;
  }


  private setComponentState(data_set: IpageActiveSet) {

    this.setState({
      //Holds the entire data of the pagination
      pagination: data_set.table_links,
      forward_button_clickable: data_set.forward_button_clickable,
      back_button_clickable: data_set.back_button_clickable,
      current_rows: data_set.current_rows,
      active_page_number: data_set.active_page_number

    });
  }


  protected static setPageActive(data: ItableLinks, page_number: number): IpageActiveSet {
    var verify_data = { ...data };
    var back_button_clickable = false;
    var forward_button_clickable = false;
    var current_rows: Irow[] = [];
    if (verify_data.page_number_store.length > 0) {

      verify_data.page_map[page_number].is_active = true;

      //Determine if the back and forward buttons are clickable from the active link
      back_button_clickable = verify_data.page_map[page_number].back_button_clickable;
      forward_button_clickable = verify_data.page_map[page_number].forward_button_clickable;

      // The Rows to display
      current_rows = verify_data.page_map[page_number].page_row_array;
    }

    return {
      table_links: verify_data,
      back_button_clickable,
      forward_button_clickable,
      current_rows,
      active_page_number: page_number

    };
  }


  public render() {
    const props = { ...this.props };
    const display_columns = props.columns.filter((column: Icolumn) => {
      //Dont show columns the developer indicated should be false
      return column.use_in_display !== false;
    });

    return (
      <div className="bg-white pb-4 px-4 rounded-md w-full">
        <div className="flex justify-between w-full pt-6 ">
          <p className="ml-3" id="table-header">{props.table_header}</p>
          <ThreeDotsvg />
        </div>

        <SearchForm search_string={this.state.search_string} searchChange={this.searchChange} />
        <div className="overflow-x-auto mt-3">

          <table className="table-auto border-collapse w-full">
            <thead>
              <tr className="rounded-lg text-sm font-medium text-gray-700 text-left" style={{ fontSize: "0.9674rem" }}>

                {
                  display_columns.map((column: Icolumn, index: number) =>
                    <th key={index.toString()} className="px-4 py-2" style={{ backgroundColor: "#f8f8f8" }}>{column.use}</th>
                  )
                }

              </tr>
            </thead>
            <tbody className="text-sm font-normal text-gray-700">

              {
                (this.state.current_rows.length > 0 && this.state.current_rows.map((row: Irow, index: number) =>
                  <TableRow key={index.toString()} row={row} columns={display_columns} render={props.row_render} />
                )) ||

                <tr className="hover:bg-gray-100 border-b border-gray-200 ">
                  <td className="px-4 py-4 text-center"
                    colSpan={display_columns.length} >

                    {props.no_content_text}
                  </td>
                </tr>
              }

            </tbody>
          </table>
        </div>

        <div id="pagination" className="w-full flex justify-center border-t border-gray-100 pt-4 items-center">

          <Pagination {...this.state}
            backButtonOnclick={this.backButtonOnclick}
            forwardButtonOnclick={this.forwardButtonOnclick}
            pageNumberClick={this.pageNumberClick}
          />
        </div>
      </div>
    );
  }
}


function Pagination(props: IpaginateProps) {

  return (

    <div id="pagination" className="w-full flex justify-center pt-4 items-center">

      <LeftSvg onClick={props.backButtonOnclick} className={`h-3 w-3 fill-current previous-button ${props.back_button_clickable ? 'cursor-pointer text-blue-500' : 'text-gray-700 cursor-not-allowed'}`} />
      {
        props.pagination.page_number_store.map((page_number) => {
          return <p
            onClick={(event) => { props.pageNumberClick(event, page_number) }}
            key={page_number}
            className={`leading-relaxed 
                       mx-2 hover:text-blue-600 text-sm 
                       ${props.pagination.page_map[page_number].is_active ? 'text-blue-600 cursor-not-allowed' : 'text-gray-700 cursor-pointer'}`} >
            {page_number}
          </p>
        })
      }

      <RightSvg onClick={props.forwardButtonOnclick} className={`h-3 w-3 fill-current next-button ${props.forward_button_clickable ? 'cursor-pointer text-blue-500' : 'text-gray-700 cursor-not-allowed'}`} />
    </div>
  );
}


function TableRow(props: { row: Irow, columns: Icolumn[], render?: renderFunction }) {
  return (
    <tr className="hover:bg-gray-100 border-b border-gray-200 ">
      {
        props.columns.map((column: Icolumn, index: number) => {
          return <TableData key={index.toString()} col={column} row={props.row} render={props.render} />
        })
      }
    </tr>
  )
}


function SearchForm(props: { search_string: string, searchChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  // value={props.search_string}

  return (
    <div className="w-full flex justify-end px-2 mt-2">
      <div className="w-full sm:w-64 inline-block relative ">
        <input onChange={props.searchChange} type="text" name="search form" className="leading-snug border border-gray-300 block w-full appearance-none bg-gray-100 text-sm text-gray-600 py-1 px-4 pl-8 rounded-lg" placeholder="Search" />

        <div className="pointer-events-none absolute pl-3 inset-y-0 left-0 flex items-center px-2 text-gray-300">

          <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.999 511.999">
            <path d="M508.874 478.708L360.142 329.976c28.21-34.827 45.191-79.103 45.191-127.309C405.333 90.917 314.416 0 202.666 0S0 90.917 0 202.667s90.917 202.667 202.667 202.667c48.206 0 92.482-16.982 127.309-45.191l148.732 148.732c4.167 4.165 10.919 4.165 15.086 0l15.081-15.082c4.165-4.166 4.165-10.92-.001-15.085zM202.667 362.667c-88.229 0-160-71.771-160-160s71.771-160 160-160 160 71.771 160 160-71.771 160-160 160z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function TableData(props: { col: Icolumn, row: Irow, render?: renderFunction }) {

  var display_value = utils.unwindObject(props.row, props.col.field);
  return (
    <td className="px-4 py-4">

      {
        (props.render && props.render(props.row, props.col, display_value)) || display_value
      }
    </td>
  )
}






