import utils from "../utilsClass";
import {row, col} from "../../example/src/table-data"


describe('Testing Utils Functions', () => {

	describe('debounce, trottle and limit test', function() {
		var debounced_function, throttled_function;
		// this.timeout(500);
		it('debounce testing', function(done) {
			// var callback = sinon.fake();
			const callback = jest.fn()

			//No matter how many times this function is called,
			//The callback should be called as far as the wait time is not exceeded
			debounced_function = utils.debounce(callback, 30);
			for (var i = 0; i < 2; i++) {
				debounced_function();
			}

			//Set the timeout to be more than 
			//that of the test scenario
			setTimeout(function() {
				// callback()
				expect(callback.mock.calls.length).toBe(1);
				done();
			}, 100);



		});


		it('throttle testing', function(done) {
			// var callback = sinon.fake();
			const callback = jest.fn()
			//Willl only becalled once within this time
			throttled_function = utils.throttle(callback, 30);
			for (var i = 0; i < 5; i++) {
				throttled_function();
			}


			//Set the timeout to be more than 
			//that of the test scenario
			setTimeout(function() {
				// callback()
				expect(callback.mock.calls.length).toBe(1);
				done();
			}, 40);


		});


	})

	describe("Trim functions test",()=>{

		test("short trim removes only one occurence of word",()=>{
			let word = " good man   ";
			word = utils.trim(word," ","");

			expect(word).toBe("good man   ")
		})

		test("left trim works as expected",()=>{
			let word = " hi-man";
			word = utils.ltrim(word,' ',"");

			expect(word).toBe("hi-man")
		})

		test("right trim works as expected",()=>{
			let word = "good man   ";
			word = utils.rtrim(word," ","", true);

			expect(word).toBe("good man")
		})
	})

	test("test stringtoRegEx function",()=>{

		let res = utils.stringtoRegEx("hi");

		expect(res).toBeInstanceOf(RegExp);
	})


	describe("testing my filterFunction function",()=>{
		it("returns a function", ()=>{
			let ret = utils.filterFunction("Oluebube Odogwu",col);
			expect(ret).toBeInstanceOf(Function)
		})

		it("returns true on correct search", ()=>{
			let ret = utils.filterFunction("Oluebube Odogwu",col);
			let isFound = row.filter(ret);

			expect(isFound.length).toBe(1)
		})

		it("returns no result  on wrong search", ()=>{
			let ret = utils.filterFunction("Dangbana Odogwu",col);
			let isFound = row.filter(ret);

			expect(isFound.length).toBe(0)
		})
		
	})


	it('Testing unwindObject', function() {

		var row = {
			id: 1,
			name: "Sadio Mane",

			play_name: {
				name: {
					fname: "Agbalagba",
					lname: "Adejo"
				},
				id: 2
			}
		}


		expect(utils.unwindObject(row, "play_name.name.fname")).toBe("Agbalagba");
	})


	it('Testing sanitizeRow', function() {

		var row = {
			id: 1,
			name: "Sadio Mane",

			play_name: {
				name: {
					fname: "Agbalagba",
					lname: "Adejo"
				},
				id: 2
			}
		};

		var columns = [
					    {
					        field: "id",
					        use: "Position"
					    },
					    {
					        use_in_search: false,
					        field: "name", //Object destructure
					        use: "Name"
					    },
					    {
					        field: "play_name.name.fname",
					        use: "First Name",
					        // use_in_search:false
					    }];

		var expected_result = {
			id: 1,
			"play_name.name.fname": "Agbalagba"
		}


		expect(utils.sanitizeRow(row, columns)).toEqual(expected_result);
	})


	it('isObjectEqual testing returns true', function() {
		var a = {
			me:"Fool",
			come:"No",
			tell:{
				no:{
					bigup:{
						NoMan:"Flight",
						weed:"smoke",
					}
				}
			}
		}

		var b =  {
			me:"Fool",
			come:"No",
			tell:{
				no:{
					bigup:{
						NoMan:"Flight",
						weed:"smoke",
					}
				}
			}
		}

		var c = ({...b}).me = "raster";
		expect(utils.isObjectEqual(a, b)).toBe(true);

		expect(utils.isObjectEqual(a, c)).toBe(false);

	})


	it('array with same object reference takes lesser time to deep typecheck equality', function() {

		var a = [{
			me:"Fool",
			come:"No",
			tell:{
				no:{
					bigup:{
						NoMan:"Flight",
						weed:"smoke",
					}
				}
			}
		},{
			me:"Fool",
			come:"No",
			canopy:{
				police:{
					come:"here"
				}
			},
			tell:{
				no:{
					bigup:{
						NoMan:"Flight",
						weed:"smoke",
					}
				}
			}
		},
		{
			me:"Fool",
			come:"No",
			canopy:{
				police:{
					come:"here"
				}
			}
		},
		]


		var c = [{
			me:"Fool",
			come:"No",
			tell:{
				no:{
					bigup:{
						NoMan:"Flight",
						weed:"smoke",
					}
				}
			}
		},{
			me:"Fool",
			come:"No",
			canopy:{
				police:{
					come:"here"
				}
			},
			tell:{
				no:{
					bigup:{
						NoMan:"Flight",
						weed:"smoke",
					}
				}
			}
		},
		{
			me:"Fool",
			come:"No",
			canopy:{
				police:{
					come:"here"
				}
			}
		},
		]
		var b =[...a]; 
		var start_time = performance.now();

		//I made more copies and concatenation of the arrays , so as to increase
		//The processing time

		//Array with DIFFERENT internal objects references
		var result_1 = utils.isObjectEqual([...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,
											...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a], 
										   [...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,
										    ...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c,...c]);

		var end_time = performance.now();

		var first_difference = end_time - start_time;

		// expect(end_time - start_time).toBe(start_time+" - "+end_time);

		var start_time = performance.now();

		
		//Array with THE SAME internal object reference
		var result_2 = utils.isObjectEqual([...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,
											...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a,...a], 
										   [...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,
										    ...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b,...b]);
        // (new Date()).getTime()
		var end_time = performance.now();

		var second_difference = end_time - start_time;

		//The both will be true
		expect(result_1).toBe(result_2);

		expect(first_difference).toBeGreaterThan(second_difference);
	});

	describe("Testing generateCSV function", ()=>{

		test("It returns a promise", () =>{
			const returned_value = utils.generateCSV(col,row);

			expect(returned_value).toBeInstanceOf(Promise);
		})

		test("Returned value resolves to downloadable Blob", async () =>{
			const returned_value = utils.generateCSV(col,row);

			expect(await returned_value).toBeInstanceOf(Blob);
		})

		test("Modify function is called as expected", async () =>{
			let mockCallback = jest.fn();
			await utils.generateCSV(col,row, mockCallback);

			expect(mockCallback.mock.calls.length).toBe(row.length * col.filter((data)=> data.use_in_export !== false).length );
		})
	})

});

