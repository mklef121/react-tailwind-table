import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import Table from '../index'
import ReactTestUtils, { act } from 'react-dom/test-utils'
import {row, col, full_table_styling} from "../../example/src/table-data"


// https://reactjs.org/docs/test-utils.html#simulate
//Simulate functions gotten here

let containHolder = null;
let searchFunc = null;
let downloadFunc = null;
let tableBulkClick = null;

describe('Table Component ', () => {
  
  beforeEach(() => {
    // setup a DOM element as a render target
    containHolder = document.createElement('div')
    document.body.appendChild(containHolder)

    searchFunc = jest.fn();
    downloadFunc = jest.fn();
    tableBulkClick = jest.fn((e) => console.log(e))
  })

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(containHolder)
    containHolder.remove()
    containHolder = null
    searchFunc = null
    downloadFunc = null
    tableBulkClick = null
  })

  test("Table Renders",() => {
    
    act(() =>{
      render(table_component(), containHolder);
    })

    expect(containHolder.querySelector("table")).toBeInstanceOf(HTMLTableElement);
  })


  it('Hows Header Title', () => {
    act(() => {
      render(
        table_component(),
        containHolder
      )
    })

    expect(containHolder.querySelector('.react-table-top-caption').textContent).toBe('My Table Is Good')
  })

  it('Shows Search Components', () => {
    act(() => {
      render(table_component(),containHolder)
    })

    expect(containHolder.querySelector('.table-top-search input')).toBeInstanceOf(HTMLInputElement);
  })

  test("Export function gets called when download button is clicked",() => {
    // expect.assertions(1);
    act(() =>{
      render(table_component(), containHolder);
    })
    const downloadBtn = document.querySelector("div.export-btn");

    expect(downloadFunc).not.toBeCalled();
    act(() => {
      ReactTestUtils.Simulate.click(downloadBtn);
      
    });
    
    expect(downloadFunc).toBeCalled();
  })


  describe("Table head tests", ()=>{

    it("shows exact column as described it col prop",()=>{

      act(()=>{
        render(table_component([]), containHolder);
      })

     let res =  document.querySelectorAll("table thead tr th ");
    //  console.log(res.length, col.filter((data => data.use_in_display !== false )).length,"true");
     expect(col.filter((data => data.use_in_display !== false )).length).toBe(res.length)
     
    })

    it("shows plus 1 column for table head due to bulk action option",()=>{

      act(()=>{
        render(table_component(), containHolder);
      })

     let res =  document.querySelectorAll("table thead tr th");
     expect(col.filter((data => data.use_in_display !== false )).length + 1).toBe(res.length)
     
    })
  })

  describe("Bulk action api",() => {
    test("Clicking on select all marks all child boxes",() => {
      act(()=>{
        render(table_component(), containHolder);
      })

      let bulkSelect =  document.querySelector("table thead tr th .bulk-checkbox");
      let checkedInput = document.querySelectorAll('tbody input[type="checkbox"]:checked');
      expect(checkedInput.length).toBe(0);

      act(()=>{
        ReactTestUtils.Simulate.click(bulkSelect);
      })
      let checked = document.querySelectorAll('tbody input[type="checkbox"]:checked');
      let allInputs = document.querySelectorAll('tbody input[type="checkbox"]');
      
      expect(checked.length).toBe(allInputs.length);
    })

    test("Checking few checboxes makes the interminate select all appear",() => {
      act(()=>{
        render(table_component(), containHolder);
      })

      let bulkSelect =  document.querySelector("table thead tr th .bulk-checkbox");
      let indeterminate =  document.querySelector("table thead tr th .bulk-checkbox.indeterminate");
      expect(indeterminate).toBe(null);

      act(()=>{
        ReactTestUtils.Simulate.click(bulkSelect);
      })
      let allInputs = document.querySelectorAll('tbody input[type="checkbox"]');

      act(()=>{
        ReactTestUtils.Simulate.change(allInputs[0],{target:{checked:false}});
        // allInputs[0].checked = false;
      })

      act(()=>{
        
      })
      
      // console.log(allInputs[0]);
      indeterminate =  document.querySelector("table thead tr th .bulk-checkbox.indeterminate");
      
      expect(indeterminate).toBeInstanceOf(SVGSVGElement);
  
    })

    test("changing select option for bulk action and clicking on bulk action",() => {
      act(()=>{
        render(table_component(), containHolder);
      })

      let bulkSelect =  document.querySelector("table thead tr th .bulk-checkbox");

      act(()=>{
        ReactTestUtils.Simulate.click(bulkSelect);
      })

      let dropdown =  document.querySelector(".bulk-select-dropdown select");
      
      act(()=>{
        //set the first as selected
        dropdown.children[1].selected = true;
      })

      expect(dropdown.value).toBe("hello");
    })
  })

  it('Number of Table Row <tr/> is equivalent to per_page props length', () => {
    //As set in the table components
    var page_num = 7
    act(() => {
      render(
        table_component(),
        containHolder
      )
    })

    expect(containHolder.querySelectorAll('tbody tr').length).toBe(page_num)
  })

  it('NEXT page button Clicks', () => {
    var page_num = 2
     act(()=>{
        render(table_component(), containHolder);
      })

    //The first row object has this name
    expect(containHolder.innerHTML).toContain('Miracle Nwabueze')


    //This is the 8th object, and per page is 7
    expect(containHolder.innerHTML).not.toContain("Oluebube Odogwu")

    var next_button = containHolder.querySelector('.next-button')

    var clickEvent = document.createEvent('CustomEvent')
    clickEvent.initCustomEvent('click', true, true, null)

    act(() => {
      next_button.dispatchEvent(clickEvent)
    })

    expect(containHolder.innerHTML).toContain('Oluebube Odogwu')
    expect(containHolder.innerHTML).not.toContain("Miracle Nwabueze")
  })
})

function table_component(bulk_actions=["hello","hi","cool"]){
  return <Table columns={col} rows={row} 
  per_page={7} table_header="My Table Is Good" 
  bulk_select_options={bulk_actions}
  show_search ={true}
  // export_csv_file = "FuckThisShit"
  on_bulk_action={tableBulkClick} 
  // should_export={true}
  on_search = {searchFunc}
  export_modify={downloadFunc}
  striped={true}
  bordered={true}
  hovered={true}
  styling={full_table_styling}
  // row_render ={this.rowcheck}
  ></Table>
}

