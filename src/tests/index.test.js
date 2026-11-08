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

  test("tbody gets the user's class and no stray 'undefined' class", () => {
    act(() => {
      render(<Table columns={col} rows={row} />, containHolder)
    })
    expect(containHolder.querySelector("tbody").classList.contains("undefined")).toBe(false)

    act(() => {
      render(<Table columns={col} rows={row} styling={{ table_body: { main: "my-body" } }} />, containHolder)
    })
    expect(containHolder.querySelector("tbody").classList.contains("my-body")).toBe(true)
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

  describe("CSV export", () => {
    // jsdom does not implement URL.createObjectURL / revokeObjectURL, so they are mocked here.
    // Clicking the generated <a> is mocked too, since jsdom does not implement navigation.
    const originalCreateObjectURL = window.URL.createObjectURL
    const originalRevokeObjectURL = window.URL.revokeObjectURL
    let anchorClick = null

    const clickExport = async () => {
      await act(async () => {
        ReactTestUtils.Simulate.click(document.querySelector("div.export-btn"))
        // let the async CSV generation and download finish
        await new Promise((resolve) => setTimeout(resolve, 0))
        await new Promise((resolve) => setTimeout(resolve, 0)) // runs after the download's cleanup timer
      })
    }

    beforeEach(() => {
      window.URL.createObjectURL = jest.fn(() => "blob:csv-file")
      window.URL.revokeObjectURL = jest.fn()
      anchorClick = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
    })

    afterEach(() => {
      window.URL.createObjectURL = originalCreateObjectURL
      window.URL.revokeObjectURL = originalRevokeObjectURL
      anchorClick.mockRestore()
    })

    test("Export function gets called when download button is clicked", async () => {
      act(() => {
        render(table_component(), containHolder)
      })

      expect(downloadFunc).not.toBeCalled()
      await clickExport()
      expect(downloadFunc).toBeCalled()
    })

    test("downloads the CSV through a temporary link", async () => {
      act(() => {
        render(table_component(), containHolder)
      })

      await clickExport()

      expect(window.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
      expect(anchorClick).toHaveBeenCalledTimes(1)
      const link = anchorClick.mock.instances[0]
      expect(link.getAttribute("href")).toBe("blob:csv-file")
      expect(link.getAttribute("download")).toBe("download.csv")
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("blob:csv-file")
      expect(document.body.contains(link)).toBe(false)
    })

    test("a failed export is logged instead of becoming an unhandled rejection", async () => {
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      window.URL.createObjectURL = jest.fn(() => { throw new Error("blocked") })
      act(() => {
        render(table_component(), containHolder)
      })

      await clickExport()

      expect(errorSpy).toHaveBeenCalledWith("react-tailwind-table: CSV export failed.", expect.any(Error))
      errorSpy.mockRestore()
    })
  })


  describe("No content text", () => {
    it("shows the default text when there are no rows", () => {
      act(() => {
        render(<Table columns={col} rows={[]} />, containHolder)
      })
      expect(containHolder.querySelector("tbody").textContent).toBe("No Data Availaible")
    })

    it("accepts a string", () => {
      act(() => {
        render(<Table columns={col} rows={[]} no_content_text="Nothing here" />, containHolder)
      })
      expect(containHolder.querySelector("tbody").textContent).toBe("Nothing here")
    })

    it("accepts a React element without a prop-type warning", () => {
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      act(() => {
        render(
          <Table columns={col} rows={[]} no_content_text={<span className="custom-empty">Custom empty</span>} />,
          containHolder
        )
      })
      expect(containHolder.querySelector("tbody .custom-empty").textContent).toBe("Custom empty")
      const propTypeWarnings = errorSpy.mock.calls.filter(args => args.join(" ").includes("no_content_text"))
      expect(propTypeWarnings).toHaveLength(0)
      errorSpy.mockRestore()
    })
  })

  describe("Translations and RTL", () => {
    const people = Array.from({ length: 12 }, (_, i) => ({ name: "Person " + i, age: 20 + i }))
    const people_cols = [{ field: "name", use: "Name" }, { field: "age", use: "Age" }]
    const checkFirstRow = () => {
      const box = containHolder.querySelector("tbody input[type=checkbox]")
      act(() => {
        ReactTestUtils.Simulate.change(box, { target: { checked: true } })
      })
    }

    it("keeps the English defaults", () => {
      act(() => {
        render(<Table columns={people_cols} rows={people} per_page={5} bulk_select_options={["delete"]} />, containHolder)
      })
      checkFirstRow()
      expect(containHolder.querySelector(".table-top-search input").getAttribute("placeholder")).toBe("SEARCH")
      expect(containHolder.querySelector(".bulk-select-dropdown option").textContent).toBe("Select ...")
      expect(containHolder.textContent.replace(/\s+/g, " ")).toContain("Showing 1 to 5 of 12 entries")
      expect(containHolder.firstChild.hasAttribute("dir")).toBe(false)
    })

    it("translates the search, bulk select and footer texts", () => {
      const pagination_info = jest.fn(({ from, to, total }) => <span className="info">{`${from}-${to} מתוך ${total}`}</span>)
      act(() => {
        render(
          <Table columns={people_cols} rows={people} per_page={5} bulk_select_options={["delete"]}
            search_placeholder="חיפוש" bulk_select_placeholder="בחר ..." pagination_info={pagination_info} />,
          containHolder
        )
      })
      checkFirstRow()
      expect(containHolder.querySelector(".table-top-search input").getAttribute("placeholder")).toBe("חיפוש")
      expect(containHolder.querySelector(".bulk-select-dropdown option").textContent).toBe("בחר ...")
      expect(pagination_info).toHaveBeenLastCalledWith({ from: 1, to: 5, total: 12 })
      expect(containHolder.querySelector(".info").textContent).toBe("1-5 מתוך 12")
      expect(containHolder.textContent).not.toContain("Showing")

      act(() => {
        ReactTestUtils.Simulate.click(containHolder.querySelector(".next-button"))
      })
      expect(pagination_info).toHaveBeenLastCalledWith({ from: 6, to: 10, total: 12 })
    })

    it("sets the dir attribute on the table container", () => {
      act(() => {
        render(<Table columns={people_cols} rows={people} dir="rtl" />, containHolder)
      })
      expect(containHolder.firstChild.getAttribute("dir")).toBe("rtl")
    })
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

