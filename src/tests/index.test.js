import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import Table from '../table'
import { act } from 'react-dom/test-utils'

describe('Table Component', () => {
  let container = null

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container)
    container.remove()
    container = null
  })

  it('Header Title Shows', () => {
    act(() => {
      render(
        <Table
          columns={column()}
          rows={fakePlayers()}
          table_header='Test Table'
          per_page={2}
        />,
        container
      )
    })

    expect(container.querySelector('#table-header').textContent).toBe(
      'Test Table'
    )
  })

  it('Number of Table Row <tr/> is equivalent to per_page props length', () => {
    var page_num = 2
    act(() => {
      render(
        <Table
          columns={column()}
          rows={fakePlayers()}
          table_header='Test Table'
          per_page={page_num}
        />,
        container
      )
    })

    expect(container.querySelectorAll('tbody tr').length).toBe(page_num)
  })

  it('NEXT page button Clicks', () => {
    var page_num = 2
    act(() => {
      render(
        <Table
          columns={column()}
          rows={fakePlayers()}
          table_header='Test Table'
          per_page={page_num}
        />,
        container
      )
    })

    expect(container.innerHTML).toContain('Sadio Mane')

    var next_button = container.querySelector('.next-button')

    // .not.toContain toNotContain
    expect(container.innerHTML).not.toContain('Robertor Fermino')
    var clickEvent = document.createEvent('CustomEvent')
    clickEvent.initCustomEvent('click', true, true, null)

    act(() => {
      next_button.dispatchEvent(clickEvent)
    })

    expect(container.innerHTML).toContain('Robertor Fermino')
  })
})

function column() {
  return [
    {
      field: 'front_end_position.name',
      use: 'Position'
    },
    {
      // use_in_display: false,
      field: 'name', // Object destructure
      use: 'Name'
    },

    {
      field: 'created_at',
      use: 'Action'
      // use_in_search:false
    }
  ]
}

function fakePlayers() {
  return [
    {
      id: 1,
      name: 'Sadio Mane',
      country_id: 3,
      club_id: 2,
      position_id: 1,
      shirt_number: '10',
      created_by: 2,
      deleted_at: null,
      created_at: '12/12/12 15:00:00',
      updated_at: '12/12/12 15:00:00',
      is_defender: false,
      is_midfielder: false,
      is_forward: true,
      is_goalkeeper: false,
      front_end_position: {
        name: 'attach',
        id: 2
      }
    },
    {
      id: 2,
      name: 'Mohammed Sala',
      country_id: 3,
      club_id: 2,
      position_id: 1,
      shirt_number: '11',
      created_by: 2,
      deleted_at: null,
      created_at: '12/12/12 15:00:00',
      updated_at: '12/12/12 15:00:00',
      is_defender: false,
      is_midfielder: false,
      is_forward: true,
      is_goalkeeper: false,
      front_end_position: {
        name: 'Forward',
        id: 4
      }
    },
    {
      id: 3,
      name: 'Robertor Fermino',
      country_id: 3,
      club_id: 2,
      position_id: 1,
      shirt_number: '8',
      created_by: 2,
      deleted_at: null,
      created_at: '12/12/12 15:00:00',
      updated_at: '12/12/12 15:00:00',
      is_defender: false,
      is_midfielder: false,
      is_forward: true,
      is_goalkeeper: false,
      front_end_position: {
        name: 'Defence',
        id: 9
      }
    }
  ]
}
