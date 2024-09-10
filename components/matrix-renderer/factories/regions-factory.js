const DEFAULT_HEIGHT = 30;

export class Regions {
    static from(definition) {
        const result = {
            "grouping": {
                "top": 0,
                "bottom": 0
            },
            "header": {
                "top": 0,
                "bottom": 0
            },
            "cells": {
                "top": 0,
                "bottom": 0
            }
        }

        setGrouping(definition, result);
        setHeader(definition, result);
        setCells(definition, result);
        setFrozenColumns(definition, result);

        return result;
    }
}

function setGrouping(definition, result) {
    if (definition.groups != null) {
        result.grouping.top = 0;
        result.grouping.bottom = definition.heights?.groupHeader ?? DEFAULT_HEIGHT;
    }
}

function setHeader(definition, result) {
    result.header.top = result.grouping.bottom;
    result.header.bottom += result.header.top + (definition.heights?.header ?? DEFAULT_HEIGHT);
}

function setCells(definition, result) {
    result.cells.top = result.header.bottom;
    result.cells.bottom = definition.canvas.height;
    result.cells.height = result.cells.bottom - result.cells.top;
}

function setFrozenColumns(definition, result) {
    if (definition.frozenColumns == null) {
        return;
    }

    const left = 0;
    let right = 0;
    for (let i = 0; i < Number(definition.frozenColumns.count); i++) {
        right += definition.columns[i].width;
    }

    result.frozenColumns = { left, right }
}