# react-tailwind-table

> A Responsive Table component Made with React js and Tailwind Css. Has Pagination and search ability.

[![NPM](https://img.shields.io/npm/v/react-tailwind-table.svg)](https://www.npmjs.com/package/react-tailwind-table) 
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


The core of the component is written in Typescript: Which brings alive the usage of `Typings` in this documentation. 
A few features that comes with this table include
-	1) 	Pagination
-	2)	Search
-	3)	Responsiveness
-	4)	Customizable table data display


> Contents

- [Installation](#install)
  - [Usage](#usage)
- Set up:
  - [Table Props](#table-props)
  	- [Rows](#rows)
  	- [Columns](#columns)
  - [Preact Apps](#preact-apps)
  - [Inferno Apps](#inferno-apps)

## Install

```bash
npm install --save react-tailwind-table
```

## Usage

```tsx
import React, { Component } from 'react'

import Table from 'react-tailwind-table'
import 'react-tailwind-table/dist/index.css'

class Example extends Component {
  render() {
    return <Table columns={[]} rows={[]} />
  }
}
```


## Table Props

The data from the props determines what will be displayed. There are about 2 compulsory props and 6 non-compulsory prop.
The interface defining the expected props is below.

```ts
interface Iprop {
	rows: Irow[],
	columns: Icolumn[],
	row_render?: renderFunction,
	per_page?: number,
	no_content_text?: string,
	debounce_search?: number,
	table_header?:string
}
```

### Rows

The rows prop determine the number of table rows available in the `<tbody/>` tag. This must be an array and is enforced using reacts `prop-types`  "PropTypes.array.isRequired" props checker.

The expected data types is an array of objects, each object having `string` keys.

```ts

interface Irow {
	[key: string]: any
}

type Irows  = Irow[]

//The full data format can be
var rows:Irows  = [
{
      id: 1,
      name: "Sadio Mane",
      country_id: 3,
      club_id: 2,
      front_end_position:{
        name:{
        	full_name:"Forward",
        	short_code:"FW"
        },
        id:2
      }
},
{
      id: 3,
      name: "Virgil VanDijk",
      country_id: 30,
      club_id: 2,
      front_end_position:{
        name:{
        	full_name:"Defence",
        	short_code:"DF"
        },
        id:2
      }
}
]
```


### Columns

The "columns" props is an array of objects that determines the details of the table headers and also determines which data from the `rows` prop is shown in the table. 

The  `Icolumn` interface contains two important properties which are 

The interface defining the table is below.



```ts

interface Icolumn {
	field: string, //This field can have a full stop(.) will allow us to read further into nested objects
	use: string, //This will be used to display in the table heading

	//Indicates that of this column should be used to search
	use_in_search?: boolean,

	//Indicates If this should be used displayed in the table header
	use_in_display?: boolean,

};

type Icolumns = Icolumn[]

/**
 * The Example rows above can have its column data looking thus.
 */



```
## License

MIT © [mklef121](https://github.com/mklef121)
