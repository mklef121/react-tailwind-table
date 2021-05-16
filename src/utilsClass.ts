import { Irow, Icolumn, IPaginated, ItableLinks, IretainPage, stringRenderFunc } from "./table-types"
/**
 * This class helps run minor utilities needed by our application to quickly process 
 * data and get stuff done
 */
export default class utilsClass {
    
    static regex_special = [
        "ˆ", "$", "*", "+", "?",
        "[", "]", "(", ")", "{",
        "}", "\\", ".", "\\t",
        "\\n", "\\r", "\\f",
        "\\v", "\\s", "\\w",
        "\\d", "\\D", "\\b",
        "\\W", "\\B", "\\0", "\\xxx",
        "\\xdd", "\\uxxxx", "\\cxxx"
    ]
    // new RegExp("\D");

    /**
     * Performs a left trim as done by 
     * {@link utilsClass.trim}
     * Thus removing a single or repeating character from the rightmost part of 
     * a string
     */
    static ltrim(trimString: string, regexp: string, replaceWith: string, more = false, allowRegex = false) {

        return utilsClass.trim(trimString, regexp, replaceWith, more, "l", allowRegex)
    }

    static isInteger(input: any) {
        return function(): (val: any) => boolean {
            return Number.isInteger || function(value) {
                return typeof value === 'number' &&
                    isFinite(value) &&
                    Math.floor(value) === value;
            }
        }()(input)
    }

    /**
     * Performs a right trim as done by 
     * {@link utilsClass.trim}
     * Thus removing a single or repeating character from the leftmost part of 
     * a string
     */
    static rtrim(trimString: string, regexp: string, replaceWith: string, more = false, allowRegex = false) {

        return utilsClass.trim(trimString, regexp, replaceWith, more, "r", allowRegex)
    }


    /**
     * Trims a sertain character from a string. This does both left and right trimming
     *
     * @param trimString  The string to be trimmed.
     * @param regexp A character to remove from the string.
     * @param replaceWith  The character or string to put in place of the replaced string.
     * @param more  if `true`, then it replacement occures for more than a single occurence, else it replaces just 
     * One occurence.
     ** @param dir  Decides if it should be a right or left trim
     ** @param allowRegex  Does not escape input search element
     * 
     */
    static trim(trimString: string, regexp: string, replaceWith: string, more = false, dir: "r" | "l", allowRegex = false) {

        if (!allowRegex && utilsClass.regex_special.includes(regexp)) regexp = "\\" + regexp;

        // if true, then remove more than one occurence of this string
        let add = more && regexp ? "*" : "?";

        let regMe;

        if (dir === "r") regMe = new RegExp("[" + regexp + "]" + add + "$");
        else regMe = new RegExp("^[" + regexp + "]" + add);

        return trimString.replace(regMe, replaceWith);
    }

    /**
     * A Function to determine if two objects are arrays are equal
     *
     * V = value, O= object, O = other,T = Type, OOT =  Other Object Type
     */
    static isObjectEqual<VT, OT, VOT extends Record<string, any>, OOT extends Record<string, any>>(value: VT[] | VOT, other: OT[] | OOT) {

        // Get the value type
        var type = Object.prototype.toString.call(value);

        // If the two objects are not the same type, return false
        if (type !== Object.prototype.toString.call(other)) return false;

        // If items are not an object or array, return false
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

        // Compare the length of the length of the two items
        var valueLen = type === '[object Array]' ? (value as VT[]).length : Object.keys(value as VOT).length;
        var otherLen = type === '[object Array]' ? (other as OT[]).length : Object.keys(other as OOT).length;
        if (valueLen !== otherLen) return false;

        //Some arrays or objects might be pointing to the same refence,
        // So we test their equality. It will help us not to loop inside objects multiple times 
        // @ts-ignore
        if (value === other) return true;

        // console.log("IF Equal");
        // Compare properties
        if (type === '[object Array]') {
            for (var i = 0; i < valueLen; i++) {

                if (utilsClass.compare((value as VT[])[i], (other as OT[])[i]) === false) return false;
            }
        } else {
            for (var key in value) {

                if (value.hasOwnProperty(key)) {
                    if (utilsClass.compare((value as VOT)[key], (other as OOT)[key]) === false) return false;
                }
            }
        }

        // If nothing failed, return true
        return true;

    };

    /**
     * Compare Primitives, Might be number, string, array , objects or  arrays
     */
    static compare<Item1T, Item2T, obj1T extends Record<string, any>, Obj2T extends Record<string, any>>(item1: string | number | Item1T[] | obj1T, item2: string | number | Item2T[] | Obj2T) {

        // Get the object type
        var itemType = Object.prototype.toString.call(item1);

        //I splitted this two comparison because of typescript typing.

        // If an array, compare recursively
        if (itemType === '[object Array]') {

            if (!utilsClass.isObjectEqual(item1 as Item1T[], item2 as Item2T[])) return false;
        }

        // If an object, compare recursively
        if (itemType === '[object Object]') {

            if (!utilsClass.isObjectEqual(item1 as obj1T, item2 as Obj2T)) return false;
        }

        // Otherwise, do a simple comparison
        else {

            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) return false;

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }

        }

        return true;
    }

    /**
     * Tests if this given value is even.
     * @returns {boolean}
     */
    static isEven(value: number) {
        return (value & 1) === 0;
    };

    /**
     * Internal function used to implement `utilsClass.throttle` and `utilsClass.debounce`.
     * @param {Function} func: function to be invoked.
     * @param {number} wait: The amount of milliseconds to wait before executing the said function.
     *
     * Borrowed from https://github.com/jashkenas/underscore/commit/9e3e067f5025dbe5e93ed784f93b233882ca0ffe
     */
    static limit<D extends Function>(func: D, wait: number, debounce: boolean): (...input: any) => void {
        var timeout: number | undefined;

        function throtBounce(this: D, input: any) {
            var context = this,
                args = arguments;
            var throttler = function() {
                timeout = undefined;
                func.apply(context, args);
            };
            //The first ever time this function will be called, timeout will be null
            //This first cleartimeout will clear nothing, subsequently, it will be clearing any setup
            //callback awaiting execution. Uses Javascript event loop
            if (debounce) window.clearTimeout(timeout);

            //The case of !timeout is to invoke the function just once for case of throttle
            if (debounce || !timeout) timeout = window.setTimeout(throttler, wait);
        };

        throtBounce.clear = () => window.clearTimeout(timeout);
        return throtBounce
    };


    /**
     *  Returns a function, that, when invoked, will only be triggered at most once
     *  during a given window of time.
     *
     *  TODO: allow to set if this callback should be invoked at the 
     *            "Beginning" or "End" of the time out
     *            Currently it is invoked at the end
     */
    static throttle = function(func: Function, wait: number) {
        return utilsClass.limit(func, wait, false);
    };

    /** 
     * Returns a "function"(rememeber to implement the function), that, 
     * as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds.
     */
    static debounce = function(func: Function, wait: number) {
        return utilsClass.limit(func, wait, true);
    };


    static unwindObject(obj: Record<string, any>, field: string): string {

        //The fields passed in might be "." delimmeted, so i 
        //Use a loop to enter the object and get out the final needed value

        //e,g {player:{me:{she:"woman"}}}
        //To get the value woman, the field should be 
        //"player.me.she"
        var fields = field.split('.');
        var field_length = fields.length;
        if (field_length <= 1) {
            return obj[field] as string;
        }

        var recuObje: any = { ...obj };

        var rolled_time: number = 0;


        while (rolled_time < field_length) {

            recuObje = recuObje[fields[rolled_time]];

            rolled_time++;
        }

        /*
        to understand this while loop
        assume a length of array is called things with three elements
        things 3 (0,1,2)
        n = 0
        i) things[0]  n=1
        ii) things[1]  n=2
        ii) things[2]  n=3
        */
        return recuObje;
    }

    static generateCSV(columns: Icolumn[], items: Irow[], exportModify?: stringRenderFunc) {

        let columns_array: string[] = [];
        let final_csv = "";

        columns.forEach(function(column: Icolumn) {

            if(column.use_in_export === false) return;

            columns_array.push(column.use ?? column.field)

        });

        final_csv = columns_array.join(",")+ '\n';

        return new Promise<Blob>(function(resolve){
            //Wrap this operation in a promise since it might be CPU intensive
            items.forEach(function(row: Irow) {
                let rowArray: Array<string> = [];
    
                columns.forEach(function(column: Icolumn) {
                    if(column.use_in_export === false) return;
                    var display_value = utilsClass.unwindObject(row, column.field);
                    if(exportModify) display_value = exportModify(row, column,display_value)
    
                    //to escape a comma in excel, I use this string. it was realized by i and dotun 
                    //on smart eye.
                    rowArray.push('"'+display_value+'"');
    
                });
    
                if (rowArray.length >0) final_csv = final_csv + rowArray.join(",")+ '\n';
            });
    
            var blob = new Blob([final_csv], {type: "octet/stream"});
            
            resolve(blob);
        });
        
    }


    /**
      * Recursively stringifies the values of an object, space separated, in an
      * SSR safe deterministic way (keys are storted before stringification)
      *
      *   ex:
      *    ```json 
      *     { b: 3, 
      *       c: { z: 'zzz', d: null, e: 2 }, 
      *       d: [10, 12, 11], 
      *       a: 'one' 
      *     }
      *    ```
      *   becomes
      *     'one 3 2 zzz 10 12 11'
      *
      * Primatives (numbers/strings) are returned as-is
      * Null and undefined values are filtered out
      * Dates are converted to their native string format
      */
    static stringifyObjectValues(val: Record<string, any> | any): string {
        if (typeof val === 'undefined' || val === null) {
            /* istanbul ignore next */
            return '';
        }

        if (val instanceof Object && !(val instanceof Date)) {
            // Arrays are also object, and keys just returns the array indexes
            // Date objects we convert to strings
            return Object.keys(val).sort()
                /* sort to prevent SSR issues on pre-rendered sorted tables */
                .filter(function(v) {
                    return v !== undefined && v !== null;
                })
                /* ignore undefined/null values */
                .map(function(k: string) {
                    return utilsClass.stringifyObjectValues(val[k]);
                }).join(' ');
        }

        return String(val);
    }


    //For each column that has its use_in_search property to be false
    //It will not be included in the search 
    static sanitizeRow(row: Irow, columns: Icolumn[]): object {
        var final_obj: Record<string, any> = {};
        
        for (var i = 0, len = columns.length; i < len; ++i) {
            if (columns[i].use_in_search === false) {
                continue;
            }
            //Fetch the data needed from the data row as we do with when displaying in table
            //We need to do this, since a row might be a nested object
            final_obj[columns[i].field] = utilsClass.unwindObject(row, columns[i].field);
        }

        return final_obj;
    }


    //This has Turned Irow interface to string now
    static stringifyRowValues(row: Irow, column: Icolumn[]): string {

        return (typeof row === "object" && row !== null) ?
            utilsClass.stringifyObjectValues(utilsClass.sanitizeRow(row, column)) :
            '';
    }

    /**
      *
      * Generates a filter function for the search string
      */
    static filterFunction(search_string: string, columns: Icolumn[]): (row: Irow) => boolean {
        /**
         * This searches all row values (and sub property values) in the entire (excluding
         * columns with use_in_search === false), because we convert the record to a space-separated
         *  string containing all the value properties (recursively).
         * Users can ignore filtering on specific fields, or on only certain fields,
         */
        return function ffn(row: Irow) {

            // Generated function returns true if the criteria matches part of
            // the serialized data, otherwise false
            var regExp = utilsClass.stringtoRegEx(search_string);
            return regExp.test(utilsClass.stringifyRowValues(row, columns));
        };


    }


    /**
       * Build the RegExp (no need for global flag, as we only need
       * to find the value once in the string)
       * @param {string} str: The input text
       * @return {RegExp} The returned regex match
       */
    static stringtoRegEx(str: string): RegExp {
        str = utilsClass.matchMultipleSpace(utilsClass.escapeRegExp(str))

        return new RegExp(".*" + str + ".*", 'i');
    }

    //white space representation in RegEX format
    static RX_SPACES$1 = /[\s\uFEFF\xA0]+/g;
    //convert contiguous whitespace to \s+ matches (Matches one or mutilples white spaces once)
    static matchMultipleSpace(str: string): string {
        return str.replace(utilsClass.RX_SPACES$1, '\\s+');
    }


    /**
     *  Borrowed this function from SENTRY(The remote error loggers)
     *
     * Escapes special characters, except for whitespace, in a string to be
     * used inside a regular expression as a string literal.
     * @param {string} text The string.
     * @return {string} The escaped string literal.
     */
    static escapeRegExp(text: string): string {
        // $& means the whole matched string
        return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    /**
     * This function helps me paginate data and present the paginated data to the table component
     *
     * @param {string} rows The rows of data to be paginated.
     * @param {string} per_page An integer 
     * @param {object} retain_expage_map Recently, I wanted to re-render components while using an updated row data(page_row_array)
     * but retaining all other property in the page_map. Thus I used this to do keep the 
     * former pagemap I will be getting the data from
     * @return {ItableLinks} The Final data containing the paginated data and an array of all
     *  pages involved in the pagination i.e 1,2,3,4,5 ..... n
     */
    static TableNumberLinks(rows: Irow[], per_page: number = 2, retain_expage_map?: IretainPage): ItableLinks {
        if (per_page < 1) throw Error("The rows per page must be greater than or equal to one(1)");

        var page_maximum = per_page

        var rows_length = rows.length;

        var number_of_pages = Math.ceil(rows_length / page_maximum);

        var end_of_this_record: number, beginning_of_next_record: number = 0,
            remaining_rows: number, current_page: number = 0,
            page_number_list: number[] = [],
            page_map: IPaginated = {},
            total_data_count = rows.length;

        for (var i = 0; i < number_of_pages; ++i) {
            current_page++;

            end_of_this_record = page_maximum * current_page; //Get the end of record on this page

            //if there are 19 records, page_maximum = 5, when current_page = 4,
            //this number will be -1(negative), This is an instance
            remaining_rows = rows_length - end_of_this_record; //this can be negative

            page_number_list.push(current_page);

            var page_row_array: Irow[] | null = rows.slice(beginning_of_next_record, end_of_this_record);

            page_map[current_page] = {
                page_row_array: page_row_array,
                back_button_clickable: current_page === 1 ? false : true,
                forward_button_clickable: false,
                is_active: retain_expage_map ? retain_expage_map.active_number === current_page : current_page === 1,
                from_index: beginning_of_next_record,

                checked_set: retain_expage_map && retain_expage_map.page_map ?
                    retain_expage_map.page_map[current_page].checked_set : new Set()
            }

            //check if there is a next page
            if (remaining_rows > 0) {
                page_map[current_page].forward_button_clickable = true;
            }
            //Delete the reference to this array here, So thr Gabage collector does not 
            //Work too hard
            page_row_array = null;

            //Set the beginning of the next iteration
            beginning_of_next_record = end_of_this_record;
        }

        return {
            page_map,
            page_number_list,
            total_data_count
        }
    }

}