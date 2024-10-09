# Data manager and perspectives

## Introduction 

This document is a breakdown of the data manager and how it interacts with perspectives.
It will define the different moving parts and how they fit.

There are three features

1. Data Manager
2. Perspective Manager
3. Perspective Builder
4. Filter Builder

Feature: Data Manager
    Description: The data manager is a singleton that manages a data store.
    It is responsible for loading and saving data to the store.
    It provides different methods for:
    
    1. Fetching data
    2. Updating data
    3. Tracking dirty state for each data item
    4. Managing record selection

    Scenario: Get Perspective Data
        Given: a data manager id
          And: a perspective id
           Or: a perspective object
         When: I call `get_perspectibe_data`
         Then: I should get the data after applying the perspective

    Example:
        const records = await crs.call("data_manager", "get_perspective_data", { manager: "my_data", perspective: "my_perspective"})


Feature: Perspective Manager
    Description: The perspective manager stores the perspective intent definition object in a named store.

    Scenario: Register Perspective
        Given: a perspective object
          And: a perspective id
         When: I call `register`
         Then: The perspective object should be stored in the store using the id as a reference

    Example:
        await crs.call("perspective_manager", "register", {
            perspective: "my_perspective",
            intent: { ... }
        });

    Scenario: Get Perspective
        Given: a perspective id
         When: I call `get`
         Then: I should get the perspective object

    Example:
        const perspectiveIntent = await crs.call("perspective_manager", "get", { perspective: "my_perspective" });

    Scenario: Dispose of Perspective
        Given: a perspective id
         When: I call `dispose`
         Then: The perspective object should be removed from the store

    Example:
        await crs.call("perspective_manager", "dispose", { perspective: "my_perspective" });

Feature: Perspective Builder
    Description: The perspective builder is a utility that helps build perspective intent objects.
    You can create a new perspective or update an existing one.
    This uses the builder pattern to create the intent object.

    Scenario: Create New Perspective
        Given: No reference object provided
         When: I call `build`
         Then: I should get a new perspective object

    Example:
        const perspective = new PerspectiveBuilder().build();

    Scenario: Update Perspective
        Given: a reference object
         When: I call `build`
         Then: I should get an updated perspective object

    Example:
        const perspective = new PerspectiveBuilder(perspectiveIntent).build();

    Scenario: Add / Update Filter
        Given: a filter intent definition
         When: I call `setFilter`
         Then: The filter should be added to the perspective object

    Example:
        const perspective = new PerspectiveBuilder(perspectiveIntent).setFilter({ ... }).build();

    Scenario: Remove Filter
        Given: a existing perspective
         When: I call `removeFilter`
         Then: The filter should be removed from the perspective object

    Example:
        const perspective = new PerspectiveBuilder(perspectiveIntent).removeFilter().build();

    Scenaio: Append Filter
        Given: a existing perspective
          And: a existing filter
         When: I call `appendFilter`
         Then: The filter should be appended to the existing filter

    Scenario: Append Filter to a non existing filter
        Given: a existing perspective
          And: no filter has been defined
         When: I call `appendFilter`
         Then: The filter should be added to the perspective object

    Example:
        const perspective = new PerspectiveBuilder(perspectiveIntent).appendFilter({ ... }).build();

    Scenario: Clear Filter
        Given: a existing perspective
         When: I call `clearFilter`
         Then: The filter should be removed from the perspective object 

    Example:
        const perspective = new PerspectiveBuilder(perspectiveIntent).clearFilter().build();

    The same applies for :
    - setFuzzyFilter - use fuzzy filter
    - removeFuzzyFilter - remove fuzzy filter
    - appendFuzzyFilter - append fuzzy filter
    - clearFuzzyFilter - clear fuzzy filter

    - setSort - set the sort order
    - removeSort - remove the sort order
    - appendSort - append the sort order
    - clearSort - clear the sort order

    - setGroup - set the grouping
    - removeGroup - remove the grouping
    - appendGroup - append the grouping
    - clearGroup - clear the grouping

    - setAggregation - set the aggregation
    - removeAggregation - remove the aggregation
    - appendAggregation - append the aggregation
    - clearAggregation - clear the aggregation

    Scenario: Combine actions using chaining in a single call
         When: I use the perspective builder
         Then: Chain methods in a single call

    Example:
        const perspective = new PerspectiveBuilder(perspectiveIntent)
            .setFilter({ ... })
            .setSort({ ... })
            .setGroup({ ... })
            .setAggregation({ ... })
            .build();

Feature: Filter Builder
    Description: Build a filter object from a expression string

    Example: Complex with or and and (value eq 'a' and value2 eq 10) or (value2 eq 20)
    {
        "operator": "or",
        "expressions": [
            {
                "operator": "and",
                "expressions": [
                    { "field": "value", "operator": "eq", "value": "a" },
                    { "field": "value2", "operator": "eq", "value": 10 }
                ]
            },
            {
                "field": "value2",
                "operator": "eq",
                "value": 20
            }
        ]
    }