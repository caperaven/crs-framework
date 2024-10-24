# Block Editor Features

## Introduction

This is a technical breakdown for the block editor features.
There are a number of basic features we need to consider.

1. **Canvas**: The canvas is the area where the user can interact with the blocks.
2. **Block**: The block is the smallest unit of the editor.
3. **Block Toolbar**: The block toolbar is the toolbar that appears when a block is selected.
4. **Block Settings Sidebar**: The block settings sidebar is the sidebar that appears when a block is selected.
5. **Block Navigation**: The block navigation is the navigation that appears when a block is selected.
6. **Block Library**: The block library is the library that contains all the blocks available.

Feature: Canvas
    Description: The canvas is the area where the user can interact with the blocks.
    The canvas supports additional features such as moving blocks, resizing blocks, and more.

    The canvas exists out of the following components:
    - Block Navigation - the navigation that appears when a block is selected (move up / down ...).
    - Block Toolbar - the toolbar that appears when a block is selected.
    - Block Settings Sidebar - the sidebar that appears when a block is selected.
    - Block Library - the library that contains all the blocks available.

Feature: Block Navigation
    Description: The block navigation is the navigation that appears when a block is selected.
    The block navigation contains buttons that allow the user to navigate between blocks.

    You can perform actions such as:
    - Move block left
    - Move block right
    - Move block up
    - Move block down
    - Drag and drop block
    - Duplicate block
    - Remove block

    Scenario: Move block left
        Given: a block is selected
          And: you can move the block into a container on the left
         When: the move left button is clicked
         Then: move the block to the left

    Scenario: Move block right
        Given: a block is selected
          And: you can move the block into a container on the right
         When: the move right button is clicked
         Then: move the block to the right

    Scenario: Move block up
        Given: a block is selected
          And: there is a previous sibling block
         When: the move up button is clicked
         Then: move the block up

    Scenario: Move block down
        Given: a block is selected
          And: there is a next sibling block
         When: the move down button is clicked
         Then: move the block down

    Scenario: Drag and drop blocks
        Given: a block is selected
          And: the block supports drag and drop
          And: the drag and drop is selected
         When: the user drags the block
         Then: move the block to the new position

    Scenario: Duplicate block
        Given: a block is selected
         When: the duplicate button is clicked
         Then: duplicate the block below the selected block
          And: select the duplicated block

    Scenario: Remove block
        Given: a block is selected
         When: the remove button is clicked
         Then: remove the block
          And: select the previous sibling block

Feature: Block Toolbar
    Description: The block toolbar is the toolbar that appears when a block is selected.
    The block toolbar contains buttons that allow the user to interact with the block.
    Depending on the block, the block toolbar may contain different buttons.

    Scenario: Block supports toolbar
        Given: a block is selected
          And: the block supports a custom block toolbar
         When: the block toolbar is shown
         Then: show the custom block toolbar
    
Feature: Block Settings
    Description: The block settings sidebar is the sidebar that appears when a block is selected.
    The block settings sidebar contains settings that allow the user to customize the block.
    Depending on the block, the block settings sidebar may contain different settings. 

Feature: Blocks
    Description: The block is the smallest unit of the editor.
    Blocks can be added, removed, and rearranged on the canvas.

    Blocks can be divided into categories such as:
    - Container Blocks - components that deals with how blocks are arranged.
    - Widget Blocks - components that deals with how blocks are displayed.
    - Complex Blocks - these blocks are composed of other blocks and can include custom logic.

    Simple Containers:
    - Horizontal Layout - a container that arranges blocks horizontally one after the other.
    - Vertical Layout   - a container that arranges blocks vertically one after the other.
    - Columns Layout    - a container that arranges blocks in columns using cssgrid columns of different widths.
    - Rows Layout       - a container that arranges blocks in rows using cssgrid rows of different heights.
    - Grid Layout       - a container that arranges blocks in a grid using cssgrid including regions of different sizes.

    Widgets:
    - Heading Block     - a block that displays text headers from H1 to H6.
    - Paragraph Block   - a block that displays text paragraphs.
    - Toolbar Block     - a block that displays images.
    - Button Block      - a block that displays buttons.
    - Input Block       - a block that displays lists this supports all input types such as text, number, email ...
    - Select Block      - a block that displays dropdowns.
    - Textarea Block    - a block that displays textareas.
