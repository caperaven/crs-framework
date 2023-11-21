@layout-container

Feature: layout-container - HTMLElement
  # this is the overarching component that controls the layout of the document
  # it is responsible for creating the content layout and adjusting it
  #<layout-component data-columns= "1fr 1fr" data-rows= "1fr 1fr"></layout-component>

  @requirements
  | data-columns  | the grid value for the column width | passed through the data-attribute (data-columns) |
  | data-rows     | the grid value for the row height   | passed through the data-attribute (data-rows)    |
  | dispatchEvent | dispatched 'change'| dispatches an event once the state has changed |
  | onMessage()   | listens for postMessage | listens for postMessage and updates the state |
  | change.setValue Event  | sets the column state | sets the column state based on the event |
  | id | the id of the component | passed through the attributes (id) |

  Scenario: Create a four column layout with two rows
    Given I have a layout-container with four columns and two rows
    Then The component should have a data-columns value of "1fr 1fr 1fr 1fr"
    And The component should have a data-rows value of "1fr 1fr"
    Example
      """
        <layout-container data-column="1fr 1fr 1fr 1fr" data-rows="1fr 1fr"></layout-container>
      """

  Scenario: Create a three column layout and show or hide the first column based on the click of a button
    Given I have a layout-component with three columns and one row
    When I click on show/hide button a post message event fires which is picked up by the layout-container
    Then The first columnState should be set to custom
    And The first column should be hidden
    And The second and third column should be visible, where the second column is twice the width of the third column
    And The component should dispatch an event with the new state.
    Example
      """
          <layout-container id="lc-assets" data-columns="1fr 2fr" change.setValue="columnState = $event.detail">
          </layout-container>
      """