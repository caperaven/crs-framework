import {describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assertEquals} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {CalendarHelperMethods} from "../../../components/calendar/calendar-helper-methods.js";

await init();

describe("CalendarHelperMethods Sunday to Monday test", async () => {
    // //populate year array test
    // it('array should always contain 201 years starting 100 year before and after current year', async() =>{
    //
    //     //arrange
    //     const fixedNumberOfYears = 201;
    //     const year = 2022;
    //     //act
    //     const arrayOfYears = (await CalendarHelperMethods.populateYears(year)).length;
    //     //assert
    //     assertEquals(arrayOfYears,fixedNumberOfYears);
    //
    // });
    //
    // it('should return an array of dates for September 2022', async() => {
    //     //arrange
    //     const year = 2022;
    //     const month = 8;
    //     const weekType = "Sunday";
    //     const expectedDates =  [
    //         {
    //             date0: {date: new Date(year,month,28).toISOString(), day: 28 } ,
    //             date1: {date: new Date(year,month,29).toISOString(), day: 29 },
    //             date2: {date: new Date(year,month,30).toISOString(), day: 30 },
    //             date3: {date: new Date(year,month,31).toISOString(), day: 31 },
    //             date4: {date: new Date(year,month,1).toISOString(), day: 1 },
    //             date5: {date: new Date(year,month,2).toISOString(), day: 2 },
    //             date6: {date: new Date(year,month,3).toISOString(), day: 3 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,4).toISOString(), day: 4 } ,
    //             date1: {date: new Date(year,month,5).toISOString(), day: 5 },
    //             date2: {date: new Date(year,month,6).toISOString(), day: 6 },
    //             date3: {date: new Date(year,month,7).toISOString(), day: 7 },
    //             date4: {date: new Date(year,month,8).toISOString(), day: 8 },
    //             date5: {date: new Date(year,month,9).toISOString(), day: 9 },
    //             date6: {date: new Date(year,month,10).toISOString(), day: 10 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,11).toISOString(), day: 11 } ,
    //             date1: {date: new Date(year,month,12).toISOString(), day: 12 },
    //             date2: {date: new Date(year,month,13).toISOString(), day: 13 },
    //             date3: {date: new Date(year,month,14).toISOString(), day: 14 },
    //             date4: {date: new Date(year,month,15).toISOString(), day: 15 },
    //             date5: {date: new Date(year,month,16).toISOString(), day: 16 },
    //             date6: {date: new Date(year,month,17).toISOString(), day: 17 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,18).toISOString(), day: 18 } ,
    //             date1: {date: new Date(year,month,19).toISOString(), day: 19 },
    //             date2: {date: new Date(year,month,20).toISOString(), day: 20 },
    //             date3: {date: new Date(year,month,21).toISOString(), day: 21 },
    //             date4: {date: new Date(year,month,22).toISOString(), day: 22 },
    //             date5: {date: new Date(year,month,23).toISOString(), day: 23 },
    //             date6: {date: new Date(year,month,24).toISOString(), day: 24 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,25).toISOString(), day: 25 } ,
    //             date1: {date: new Date(year,month,26).toISOString(), day: 26 },
    //             date2: {date: new Date(year,month,27).toISOString(), day: 27 },
    //             date3: {date: new Date(year,month,28).toISOString(), day: 28 },
    //             date4: {date: new Date(year,month,29).toISOString(), day: 29 },
    //             date5: {date: new Date(year,month,30).toISOString(), day: 30 },
    //             date6: {date: new Date(year,month,1).toISOString(), day: 1 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,2).toISOString(), day: 2 } ,
    //             date1: {date: new Date(year,month,3).toISOString(), day: 3 },
    //             date2: {date: new Date(year,month,4).toISOString(), day: 4 },
    //             date3: {date: new Date(year,month,5).toISOString(), day: 5 },
    //             date4: {date: new Date(year,month,6).toISOString(), day: 6 },
    //             date5: {date: new Date(year,month,7).toISOString(), day: 7 },
    //             date6: {date: new Date(year,month,8).toISOString(), day: 8 }
    //         }
    //     ]
    //     //act
    //     const actualDates = (await CalendarHelperMethods.getDatesForMonths(year,month,weekType));
    //
    //     //assert
    //     assertEquals(actualDates,expectedDates);
    //
    // })

    it('should return an array of dates for year month October 2022', async() => {
        //arrange
        const year = 2022;
        const month = 9;
        const weekType = "Sunday";
        const expectedDates = {
            week1: {
                day1: { value: 25 } , day2: { value: 26 }, day3: { value: 27 }, day4: { value: 28 }, day5: { value: 29 },
                day6: { value: 30 }, day7: { value: 1 }
            },
            week2: {

                day1: { value: 2 } , day2: { value: 3 }, day3: { value: 4 }, day4: { value: 5 }, day5: { value: 6 },
                day6: { value: 7 }, day7: { value: 8 }
            },
            week3: {

                day1: { value: 9 } , day2: { value: 10 }, day3: { value: 11 }, day4: { value: 12 }, day5: { value: 13 },
                day6: { value: 14 }, day7: { value: 15 }
            },
            week4: {

                day1: { value: 16 } , day2: { value: 17 }, day3: { value: 18 }, day4: { value: 19 }, day5: { value: 20 },
                day6: { value: 21 }, day7: { value: 22 }
            },
            week5: {

                day1: { value: 23 } , day2: { value: 24 }, day3: { value: 25 }, day4: { value: 26 }, day5: { value: 27 },
                day6: { value: 28 }, day7: { value: 29 }
            },
            week6: {

                day1: { value: 30 } , day2: { value: 31 }, day3: { value: 1 }, day4: { value: 2 }, day5: { value: 3 },
                day6: { value: 4 }, day7: { value: 5 }
            }
        }


        //act
        const actualDates = (await CalendarHelperMethods.getDatesForMonths(year,month,weekType));

        //assert
        assertEquals(actualDates,expectedDates);
    })

    // it('should return an array of dates for leap year month February 2020', async() => {
    //     //arrange
    //     const year = 2020;
    //     const month = 1;
    //     const weekType = "Sunday";
    //     const expectedDates =  [
    //         {
    //             date0: {date: new Date(year,month,26).toISOString(), day: 26 } ,
    //             date1: {date: new Date(year,month,27).toISOString(), day: 27 },
    //             date2: {date: new Date(year,month,28).toISOString(), day: 28 },
    //             date3: {date: new Date(year,month,29).toISOString(), day: 29 },
    //             date4: {date: new Date(year,month,30).toISOString(), day: 30 },
    //             date5: {date: new Date(year,month,31).toISOString(), day: 31 },
    //             date6: {date: new Date(year,month,1).toISOString(), day: 1 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,2).toISOString(), day: 2 } ,
    //             date1: {date: new Date(year,month,3).toISOString(), day: 3 },
    //             date2: {date: new Date(year,month,4).toISOString(), day: 4 },
    //             date3: {date: new Date(year,month,5).toISOString(), day: 5 },
    //             date4: {date: new Date(year,month,6).toISOString(), day: 6 },
    //             date5: {date: new Date(year,month,7).toISOString(), day: 7 },
    //             date6: {date: new Date(year,month,8).toISOString(), day: 8 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,9).toISOString(), day: 9 } ,
    //             date1: {date: new Date(year,month,10).toISOString(), day: 10 },
    //             date2: {date: new Date(year,month,11).toISOString(), day: 11 },
    //             date3: {date: new Date(year,month,12).toISOString(), day: 12 },
    //             date4: {date: new Date(year,month,13).toISOString(), day: 13 },
    //             date5: {date: new Date(year,month,14).toISOString(), day: 14 },
    //             date6: {date: new Date(year,month,15).toISOString(), day: 15 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,16).toISOString(), day: 16 } ,
    //             date1: {date: new Date(year,month,17).toISOString(), day: 17 },
    //             date2: {date: new Date(year,month,18).toISOString(), day: 18 },
    //             date3: {date: new Date(year,month,19).toISOString(), day: 19 },
    //             date4: {date: new Date(year,month,20).toISOString(), day: 20 },
    //             date5: {date: new Date(year,month,21).toISOString(), day: 21 },
    //             date6: {date: new Date(year,month,22).toISOString(), day: 22 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,23).toISOString(), day: 23 } ,
    //             date1: {date: new Date(year,month,24).toISOString(), day: 24 },
    //             date2: {date: new Date(year,month,25).toISOString(), day: 25 },
    //             date3: {date: new Date(year,month,26).toISOString(), day: 26 },
    //             date4: {date: new Date(year,month,27).toISOString(), day: 27 },
    //             date5: {date: new Date(year,month,28).toISOString(), day: 28 },
    //             date6: {date: new Date(year,month,29).toISOString(), day: 29 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,1).toISOString(), day: 1 } ,
    //             date1: {date: new Date(year,month,2).toISOString(), day: 2 },
    //             date2: {date: new Date(year,month,3).toISOString(), day: 3 },
    //             date3: {date: new Date(year,month,4).toISOString(), day: 4 },
    //             date4: {date: new Date(year,month,5).toISOString(), day: 5 },
    //             date5: {date: new Date(year,month,6).toISOString(), day: 6 },
    //             date6: {date: new Date(year,month,7).toISOString(), day: 7 }
    //         }
    //     ]
    //     //act
    //     const actualDates = (await CalendarHelperMethods.getDatesForMonths(year,month,weekType));
    //
    //     //assert
    //     assertEquals(actualDates,expectedDates);
    // })

    // it('should return an array of dates for none leap year month February 2025', async() => {
    //     //arrange
    //     const year = 2025;
    //     const month = 1;
    //     const weekType = "Sunday";
    //     const expectedDates =  [
    //         {
    //             date0: {date: new Date(year,month,26).toISOString(), day: 26 } ,
    //             date1: {date: new Date(year,month,27).toISOString(), day: 27 },
    //             date2: {date: new Date(year,month,28).toISOString(), day: 28 },
    //             date3: {date: new Date(year,month,29).toISOString(), day: 29 },
    //             date4: {date: new Date(year,month,30).toISOString(), day: 30 },
    //             date5: {date: new Date(year,month,31).toISOString(), day: 31 },
    //             date6: {date: new Date(year,month,1).toISOString(), day: 1 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,2).toISOString(), day: 2 } ,
    //             date1: {date: new Date(year,month,3).toISOString(), day: 3 },
    //             date2: {date: new Date(year,month,4).toISOString(), day: 4 },
    //             date3: {date: new Date(year,month,5).toISOString(), day: 5 },
    //             date4: {date: new Date(year,month,6).toISOString(), day: 6 },
    //             date5: {date: new Date(year,month,7).toISOString(), day: 7 },
    //             date6: {date: new Date(year,month,8).toISOString(), day: 8 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,9).toISOString(), day: 9 } ,
    //             date1: {date: new Date(year,month,10).toISOString(), day: 10 },
    //             date2: {date: new Date(year,month,11).toISOString(), day: 11 },
    //             date3: {date: new Date(year,month,12).toISOString(), day: 12 },
    //             date4: {date: new Date(year,month,13).toISOString(), day: 13 },
    //             date5: {date: new Date(year,month,14).toISOString(), day: 14 },
    //             date6: {date: new Date(year,month,15).toISOString(), day: 15 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,16).toISOString(), day: 16 } ,
    //             date1: {date: new Date(year,month,17).toISOString(), day: 17 },
    //             date2: {date: new Date(year,month,18).toISOString(), day: 18 },
    //             date3: {date: new Date(year,month,19).toISOString(), day: 19 },
    //             date4: {date: new Date(year,month,20).toISOString(), day: 20 },
    //             date5: {date: new Date(year,month,21).toISOString(), day: 21 },
    //             date6: {date: new Date(year,month,22).toISOString(), day: 22 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,23).toISOString(), day: 23 } ,
    //             date1: {date: new Date(year,month,24).toISOString(), day: 24 },
    //             date2: {date: new Date(year,month,25).toISOString(), day: 25 },
    //             date3: {date: new Date(year,month,26).toISOString(), day: 26 },
    //             date4: {date: new Date(year,month,27).toISOString(), day: 27 },
    //             date5: {date: new Date(year,month,28).toISOString(), day: 28 },
    //             date6: {date: new Date(year,month,1).toISOString(), day: 1 }
    //         },
    //         {
    //             date0: {date: new Date(year,month,2).toISOString(), day: 2 } ,
    //             date1: {date: new Date(year,month,3).toISOString(), day: 3 },
    //             date2: {date: new Date(year,month,4).toISOString(), day: 4 },
    //             date3: {date: new Date(year,month,5).toISOString(), day: 5 },
    //             date4: {date: new Date(year,month,6).toISOString(), day: 6 },
    //             date5: {date: new Date(year,month,7).toISOString(), day: 7 },
    //             date6: {date: new Date(year,month,8).toISOString(), day: 8 }
    //         }
    //     ]
    //     //act
    //     const actualDates = (await CalendarHelperMethods.getDatesForMonths(year,month,weekType));
    //
    //     //assert
    //     assertEquals(actualDates,expectedDates);
    // })

});
//
// describe("CalendarHelperMethods Monday to Sunday test", async () => {
//     it('should return an array of dates for none leap year month February 2025 ', async() => {
//         //arrange
//         const year = 2025;
//         const month = 1;
//         const weekType = "Monday"
//         const expectedDates =  [
//             {
//                 date0: {date: new Date(year,month,27).toISOString(), day: 27 } ,
//                 date1: {date: new Date(year,month,28).toISOString(), day: 28 },
//                 date2: {date: new Date(year,month,29).toISOString(), day: 29 },
//                 date3: {date: new Date(year,month,30).toISOString(), day: 30 },
//                 date4: {date: new Date(year,month,31).toISOString(), day: 31 },
//                 date5: {date: new Date(year,month,1).toISOString(), day: 1 },
//                 date6: {date: new Date(year,month,2).toISOString(), day: 2 }
//             },
//             {
//                 date0: {date: new Date(year,month,3).toISOString(), day: 3 } ,
//                 date1: {date: new Date(year,month,4).toISOString(), day: 4 },
//                 date2: {date: new Date(year,month,5).toISOString(), day: 5 },
//                 date3: {date: new Date(year,month,6).toISOString(), day: 6 },
//                 date4: {date: new Date(year,month,7).toISOString(), day: 7 },
//                 date5: {date: new Date(year,month,8).toISOString(), day: 8 },
//                 date6: {date: new Date(year,month,9).toISOString(), day: 9 }
//             },
//             {
//                 date0: {date: new Date(year,month,10).toISOString(), day: 10 } ,
//                 date1: {date: new Date(year,month,11).toISOString(), day: 11 },
//                 date2: {date: new Date(year,month,12).toISOString(), day: 12 },
//                 date3: {date: new Date(year,month,13).toISOString(), day: 13 },
//                 date4: {date: new Date(year,month,14).toISOString(), day: 14 },
//                 date5: {date: new Date(year,month,15).toISOString(), day: 15 },
//                 date6: {date: new Date(year,month,16).toISOString(), day: 16 }
//             },
//             {
//                 date0: {date: new Date(year,month,17).toISOString(), day: 17 } ,
//                 date1: {date: new Date(year,month,18).toISOString(), day: 18 },
//                 date2: {date: new Date(year,month,19).toISOString(), day: 19 },
//                 date3: {date: new Date(year,month,20).toISOString(), day: 20 },
//                 date4: {date: new Date(year,month,21).toISOString(), day: 21 },
//                 date5: {date: new Date(year,month,22).toISOString(), day: 22 },
//                 date6: {date: new Date(year,month,23).toISOString(), day: 23 }
//             },
//             {
//                 date0: {date: new Date(year,month,24).toISOString(), day: 24 } ,
//                 date1: {date: new Date(year,month,25).toISOString(), day: 25 },
//                 date2: {date: new Date(year,month,26).toISOString(), day: 26 },
//                 date3: {date: new Date(year,month,27).toISOString(), day: 27 },
//                 date4: {date: new Date(year,month,28).toISOString(), day: 28 },
//                 date5: {date: new Date(year,month,1).toISOString(), day: 1 },
//                 date6: {date: new Date(year,month,2).toISOString(), day: 2 }
//             },
//             {
//                 date0: {date: new Date(year,month,3).toISOString(), day: 3 } ,
//                 date1: {date: new Date(year,month,4).toISOString(), day: 4 },
//                 date2: {date: new Date(year,month,5).toISOString(), day: 5 },
//                 date3: {date: new Date(year,month,6).toISOString(), day: 6 },
//                 date4: {date: new Date(year,month,7).toISOString(), day: 7 },
//                 date5: {date: new Date(year,month,8).toISOString(), day: 8 },
//                 date6: {date: new Date(year,month,9).toISOString(), day: 9 }
//             }
//         ]
//         //act
//         const actualDates = (await CalendarHelperMethods.getDatesForMonths(year,month,weekType));
//
//         //assert
//         assertEquals(actualDates,expectedDates);
//     })
//
//     it('should return an array of dates for January 2023 starting form ', async() =>{
//         //arrange
//         const year = 2023;
//         const month = 0;
//         const weekType = "Monday";
//         const expectedDates =  [
//             {
//                 date0: {date: new Date(year,month,26).toISOString(), day: 26 } ,
//                 date1: {date: new Date(year,month,27).toISOString(), day: 27 },
//                 date2: {date: new Date(year,month,28).toISOString(), day: 28 },
//                 date3: {date: new Date(year,month,29).toISOString(), day: 29 },
//                 date4: {date: new Date(year,month,30).toISOString(), day: 30 },
//                 date5: {date: new Date(year,month,31).toISOString(), day: 31 },
//                 date6: {date: new Date(year,month,1).toISOString(), day: 1 }
//             },
//             {
//                 date0: {date: new Date(year,month,2).toISOString(), day: 2 } ,
//                 date1: {date: new Date(year,month,3).toISOString(), day: 3 },
//                 date2: {date: new Date(year,month,4).toISOString(), day: 4 },
//                 date3: {date: new Date(year,month,5).toISOString(), day: 5 },
//                 date4: {date: new Date(year,month,6).toISOString(), day: 6 },
//                 date5: {date: new Date(year,month,7).toISOString(), day: 7 },
//                 date6: {date: new Date(year,month,8).toISOString(), day: 8 }
//             },
//             {
//                 date0: {date: new Date(year,month,9).toISOString(), day: 9 } ,
//                 date1: {date: new Date(year,month,10).toISOString(), day: 10 },
//                 date2: {date: new Date(year,month,11).toISOString(), day: 11 },
//                 date3: {date: new Date(year,month,12).toISOString(), day: 12 },
//                 date4: {date: new Date(year,month,13).toISOString(), day: 13 },
//                 date5: {date: new Date(year,month,14).toISOString(), day: 14 },
//                 date6: {date: new Date(year,month,15).toISOString(), day: 15 }
//             },
//             {
//                 date0: {date: new Date(year,month,16).toISOString(), day: 16 } ,
//                 date1: {date: new Date(year,month,17).toISOString(), day: 17 },
//                 date2: {date: new Date(year,month,18).toISOString(), day: 18 },
//                 date3: {date: new Date(year,month,19).toISOString(), day: 19 },
//                 date4: {date: new Date(year,month,20).toISOString(), day: 20 },
//                 date5: {date: new Date(year,month,21).toISOString(), day: 21 },
//                 date6: {date: new Date(year,month,22).toISOString(), day: 22 }
//             },
//             {
//                 date0: {date: new Date(year,month,23).toISOString(), day: 23 } ,
//                 date1: {date: new Date(year,month,24).toISOString(), day: 24 },
//                 date2: {date: new Date(year,month,25).toISOString(), day: 25 },
//                 date3: {date: new Date(year,month,26).toISOString(), day: 26 },
//                 date4: {date: new Date(year,month,27).toISOString(), day: 27 },
//                 date5: {date: new Date(year,month,28).toISOString(), day: 28 },
//                 date6: {date: new Date(year,month,29).toISOString(), day: 29 }
//             },
//             {
//                 date0: {date: new Date(year,month,30).toISOString(), day: 30 } ,
//                 date1: {date: new Date(year,month,31).toISOString(), day: 31 },
//                 date2: {date: new Date(year,month,1).toISOString(), day: 1 },
//                 date3: {date: new Date(year,month,2).toISOString(), day: 2 },
//                 date4: {date: new Date(year,month,3).toISOString(), day: 3 },
//                 date5: {date: new Date(year,month,4).toISOString(), day: 4 },
//                 date6: {date: new Date(year,month,5).toISOString(), day: 5 }
//             }
//         ]
//         //act
//         const actualDates = (await CalendarHelperMethods.getDatesForMonths(year,month,weekType));
//
//         //assert
//         assertEquals(actualDates,expectedDates)
//     })
//
//     it('should return an array of dates for September 2022', async() => {
//         //arrange
//         const year = 2022;
//         const month = 8;
//         const weekType = "Monday";
//         const expectedDates =  [
//             {
//                 date0: {date: new Date(year,month,29).toISOString(), day: 29 },
//                 date1: {date: new Date(year,month,30).toISOString(), day: 30 },
//                 date2: {date: new Date(year,month,31).toISOString(), day: 31 },
//                 date3: {date: new Date(year,month,1).toISOString(), day: 1 },
//                 date4: {date: new Date(year,month,2).toISOString(), day: 2 },
//                 date5: {date: new Date(year,month,3).toISOString(), day: 3 },
//                 date6: {date: new Date(year,month,4).toISOString(), day: 4 }
//             },
//             {
//                 date0: {date: new Date(year,month,5).toISOString(), day: 5 },
//                 date1: {date: new Date(year,month,6).toISOString(), day: 6 },
//                 date2: {date: new Date(year,month,7).toISOString(), day: 7 },
//                 date3: {date: new Date(year,month,8).toISOString(), day: 8 },
//                 date4: {date: new Date(year,month,9).toISOString(), day: 9 },
//                 date5: {date: new Date(year,month,10).toISOString(), day: 10 },
//                 date6: {date: new Date(year,month,11).toISOString(), day: 11 }
//             },
//             {
//                 date0: {date: new Date(year,month,12).toISOString(), day: 12 },
//                 date1: {date: new Date(year,month,13).toISOString(), day: 13 },
//                 date2: {date: new Date(year,month,14).toISOString(), day: 14 },
//                 date3: {date: new Date(year,month,15).toISOString(), day: 15 },
//                 date4: {date: new Date(year,month,16).toISOString(), day: 16 },
//                 date5: {date: new Date(year,month,17).toISOString(), day: 17 },
//                 date6: {date: new Date(year,month,18).toISOString(), day: 18 }
//             },
//             {
//                 date0: {date: new Date(year,month,19).toISOString(), day: 19 },
//                 date1: {date: new Date(year,month,20).toISOString(), day: 20 },
//                 date2: {date: new Date(year,month,21).toISOString(), day: 21 },
//                 date3: {date: new Date(year,month,22).toISOString(), day: 22 },
//                 date4: {date: new Date(year,month,23).toISOString(), day: 23 },
//                 date5: {date: new Date(year,month,24).toISOString(), day: 24 },
//                 date6: {date: new Date(year,month,25).toISOString(), day: 25 }
//             },
//             {
//                 date0: {date: new Date(year,month,26).toISOString(), day: 26 },
//                 date1: {date: new Date(year,month,27).toISOString(), day: 27 },
//                 date2: {date: new Date(year,month,28).toISOString(), day: 28 },
//                 date3: {date: new Date(year,month,29).toISOString(), day: 29 },
//                 date4: {date: new Date(year,month,30).toISOString(), day: 30 },
//                 date5: {date: new Date(year,month,1).toISOString(), day: 1 },
//                 date6: {date: new Date(year,month,2).toISOString(), day: 2 }
//             },
//             {
//                 date0: {date: new Date(year,month,3).toISOString(), day: 3 } ,
//                 date1: {date: new Date(year,month,4).toISOString(), day: 4 },
//                 date2: {date: new Date(year,month,5).toISOString(), day: 5 },
//                 date3: {date: new Date(year,month,6).toISOString(), day: 6 },
//                 date4: {date: new Date(year,month,7).toISOString(), day: 7 },
//                 date5: {date: new Date(year,month,8).toISOString(), day: 8 },
//                 date6: {date: new Date(year,month,9).toISOString(), day: 9 }
//             }
//         ]
//         //act
//         const actualDates = (await CalendarHelperMethods.getDatesForMonths(year,month,weekType));
//
//         //assert
//         assertEquals(actualDates,expectedDates);
//
//     })
// });
//
// describe("CalendarHelperMethods Previous and Next days test", async () =>{
//
//     it("should return and array of the previous months dates Sunday to Monday", async() => {
//         //arrange
//
//         //act
//
//         //assert
//     })
//     it("should return and array of the next months dates Sunday to Monday", async() => {
//         //arrange
//
//         //act
//
//         //assert
//     })
//     it("should return and array of the previous months dates Monday to Sunday", async() => {
//         //arrange
//
//         //act
//
//         //assert
//     })
//     it("should return and array of the next months dates Monday to Sunday", async() => {
//         //arrange
//
//         //act
//
//         //assert
//     })
//
// });