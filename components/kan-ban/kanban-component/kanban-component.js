import "./../cards-manager/cards-manager-actions.js";
// JHR: TODO remove when binding engine is updated
import "./../utils/inflation.js";
import "./../swim-lane/swim-lane.js";

export class KanbanComponent extends HTMLElement {

    #ul;
    #cardHeaderName;
    #cardRecordName;
    #swimLaneCreatedHandle = this.#swimLaneCreated.bind(this);
    #startScrollHandle = this.#startScroll.bind(this);
    #endScrollHandle = this.#endScroll.bind(this);
    #performSyncHandle = this.#performSync.bind(this);
    #inflateSwimLaneHandler = this.#inflateSwimLane.bind(this);
    #animateScrollEndHandler = this.#animateScrollEnd.bind(this);
    #itemSize;
    #scrolling = false;
    #lastEndScrollTime = null;
    #dataManagerNames = [];
    #currentElements = [];
    #refreshing = false;

    get pageItemCount() {
        return this.#ul.__virtualizationManager.pageItemCount;
    }

    get scrollPos() {
        return this.#ul.__virtualizationManager.scrollPos;
    }

    get topIndex() {
        return this.#ul.__virtualizationManager.topIndex;
    }

    get bottomIndex() {
        return this.#ul.__virtualizationManager.bottomIndex;
    }

    get rowMap() {
        return this.#ul.__virtualizationManager.rowMap;
    }

    get itemSize() {
        return this.#itemSize;
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        // 1. load templates before we replace the HTML
        await this.#loadTemplates();
        // 2, replace the html
        const css = `<link rel="stylesheet" href="${import.meta.url.replace(".js", ".css")}">`;
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.shadowRoot.innerHTML = `${css}${html}`;
        await this.load();
    }

    async #loadTemplates() {
        const headerTemplate = this.querySelector("#tplHeader");
        const recordTemplate = this.querySelector("#tplRecord");

        const headerInflateFn = await crs.binding.expression.inflationFactory(headerTemplate);
        const recordInflateFn = await crs.binding.expression.inflationFactory(recordTemplate);

        this.#cardHeaderName = `${this.id}-header`;
        this.#cardRecordName = `${this.id}-record`;

        await crs.call("cards_manager", "register", {
            name: this.#cardHeaderName,
            template: headerTemplate,
            inflationFn: headerInflateFn
        })

        await crs.call("cards_manager", "register", {
            name: this.#cardRecordName,
            template: recordTemplate,
            inflationFn: recordInflateFn
        });

        this.innerHTML = "";
    }

    async load() {
        requestAnimationFrame(async () => {
            await crs.call("component", "notify_loading", { element: this });
        });
    }

    async disconnectedCallback() {
        await crs.call("cards_manager", "unregister", {
            name: this.#cardHeaderName
        })

        await crs.call("cards_manager", "unregister", {
            name: this.#cardRecordName
        });

        await this.#disposeSwimLaneDataManagers();

        this.#cardHeaderName = null;
        this.#cardRecordName = null;
        this.#swimLaneCreatedHandle = null;
        this.#startScrollHandle = null;
        this.#endScrollHandle = null;
        this.#performSyncHandle = null;
        this.#inflateSwimLaneHandler = null;
        this.#itemSize = null;
        this.#scrolling = null;
        this.#lastEndScrollTime = null;
        this.#animateScrollEndHandler = null;
        this.#ul = null;
        this.#dataManagerNames = null;
        this.#currentElements = null;
    }

    async #dataManagerChange(change) {
        if (this[change.action] != null) {
            this[change.action](change);
        }
    }

    async initialize() {
        await crs.call("data_manager", "on_change", {
            manager: this.dataset.manager,
            callback: this.#dataManagerChange.bind(this)
        })

        this.#itemSize = Number(this.dataset.itemSize || 160);

        this.#ul = this.shadowRoot.querySelector(".swim-lanes-container");
        const template = this.shadowRoot.querySelector("#swimlane-template");

        await crs.call("virtualization", "enable", {
            element: this.#ul,
            manager: this.dataset.manager,
            itemSize: this.#itemSize,
            template,
            inflation: this.#inflateSwimLaneHandler,
            direction: "horizontal",
            callbacks: {
                createdCallback: this.#swimLaneCreatedHandle,
                onScrollStart: this.#startScrollHandle,
                onScrollEnd: this.#endScrollHandle,
                onPerformSync: this.#performSyncHandle
            }
        })

        this.dispatchEvent(new CustomEvent("change-settings", {
            // todo: open kan ban settings dialog
            detail: {
                manager: this.dataset.manager
                // pass on current state with all the info the settings needs.
            },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * @method swimlandCreated - when the swimlane is created set the attributes required for it to function.
     * @param element
     * @returns {Promise<void>}
     */
    async #swimLaneCreated(element) {
        element.firstElementChild.dataset.headerCard = this.#cardHeaderName;
        element.firstElementChild.dataset.recordCard = this.#cardRecordName;
        element.firstElementChild.dataset.cardSize = this.#itemSize;
    }

    /**
     * @method startScroll - the virtualization said we are staring to scroll so clean up and suspend actions until we end
     * @param args
     */
    async #startScroll() {
        this.#scrolling = true;

        await this.#clearSwimLaneDataManagers();

        // if this.#lastEndScrollTime is null it means we have not yet started the scroll timer.
        // start the scroll timer so that we only fire the scroll end if we have delayed enough.
        if (this.#lastEndScrollTime == null) {
            this.#lastEndScrollTime = performance.now();
            await this.#animateScrollEndHandler();
        }
    }

    /**
     * @method animateScrollEnd - the virtualization said we are done scrolling so, we can resume actions
     * The #endScroll set the time on when last the endScroll was fired.
     * If 200ms has gone by since the last endScroll it means that we have actually stopped scrolling.
     * At that point of time lets go make some updates to the UI.
     * @returns {Promise<number>}
     */
    async #animateScrollEnd() {
        const now = performance.now();

        if (now - this.#lastEndScrollTime < 100) {
            return requestAnimationFrame(this.#animateScrollEndHandler);
        }

        // this is the code that updates the data managers with the new records.
        // and also refreshes the virtualization on the currently visible elements.
        this.#scrolling = false;
        this.#lastEndScrollTime = null;
        await this.#updatePageDataManagers();
        await this.#performSyncPage();
    }

    /**
     * @method endScroll - the virtualization said we are done scrolling so, we can resume actions
     * This might fire too often for kanban requirements so, we have a timer to see when we have actually stopped.
     * See #animateScrollEnd
     * @param args
     */
    async #endScroll() {
        this.#lastEndScrollTime = performance.now();
    }

    /**
     * @method performSync - virtualization said we are performing a batch sync operation so refresh the page.
     * @param args
     */
    async #performSync() {
        // when skipping pages on the virtualization this is called to sync the page.
        // if we are still busy scrolling ignore this as we don't want to undergo the cost.
        if (this.#scrolling == true) return;
        await this.#performSyncPage();
    }

    /**
     * @method inflateSwimLane - inflate the swimlane with the data.
     * This includes setting of the header information and updating the data if when required.
     * @param element
     * @param data
     * @returns {Promise<void>}
     */
    async #inflateSwimLane(element, data, index) {
        await element.firstElementChild.setHeader(data.header);
        element.dataset.index = index;
    }

    /**
     * @method setSwimLaneDataManagers - on the data managers, update their records
     * with those now visible after the scroll.
     * @param newRecords {array} - data for the kanban that determines the swim lanes
     * @returns {Promise<void>}
     */
    async #setSwimLaneDataManagers(newRecords) {
        // if we have not yet created the data managers, create them now.
        if (this.#dataManagerNames.length === 0) {
            await this.#createSwimLaneDataManagers(newRecords.length);
        }

        // update the data managers with the new records.
        for (let i = 0; i < newRecords.length; i++) {
            const manager = this.#dataManagerNames[i];
            const records = newRecords[i].records;

            await crs.call("data_manager", "set_records", {
                manager, records
            })
        }
    }

    /**
     * @method createSwimLaneDataManagers - create the data managers for the swim lanes.
     * We are only creating as many data managers as we can see on screen.
     * @returns {Promise<void>}
     */
    async #createSwimLaneDataManagers(dataLength) {
        const size = dataLength < this.pageItemCount ? dataLength : this.pageItemCount;

        for (let i = 0; i < size; i++) {
            const name = `${this.id}_swimlane_${i}`;
            this.#dataManagerNames.push(name);

            await crs.call("data_manager", "register", {
                manager: name,
                type: "memory"
            })
        }
    }

    async #updatePageDataManagers() {
        // const topIndex = Math.floor(this.scrollPos / this.itemSize);
        // const bottomIndex = topIndex + this.pageItemCount;

        const topIndex = this.topIndex;
        const bottomIndex = this.bottomIndex;

        // get records between top index and bottom index
        const records = await crs.call("data_manager", "get_batch", {
            manager: this.dataset.manager,
            from: topIndex,
            to: bottomIndex,
        });

        for (let i = 0; i < records.length; i++) {
            const manager = this.#dataManagerNames[i];
            const lane_records = records[i].records;

            await crs.call("data_manager", "set_records", {
                manager, records: lane_records
            });
        }
    }

    /**
     * @method performSyncPage - perform a sync on the page.
     * This is the counterpart of what the virtualization has.
     * In short, look at what elements are on the page and update their content.
     * @returns {Promise<void>}
     */
    async #performSyncPage() {
        // ignore this when the virtualization requests it if we are in the middle of a refresh.
        // this can cause timing issues as we are still busy processing new data for the refresh.
        // the refresh will then call this once it is done.
        if (this.#refreshing == true) return;

        const recordCount = await crs.call("data_manager", "record_count", { manager: this.dataset.manager });

        if (recordCount === 0) return;

        // let topIndex = 0;
        // let bottomIndex = recordCount;
        //
        // if (recordCount > this.pageItemCount) {
        //     topIndex = Math.floor(this.scrollPos / this.itemSize);
        //     bottomIndex = topIndex + this.pageItemCount;
        // }

        const topIndex = this.topIndex;
        const bottomIndex = this.bottomIndex + 1;

        let nameIndex = 0;

        for (let i = topIndex; i < bottomIndex; i++) {
            // ignore front buffer elements
            if (i < 0) continue;

            const element = this.rowMap[i];
            const manager = this.#dataManagerNames[nameIndex];
            nameIndex += 1;

            // if the manager is null it means we have hit the back buffer elements.
            // in that case stop processing because we don't have data manages for that.
            if (manager == null) {
                break;
            }

            const swimlane = element.firstElementChild;
            await this.#enableSwimLaneVirtualization(swimlane, manager);
        }
    }

    async #enableSwimLaneVirtualization(swimLane, manager) {
        this.#currentElements.push(swimLane);
        swimLane.dataset.manager = manager;

        await crs.call("component", "on_ready", {
            element: swimLane,
            caller: this,
            callback: async () => {
                await swimLane.enableVirtualization();
                await crs.call("data_manager", "refresh", { manager });
            }
        });
    }

    async #clearSwimLaneDataManagers() {
        for (const element of this.#currentElements) {
            await element.disableVirtualization();
        }

        this.#currentElements.length = 0;

        for (const manager of this.#dataManagerNames) {
            await crs.call("data_manager", "clear", { manager });
        }
    }

    async #disposeSwimLaneDataManagers() {
        for (const manager of this.#dataManagerNames) {
            await crs.call("data_manager", "unregister", {
                manager
            })
        }

        this.#dataManagerNames.length = 0;
    }

    /**
     * @method - refresh - call this to refresh the component
     * This is typically called when the data manager has changes on the data.
     * @param changes
     * @returns {Promise<void>}
     */
    async refresh(changes) {
        this.#scrolling = false;
        this.#refreshing = true;

        await this.#disposeSwimLaneDataManagers();

        const records = await crs.call("data_manager", "get_page", {
            manager: this.dataset.manager,
            page: 1,
            size: this.pageItemCount
        });

        if (records.length === 0) return;

        await this.#setSwimLaneDataManagers(records);
        this.#refreshing = false;

        if (records.length < this.pageItemCount) {
            await this.#performSyncPage();
        }
    }
}

customElements.define("kanban-component", KanbanComponent);