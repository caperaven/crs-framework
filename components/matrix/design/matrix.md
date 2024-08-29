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
