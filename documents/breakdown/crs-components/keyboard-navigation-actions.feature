Feature: keyboard-navigation-actions
  # this is a process api module that can be enabled and disabled on any list related element

  Background:
    Given I am on the "list" page
    And I want to enable keyboard navigation and focus management on that list
    Then I want to enable keyboard navigation and focus management on that list using the process api

  Background:
    Given Virtualization is used on the list
    Then On events that require scrolling into view the external observer must handle this

  Scenario: enable keyboard navigation
    Given I am on the "list" page
    When I enable keyboard navigation
    Then I should have navigational and selection capabilities
    And A manager is attached to the list that will perform the work

    Example: enable keyboard navigation
      ```js
      await crs.call("keyboard-navigation-actions", "enable", {
        element: ul,
        multi_select: true
      });
      ```
  Scenario: disable keyboard navigation
    Given I am on the "list" page
    When I disable keyboard navigation
    Then I should not have navigational and selection capabilities
    And All memory should be cleared

    Example: disable keyboard navigation
      ```js
      await crs.call("keyboard-navigation-actions", "disable", { element: ul });
      ```

  Scenario: perform keyboard actions using process api
    Given I am on the "list" page
    And I enable keyboard navigation
    When I perform keyboard actions using process api
    Then I should be able to navigate and select items using keyboard

    Example: perform keyboard actions using process api
      ```js
      await crs.call("keyboard-navigation-actions", "enable", { element: ul });
      await crs.call("keyboard-navigation-actions", "perform", { element: ul, action: 'select', id: 1001 });
      ```

    @supported_actions
      | action          | description                        | parameters              | keyboard keys | mouse events |
      | --------------- | ---------------------------------- | ----------------------- | ------------- | ------------ |
      | focus           | focus list / item id               | none / id               | none          | none         |
      | activate        | perform activate action            | id                      | enter         | dblclick     |
      | gotoNext        | go to next item / row              | none / id               | down          | none         |
      | gotoPrevious    | go to previous item / row          | none / id               | up            | none         |
      | gotoFirst       | go to first item                   | none                    | home          | none         |
      | gotoLast        | go to last item                    | none                    | end           | none         |
      | select          | select item                        | id                      | space         | click        |
      | deselect        | deselect item                      | id                      | space         | click        |
      | toggle          | toggle item                        | id                      | space         | click        |
      | selectAll       | select all items                   | none                    | ctr + a       | none         |
      | deselectAll     | deselect all items                 | none                    | ctr + a       | none         |
      | toggleAll       | toggle all items                   | none                    | ctr + a       | none         |
      | clearSelection  | clear selection                    | none                    | none          | none         |
      | expand          | expand item                        | id                      | right         | dblclick     |
      | collapse        | collapse item                      | id                      | left          | dblclick     |
      | gotoNextCell    | to to the cell on the right        | id                      | right         | none         |
      | gotoPreviousCell| to to the cell on the left         | id                      | left          | none         |
      | expandAll       | expand all items                   | none                    | ctr + right   | none         |
      | collapseAll     | collapse all items                 | none                    | ctr + left    | none         |
      | groupSelect     | select from this item to that item | from id / to id         | shift + down  | shift click  |

    Scenario: use the focus action
      Given I have keyboard navigation enabled
      And I used the focus action
      Then The first item in the list should be focused
      And The event observer should deal with scrolling to the focused item

    Scenario: raise event when navigation action is preformed
      Given I am on the "list" page
      And I enable keyboard navigation
      When I perform keyboard actions using process api or keyboard
      Then I should be able to navigate and select items using keyboard
      And I should see the event raised defining what action was performed
      And The event should define the previous element and the current element

  Scenario: get the selected items
    Given I am on the "list" page
    And I enable keyboard navigation
    When I select an item
    Then I should be able to get the selected items

    Example: get the selected items
      ```js
      await crs.call("keyboard-navigation-actions", "enable", { element: ul });
      await crs.call("keyboard-navigation-actions", "select", { element: ul, id: 1001 });
      const selected = await crs.call("keyboard-navigation-actions", "get_selected_items", { element: ul });
      ```
  Rule: selection dom update
    Given a element is selected
    Then update the aria-selected attribute of the selected element and set it to true
    And update the previously selected element and set it's aria-selected to false

  Rule: differentiate between the current focused item and selected items
    Given we have a selected item and we pressed up or down arrow key on the keyboard
    Then the current focused item should show as focused but not selected

  Rule: selecting a item
    Given we have a selected item in the list
    And the select key is pressed
    Then the currently focused item should be selected

  Rule: deselect current when new selection is made if multi select is not enabled
    Given we have a selected item in the list
    And the select key is pressed
    And the multi select is not enabled
    Then the currently focused item should be selected
    And the previously selected item should be deselected

  Rule: leave selection on multi selected items
    Given multi selection is enabled
    And any navigation or selection action is performed
    Then leave the selection as is just update the focused item

  Rule: discern between next cell or expand - collapse does the same thing
    Given we have a focused item
      And the right key is pressed
      Then if the item has a aria-expanded attribute
      Then expand the item
      But if the item does not have a aria-expanded attribute
      Then go to the next cell