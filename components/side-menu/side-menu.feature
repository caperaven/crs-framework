@side-menu
  # This is the technical specifications for the side menu.
  # The side menu is a custom web component that is used to display the side menu.
  # The side menu will be dynamic as to where it is placed on the page.
  # The side menu will also be dynamic as to what is displayed in the menu.
  # The side menu will contain functionality of the latest binding engine.
  # The side menu will have a open and close slide effect.

@expected-behaviour - Desktop
  # The side menu should be able to be placed on the left or right side of the page.
  # The side menu should be able to be placed on the top or bottom of the page. (stretch goal)
  # The side menu will have a optional header and will have a pin/unpin button and a close button.
  # The side menu will be able to be pinned to the page or unpinned from the page.
  # The side menu will have a default width for desktop views but the height will be full screen.

@expected-behaviour - Mobile
  # The side menu will be able to be placed on the left or right side of the page.
  # The side menu will be able to be placed on the top or bottom of the page. (stretch goal)
  # The side menu will have a optional header and a close button BUT will not have a pin/unpin button.
  # The side menu will always be full screen on mobile.


Feature: Existing tabs
  # The feature has existing tabs/actions that should be present again.
  # Account, Actions, Assist, Help, Messages, Profiles and Compare.

@expected-behaviour - Desktop
  # The tabs will be displayed in the side menu.
  # The tabs will be displayed in a vertical list.
  # The tabs will be displayed in a specific order.
  # The tabs will have a icon and a label.
  # The tabs will have a hover effect.
  # The tabs will have a focused state.
  # The tabs will have a active state.
  # The tabs will have a disabled state.


@expected-behaviour - Mobile
  # The tabs will be displayed in the side menu.
  # The tabs will be displayed in a vertical list.
  # The tabs will be displayed in a specific order.
  # The tabs will have a icon and a label.
  # The tabs will have a focused effect.
  # The tabs will have a active state.
  # The tabs will have a disabled state.

Feature: Side Panel Header
  # The feature has a header that should always be present and only 1 header for the side menu.
  # The header will contain a title, and a pin-menu and a close button.
  # The header will be optional.
  # We will use binding for the header text
  # We will have a actions slot for the actions in the header.

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
      # The pin/unpin button will be displayed in the header.
      # The pin/unpin button will have a icon.
      # The pin/unpin button will have a hover effect.
      # The pin/unpin button will have a focused state.
      # The pin/unpin button will have a active state.
      # The pin/unpin button will have a disabled state.

    Scenario: Pinning the side menu
      Given the side menu is open
      When the user clicks the pin/unpin button
      Then the side menu will be pinned to the page
      And now the side menu will stay open while the user navigates the page.

    Rule: When pinning the side menu, the menu must take up the space of the page and not overlay the page.
    Rule: If the menu is not pinned and is opened, it will overlay the page.


    Scenario: Unpinning the side menu
        Given the side menu is opened
        And the side menu is pinned to the page
        When the user clicks the pin/unpin button
        Then the side menu will be unpinned from the page
        And now the side menu will close when the user navigates the page.

    @events
    | Pin-side-menu         | This will set the side menu in a pinned state                          |
    | Unpin-side-menu       | This will set the menu in a un-pinned state                            |
    | Click when unpinned   | This will close the menu when not pinned and click occurs outside menu |


    @mobile
      # The pin/unpin button will not be displayed in the header.
      # Mobile menus will not be able to be pinned to the page.


@expected-behaviour
    @Desktop
    @close-button
      # The close button will be displayed in the header.
      # The close button will have a icon.
      # The close button will have a hover effect.
      # The close button will have a focused state.
      # The close button will have a active state.
      # The close button will have a disabled state.

    Scenario: Closing the side menu
      Given the side menu is open
      When the user clicks the close button
      Then the side menu will close
      And now the side menu will be closed.


    Scenario: Clicking outside the side menu
      Given the side menu is open
      And the side menu is unpinned
      When the user clicks outside the side menu
      Then the side menu will close


    @events:
    | Close-side-menu       | This will close the side menu when clicked |

    @mobile
      # The close button will be displayed in the header.
      # The close button will have a icon.
      # The close button will have a hover effect.
      # The close button will have a focused state.
      # The close button will have a active state.
      # The close button will have a disabled state.

    Scenario: Clicking outside the side menu
      Given the side menu is open
      And the side menu is unpinned
      When the user clicks outside the side menu
      Then the side menu will close
