import { beforeAll, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren} from "../../mockups/child-mock-factory.js";
import {ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";

await init();

beforeAll(async () => {
    await import("../../../app/test/test.js");
})

describe ("table-view", async () => {
    let instance;
    let data;
    beforeEach(async () => {
        instance = document.createElement("div");
        instance.innerHTML = "Hello World"
        data = [
            {title:"title 1", site: "A21", isActive: true},
            {title:"title 2", site: "A21", isActive: true},
            {title:"title 3", site: "A11", isActive: true},
            {title:"title 4", site: "A11", isActive: false},
            {title:"title 5", site: "A11", isActive: false},
            {title:"title 6", site: "A11", isActive: true},
            {title:"title 7", site: "A31", isActive: false},
            // {title:"title 8", site: [{site1: "A77", siteB:"B77"}], isActive: true}
        ]
    })

    it ("init", async () => {
        assertEquals(instance.innerHTML, "Hello World");
    })

    // it ("change", async() => {
    //     assertEquals(instance.value, 1);
    //     const plusMock = new ElementMock("svg");
    //     const minusMock = new ElementMock("svg");
    //
    //     plusMock.dataset.action = "increment";
    //     minusMock.dataset.action = "decrement";
    //
    //     await instance.clickedHandler(new EventMock(plusMock));
    //     assertEquals(instance.value, 2);
    //
    //     await instance.clickedHandler(new EventMock(minusMock));
    //     assertEquals(instance.value, 1);
    // })
    it ("add_data", async () =>{
        // const data = [
        //     {title:"title 1", site: "A21", isActive: true},
        //     {title:"title 2", site: "A21", isActive: true},
        //     {title:"title 3", site: "A11", isActive: true},
        //     {title:"title 4", site: "A11", isActive: false},
        //     {title:"title 5", site: "A11", isActive: false},
        //     {title:"title 6", site: "A11", isActive: true},
        //     {title:"title 7", site: "A31", isActive: false}
        // ]

        assertEquals(data[0].title, "title 1" )
        assertEquals(data[1].site, "A21" )
        assertEquals(data[2].isActive, true )
    })

    it ("log_data", async () =>{
        let titles = []
        let sites = []
        let a11 = []

        function checkData(object) {

            for(let item of object) {
                if(item.site === "A11"){
                    a11.push(item.title)
                }


                // if(typeof(item) == "object") {
                //     console.log(item.site)
                // }
            }
            // console.log(a11)
            assertEquals(a11.length, 4)

            // return titles
            // return sites;
            // return a11;
        }


        // console.log(checkData(data));
    })

    it("sort_data", async (object)=>{
        const result = await crs.call("data", "group", {
            source: data,
            fields: ["site"] // ,"isActive"
        });

        // console.log(result)

        object = result;
        for (let entry of Object.entries(object)) {
            // console.log(entry)
        }
        let newObj = Object.entries(object)
        for (let item of newObj) {

        }

    })
})