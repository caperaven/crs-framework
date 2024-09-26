export class HeaderOverlayBuilder {
    #data = {
        resize: true,
        filter: false,
        sort: false,
        fieldName: "",
        columnIndex: 0
    }

    setResize(value) {
        this.#data.resize = value;
        return this;
    }

    setFilter(value) {
        this.#data.filter = value;
        return this;
    }

    setFieldName(value) {
        this.#data.fieldName = value;
        return this;
    }

    setColumnIndex(value) {
        this.#data.columnIndex = value;
        return this;
    }

    build() {
        return createColumnsControl(this.#data);
    }
}

function createColumnsControl(data) {
    const result = document.createElement("div");
    result.classList.add("columns-control");
    result.dataset.field = data.fieldName;
    result.dataset.index = data.columnIndex;
    result.dataset.resize = data.resize;
    result.dataset.filter = data.filter;

    if (data.filter) {
        result.appendChild(createFilter());
    }

    if (data.resize) {
        result.appendChild(createResize());
    }

    return result;
}

function createResize() {
    const result = document.createElement("div");
    result.classList.add("resize");
    return result;
}

function createFilter() {
    const result = document.createElement("div");
    result.textContent = "filter";
    result.classList.add("filter");
    return result;
}