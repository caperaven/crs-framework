@side-menu
  # Technical specifications for the side menu.
  # The side menu is a custom web component used for navigation and certain actions.
  # It's dynamic in placement and content.
  # Utilizes the latest binding engine and features slide effects.

@expected-behaviour - Desktop
  # Side menu behavior on desktop:
  # - Can be placed left/right or top/bottom (stretch).
  # - Optional header with pin/unpin and close buttons.
  # - Buttons will be placed in a slot.
  # - If more than 3 buttons, they will be placed in a overflow menu.
  # - Can be pinned/unpinned.
  # - Default width; full-screen height.

@expected-behaviour - Mobile
  # Side menu behavior on mobile:
  # - Placement options: left/right or top/bottom (stretch).
  # - Optional header with close button only.
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
  # - Same as desktop.

Feature: Side Panel Header
  # Header specifications for the side menu.
  # Contains title, pin/unpin, and close buttons.
  # Optional with binding for text and actions slot.

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
