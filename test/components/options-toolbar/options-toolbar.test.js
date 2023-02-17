import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";
import {createChildrenFromHtml} from "../../mockups/child-mock-factory.js";

await init();

beforeAll(async () => {
    await import("../../../components/options-toolbar/options-toolbar.js");
})

describe ("options-toolbar tests", async () => {
    let instance;
    let button1;
    let button2;
    let marker;
    let parent;


    beforeEach(async () => {
        instance = document.createElement("options-toolbar");
        createChildrenFromHtml(instance, [
            '<div class="marker"></div>',
            '<div class="parent"><slot></slot></div>'
        ].join(" "))

        marker = instance.shadowRoot.querySelector(".marker");
        marker.classList.add("marker");
        parent = instance.shadowRoot.querySelector(".parent");
        parent.classList.add("parent");

        // button1 = document.createElement("button");
        // button1.id = "button1";
        // button1.textContent = "button1";
        // button2 = document.createElement("button");
        // button2.id = "button2";
        // button2.textContent = "button2";
        // instance.appendChild(button1);
        // instance.appendChild(button2);
        //
        //
        //
        // await instance.connectedCallback();
        let clasname = marker.classList;
        console.log(clasname);
    })

    afterEach(async () => {
        await instance.disconnectedCallback();
    })

    it("instance is not null", async () => {
        assert(instance !== null);

    });

    it("expand and collapse on click", async () => {

    })

    it("check for header content", async () => {


    });

    it("keypress to expand and collapse", async () => {

    })
});