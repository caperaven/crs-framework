@side-menu
  # Technical specifications for the side menu.
  # The side menu is a custom web component used to display various panels with dynamic content within or/and to launch certain actions.
  # It's dynamic in placement and content.
  # Utilizes the latest binding engine.

@expected-behaviour - Desktop
  # Side menu behavior on desktop:
  # - Can be placed left/right or top/bottom (stretch).
  # - Dynamic header with pin/unpin and close buttons.
  # - Header will contain slot for buttons that can be set from the outside of the component.
  # - If more than 3 buttons, they will be placed in a overflow menu.
  # - Can be pinned/unpinned.
  # - Default width; full-screen height.

@expected-behaviour - Mobile
  # Side menu behavior on mobile:
  # - Placement options: left/right or top/bottom (stretch).
  # - Dynamic header with close button only.
  # - Always full-screen.

Feature: Existing tabs
  # Tabs/actions present in the feature.
  # Account, Actions, Assist, Help, Messages, Profiles, and Compare.

  @expected-behaviour - Desktop
  # Desktop behavior for tabs:
  # - Displayed vertically.
  # - Specific order, with icons and labels.
  # - Hover, focus, active, focused and disabled states.

  @expected-behaviour - Mobile
  # Mobile behavior for tabs:
  # - Same as desktop. //can be explicit

Feature: Side Panel Header
  # Header specifications for the side menu.
  # Contains dynamic title, pin/unpin, and close buttons.
  # Optional with binding for text and actions slot. // question: do we want to have cutsomizable header?

  Example:
  <side-menu>
    <side-panel-header value.two-way="header.title">
      | "Title" | "Pin/Unpin" | "Close" |
      # Content
    </side-panel-header>
  </side-menu>

  Example - Desktop:

  | Header Contents  | Content Actions                        |
  |------------------|----------------------------------------|
  | Header Title     | Describes the opened tab               |
  | Close Button     | Closes the Side Menu                   |
  | Pin/Unpin Button | Pins/Unpins the side menu              |

  Example - Mobile:

  | Header Contents  | Content Actions                        |
  |------------------|----------------------------------------|
  | Header Title     | Describes the opened tab               |
  | Close Button     | Closes the Side Menu                   |

  @expected-behaviour - Desktop
  @Desktop
  @pin-unpin
    # Pin/unpin button specs for desktop.
    # Includes icon, hover, focus, active, and disabled states.

  Scenario: Pinning the side menu
    Given the side menu is open
    When the user clicks the pin/unpin button
    Then the side menu will be pinned to the page
    And it remains open while the user navigates.

  Scenario: Unpinning the side menu
    Given the side menu is opened and pinned
    When the user clicks the pin/unpin button
    Then the side menu will be unpinned
    And it closes when the user navigates.

  Rule: Pinning behavior
  - Pinned: takes page space.
  - Unpinned: overlays the page.

    @expected-behaviour - Mobile
  # Mobile-specific behavior.
  # No pin/unpin option.

    @expected-behaviour
    @Desktop
    @close-button
    # Close button specs for desktop.
    # Includes icon, hover, focus, active, and disabled states.

    Scenario: Closing the side menu
      Given the side menu is open
      When the user clicks the close button
      Then the side menu closes.

    Scenario: Clicking outside the side menu
      Given the side menu is open and unpinned
      When the user clicks outside
      Then the side menu closes.

    @mobile
    # Mobile close button specs.
    # Same as desktop.


# ToDo : AW - Plan out attributes, properties, and methods for the side menu.

Feature: Side Menu Functionality

  # Side menu functionality.
  # - Includes attributes, properties, and methods.
  # - Dynamic content and placement.

  ## Functions/Methods
    # openMenu(): Method to open the side menu.

    # closeMenu(): Method to close the side menu.

    # toggleMenu(): Method to toggle the state of the side menu (open/close).

    # focusFirstMenuItem(): Utility function to set focus on the first item in the side menu body.

    # focusLastMenuItem(): Utility function to set focus on the last item in the side menu body.

    # focusNextMenuItem(): Utility function to move focus to the next item in the side menu body.

    # focusPreviousMenuItem(): Utility function to move focus to the previous item in the side menu body.

    # selectMenuItem(): Method to handle selection of a menu item, triggering the associated action.

    # navigateBack(): Method to navigate back from a submenu or content section to the parent menu or main content.

    # handleKeyboardEvents(event): Method to handle keyboard events such as Enter, Escape, Arrow keys, etc., and perform appropriate actions based on the current state of the side menu.

    # pinMenu(): Method to pin the side menu to the page.

    # unpinMenu(): Method to unpin the side menu from the page.

    # togglePin(): Method to toggle the pinned state of the side menu.

    # closeSubmenu(): Method to close a submenu within the side menu.

    # handleClickOutside(event): Method to handle clicks outside the side menu, closing the menu if necessary.

    # updateContent(content): Method to update the content of the side menu dynamically.

  ## Scenarios
    # - Opening the side menu
    # - Closing the side menu
    # - Pinning the side menu
    # - Unpinning the side menu
    # - Displaying content in the side menu
    # - Handling click events on side menu items
    # - Resizing the side menu
    # - Hiding the side menu on scroll
    # - Customizing the side menu appearance

  Scenario: Opening the Side Menu
    Given the user clicks on the side menu button
    When the side menu opens
    Then the side menu header and body are visible

  Scenario: Closing the Side Menu
    Given the side menu is open
    When the user clicks the close button
    Then the side menu closes

  Scenario: Pinning the Side Menu
    Given the side menu is open
    When the user clicks the pin/unpin button
    Then the side menu becomes pinned to the page

  Scenario: Unpinning the Side Menu
    Given the side menu is pinned to the page
    When the user clicks the pin/unpin button
    Then the side menu becomes unpinned

  Scenario: Displaying Content in the Side Menu
    Given the side menu is open
    When content is loaded into the side menu body
    Then the content is displayed in the side menu

  Scenario: Handling Click Events on Side Menu Items
    Given the side menu is open
    When the user clicks on an item in the side menu body
    Then the corresponding action is triggered

  Scenario: Resizing the Side Menu
    Given the side menu is open
    When the user resizes the browser window
    Then the side menu adjusts its layout accordingly

  Scenario: Hiding the Side Menu on Scroll
    Given the side menu is open
    When the user scrolls the page
    Then the side menu hides or minimizes

  Scenario: Customizing the Side Menu Appearance
    Given the side menu is open
    When the user applies custom styling or themes
    Then the side menu updates its appearance accordingly


  ## Scenarios for keyboard navigation

Feature: Custom Side Menu Web Component Keyboard Functionality

  Scenario: Opening the Side Menu using Keyboard
    Given the focus is on the side menu button
    When the user presses the Enter key
    Then the side menu opens
    And the focus shifts to the first item in the side menu body

  Scenario: Closing the Side Menu using Keyboard
    Given the side menu is open
    And the focus is on the close button
    When the user presses the Enter key
    Then the side menu closes
    And the focus returns to the side menu button

  Scenario: Navigating Through Side Menu Items using Keyboard
    Given the side menu is open
    And the focus is on a side menu item
    When the user presses the Down arrow key
    Then the focus moves to the next item in the side menu
    And if at the last item, it wraps around to the first item

  Scenario: Selecting a Side Menu Item using Keyboard
    Given the side menu is open
    And the focus is on a side menu item
    When the user presses the Enter key
    Then the action associated with the selected item is triggered
    And the side menu remains open

  Scenario: Pinning/Unpinning the Side Menu using Keyboard
    Given the side menu is open
    And the focus is on the pin/unpin button
    When the user presses the Enter key
    Then the side menu toggles between pinned and unpinned states
    And the focus remains on the pin/unpin button

  Scenario: Closing the Side Menu when Focus Moves Away using Keyboard
    Given the side menu is open
    And the focus moves away from the side menu
    When the user presses the Escape key
    Then the side menu closes
    And the focus returns to the element that previously had focus

Feature: Custom Side Menu Web Component Keyboard Functionality

  Scenario: Navigating through Side Menu Content using Keyboard
    Given the side menu is open
    And the focus is on the first item in the side menu body
    When the user presses the Down arrow key
    Then the focus moves to the next item in the side menu content
    And if at the last item, it wraps around to the first item

  Scenario: Selecting a Side Menu Content Item using Keyboard
    Given the side menu is open
    And the focus is on a side menu content item
    When the user presses the Enter key
    Then the action associated with the selected content item is triggered
    And the side menu remains open

  Scenario: Navigating Back from Side Menu Content using Keyboard
    Given the side menu is open
    And the user has navigated into a submenu or content section
    When the user presses the Escape key
    Then the focus moves back to the parent menu or the main side menu content
    And if already at the main content, the side menu closes

  Scenario: Closing Submenu using Keyboard
    Given the side menu is open
    And the user has navigated into a submenu or content section
    And the focus is on the close button for the submenu
    When the user presses the Enter key
    Then the submenu closes
    And the focus returns to the parent menu item or the main side menu content
