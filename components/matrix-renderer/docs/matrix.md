# Matrix Component

## Introduction
The matrix component uses canvas to render a matrix of cells. 
Each cell can be clicked to toggle its state. 

## Features

1. Virtualized rendering of cells
2. Fixed header
3. Fixed header groups (optional)
4. Frozen columns
5. Clickable cells 
6. Custom cell renderers for different data types
7. Custom cell editors for different data types (boolean for now)
8. Cell condition rendering
9. Change Event - notify that data changes were made to a particular cell
10. Keyboard navigation

## Columns Definition

```json
{
    "title": "Field 1",
    "field": "field1",
    "width": 100,
    "type": "text", 
    "align": "left",
    "editable": false
}
```

All rendering is done in the middle of the cell but can be aligned.

Feature: Alignment

    Enum: Align
        Description: The alignment of the cell content
    
        Left: 1, Align the content to the left
      Center: 2, Align the content to the center
       Right: 3, Align the content to the right

    Scenario: Boolean Column
        Given: A column has a boolean data type
          And: No alignment is defined
         Then: The content should be centered by default

    Scenario: Text Column
        Given: A column has a text data type
          And: The alignment is not set
         Then: The content should be aligned to the left by default

    Scenario: Other Columns
        Given: A column has a data type other than boolean or text
          And: The alignment is not set
         Then: The content should be aligned to the left by default

    Scenario: Custom Alignment
        Given: A column has a custom alignment defined
         Then: The content should be aligned according to the custom alignment

**Data Types:**

1. Text
2. Boolean

Later we can add more data types like date, number, etc.

## Data Structure

The data is a array of dictionaries. Each dictionary represents a row in the matrix.
```json
[
    {"field1": "value1", "field2": "value2"},
    {"field1": "value3", "field2": "value4"}
]
```

## Frozen Columns

Frozen columns are columns that are always visible when scrolling horizontally.
Frozen columns must be columns at the front of the matrix.
The data structure has a property called "frozenColumns" that defines the number of frozen columns.

```json
{
  "frozenColumns": 1
}
```

This will make the first column frozen.

## Default row height

There are different row heights.
1. Column grouping row height
2. Column header row height
3. Data row height

The default row height is 30px.

Feature: Row height defaults

    Scenario: No height defined
        Given: I have a matrix with no row height defined
         When: I render the matrix
         Then: The row height should be 30px

    Scenario: Custom height defined
        Description: This applies to all row heights, grouping, header and data
        Given: I have a matrix with a custom row height defined
         When: I render the matrix
         Then: The row height should be the custom height

Feature: Calculate height regions
    Description: On initialization we need to look at what row data we have and calculate regions for the different row heights

    Scenario: Grouping defined
        Given: I have a matrix with grouping
         Then: The column header region starts at the bottom of the grouping region
    
    Scenario: No grouping
        Given: I have a matrix with no grouping
         Then: The column header region starts at 0px

    Scenario: Calculating the cells region
        Set: CellsTop: HeaderBottom
        Set: CellsBottom: CanvasBottom

## Frozen Columns

Rendering of the frozen columns is done last.
This will overlay any content behind it.
This will affect interactions because when selecting a cell, the frozen column will overlay the cell.

## Clickable Cells

Note: Cells behind frozen columns are ignored when interacting.

Feature: Clickable Cells
    Description: Cells can be clicked to toggle their state, this applies to frozen columns as well

    Scenario: Clicking a cell
        Given: I have a matrix with clickable cells
         When: I click a cell
          And: the column is editable
         Then: The cell should toggle its state and notify the change event
          And: The cell should be highlighted as selected
    Condition: Cell has custom editor
         Then: The custom editor should be displayed

## Custom cell renderers

Different data types need different renderers to ensure the data is displayed correctly.
Displaying text for example is different from displaying a boolean as the boolean is more graphical in nature.

**Renderer Lookup Table**
```json
{
    "boolean": Function,
    "text": Function
}
```

Feature: Custom Renderer

    Scenario: No custom renderer defined
        Given: I have a matrix with no custom renderer defined
         When: I render the matrix
         Then: The value is displayed as text

    Scenario: Custom renderer defined
        Given: I have a matrix with a custom renderer defined
         When: I render the matrix
         Then: The custom renderer should be used

    Function: Custom Renderer
        Description: The purpose here is to define the parameters but what the renderer does depends on the implementation

        Parameters:
            Location     : Type: AABB, The rect on canvas where the cell is located
            CurrentValue : Type: Any, The current value of the cell

## Custom cell editors

Some custom editors will require a different way of interacting with the cell.
In the case of booleans, there is no custom editor as such, but the cell will toggle its state when clicked.
When editing text however you need editable text fields to receive input.

Because each data type has its own set of problems, instead of trying to be generic it is better to be explicit about the data type and provide a custom editor for it.
The matrix has some control over this but should be extendable for custom scenarios.

**Editor Lookup Table**
```json
{
    "boolean": Function,
    "text": Function
}
```

Feature: Custom Editor

    Scenario: No custom editor defined
        Given: I have a matrix with no custom editor defined
         When: I click a cell
         Then: The no further action should be taken

    Scenario: Custom editor defined
        Given: I have a matrix with a custom editor defined
         When: I click a cell
          And: The column is editable
         Then: The custom editor should be displayed by calling the custom editor function

    Scenario: Toggle state editors
        Description: Not all editors require custom rendering, some can just toggle their state
        This is still done on the custom editor function but may or may not render anything

        Given: I have a matrix with a boolean column
         When: I click a cell
          And: The column is editable
         Then: The cell should toggle its state and notify the change event

    Function: Custom Editor
        Description: The purpose here is to define the parameters but what the editor does depends on the implementation

        Parameters:
            Location     : Type: AABB, The rect on canvas where the cell is located
            CurrentValue : Type: Any, The current value of the cell
            FieldName    : Type: String, The field name used by the cell's column
            Row          : Type: Dictionary, Row dictionary of the cell

            Result       : Type: Boolean, True if the cell was edited, False if not

## Cell condition rendering

We can think of a cell as being in two different conditions.
This is different to states as it may have a different state but still be in the same condition.

1. Normal
2. Error

Feature: Cell Condition Rendering

    Scenario: Normal condition
        Given: I have a matrix with a cell in normal condition
         When: I render the matrix
         Then: The cell should be displayed normally

    Scenario: Error condition
        Given: I have a matrix with a cell in error condition
         When: I render the matrix
         Then: The cell should be displayed with an error indicator, this could be a red border and background

## Matrix Canvas Component

The matrix canvas is a custom component that uses canvas to render a matrix of cells.
It is process api driven so all communications to the matrix are done through the api.

The custom element is "matrix-canvas".
The process api module name is "matrix_canvas".

Feature: Matrix Canvas

    Class: MatrixCanvas
        Fields:
            Ctx        : Type: Canvas 2d context, The canvas element handle we are drawing on
            Animating  : Type: Boolean, True if the canvas is currently animating, caused by scrolling
            ScrollLeft : Type: Integer, The current scroll left position
            ScrollTop  : Type: Integer, The current scroll top position
            Config     : Type: Dictionary, The configuration for the matrix

        Private Methods:
            Animate : 
                Description: Animate the canvas using "requestAnimationFrame"

            Scroll : 
                Description: Scroll event handler, this updates the scroll position fields 


        Public Methods:
            Initialize: 
                Description: Initialize the canvas, see initialization scenario for more details

                Parameters: 
                    Config: Type: Dictionary, The configuration for the matrix

                Returns: Boolean, True if successful

            Refresh: 
                Description: Refresh the canvas

                Parameters: 
                    Reset: Type: Boolean, Default: False, True if the canvas should be reset, 
                           This means the scroll position is reset to 0,0

            SetWidths: 
                Description: Set the widths of the columns

                Parameters: 
                    Widths: Type: Dictionary, The key is the field name and the value is the width

                Step: Update the column information in the config
                Step: Refresh the canvas
                    Call: #Refresh

                Returns: Boolean, True if successful

        Events:
            Change: 
                Description: Notify that data changes were made to a particular cell

                Parameters: 
                    RowIndex  : Type: Integer, The row index of the cell
                    FieldName : Type: String, The field name of the cell based on it's column
                    Value     : Type: Any, The new value of the cell

    Scenario: Initialization
        Description: The canvas is initialized with the configuration

        Step: Initialize the canvas and ctx
        Step: Initialize the scroller by creating a scroll marker in the scroller div
        Step: Calculate the regions for the different row heights
        Step: Render the canvas
            Call: #Refresh

### Config - structure

```json
{
	"frozenColumns": 2,
	"heights": {
		"groupHeader": 50,
		"header": 40,
		"row": 30
	},
	"columns": [
		{ "title":  "title", "field":  "field1" }
    ],
    "rows": [
        { "field1": "value1" }
    ],
	"groups": [
		{ "from": 0, "to": 3, "title": "Group 1" },
		{ "from": 4, "title": "Group 2" }
	],
	"canvas": {
		"width": 1024,
		"height": 768
	}
}
```


### Config - regions dictionary

```json
{
    "grouping": {
        "top": 0,
        "bottom": 30
    },
    "header": {
        "top": 30,
        "bottom": 60
    },
    "cells": {
        "top": 60,
        "bottom": 900
    },
    "frozenColumns": {
        "left": 0,
        "right": 100
    }
}
```

## Matrix Renderer

This looks at how render is done for the matrix.

Feature: Matrix Renderer

    Class: MatrixRenderer
        Fields:
            Ctx         : Type: Canvas 2d context, The canvas element handle we are drawing on
            Config      : Type: Dictionary, The configuration for the matrix
                Data    : Type: Array, The data to render
                Columns : Type: Array, The columns to render
                Widths  : Type: Dictionary, The widths of the columns
                Regions : Type: Dictionary, The regions for the different row heights

        Private Methods:
            RenderGrouping: 
                Description: Render the grouping region

            RenderHeader: 
                Description: Render the header region

            RenderCells: 
                Description: Render the cells region

            RenderFrozenColumns: 
                Description: Render the frozen columns region

        Public Methods:
            Render: 
                Description: Render the matrix

                Returns: Boolean, True if successful