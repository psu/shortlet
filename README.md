# Shortlet

```
 _______      __                    _ __  __     _      __    __       _ __
/_  __(_)__  / /_____ ____  _    __(_) /_/ /    | | /| / /__ / /  ___ (_) /____ ___
 / / / / _ \/  \_/ -_) __/ | |/|/ / / __/ _ \   | |/ |/ / -_) _ \(_-</ / __/ -_|_-<
/_/ /_/_//_/_/\_\\__/_/    |__,__/_/\__/_//_/   |__/|__/\__/_.__/___/_/\__/\__/___/

```

Shortlet is a framework to configure and launch small hacks for the web. Ease your day-to-day by:

- Create keyboard shortcuts
- Multiple actions with one click
- Webpage manipulation without coding

Shortlet comes as a [Chrome](https://chromewebstore.google.com/detail/shortlet-tinker-with-webs/mcgeeginnkfnlheihekeklgmpfdliogn) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/shortlet) extension, providing automatic webpage injection, a command palette and a settings UI.

## Contents

- [Usage](#usage)
- [Examples](#examples)
  - [Basic](#basic)
  - [Advanced](#advanced)
- [Details](#details)
- [Actions overview](#actions-overview)
- [List of Actions](#list-of-actions)
  - [Element interaction](#element-interaction)
  - [Element visibility](#element-visibility)
  - [Styling](#styling)
  - [Form interaction](#form-interaction)
  - [Create elements](#create-elements)
  - [Events](#events)
  - [Browser interaction](#browser-interaction)
  - [Script control and Utilities](#script-control-and-utilities)
- [Settings](#settings)
- [Code building-blocks](#code-building-blocks)

---

## Usage

1. Install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/shortlet) or download and load the folder _src_ as an unpacked extension in Chrome.
2. Open Shortlet settings by clicking on the extension icon, or trigger the Shortlet command palette with the default shortcut `ctrl+space`.
3. Add your first shortlet and save the settings.
4. Navigate to, or reload, the webpage and launch the shortlet.

---

## Examples

### Basic

A simple shortlet to click a button, added within the shortlets wrapper object.

```json
{
  "shortlets": [
    {
      "id": "example_click_button",
      "title": "Click a button",
      "conditions": {
        "url": "example.com"
      },
      "shortcut": "ctrl+g",
      "actions": [
        {
          "do": "click",
          "on": "div.button"
        }
      ]
    }
  ]
}
```

A shortlet with several actions. Start with "blur" to exit possible input fields, check all checkboxes, click save, what half a second and then return the the previous page.

```json
{
  "shortlets": [
    { "id": "example_click_button", "title": "Click a button", "conditions": { "url": "example.com" }, "shortcut": "ctrl+g", "actions": [{ "do": "click", "on": "div.button" }] },
    {
      "id": "exmaple_check_all_checkboxes",
      "title": "Check all checkboxes and go back",
      "conditions": {
        "url": "example.com"
      },
      "actions": [
        {
          "do": "blur"
        },
        {
          "do": "check",
          "for": "each",
          "on": "input[type=checkbox]",
          "value": true
        },
        {
          "do": "click",
          "on": "button",
          "text": "save"
        },
        {
          "do": "goto",
          "history": "back",
          "delay": 500
        }
      ]
    }
  ]
}
```

### Advanced

A shortlet activating a delete dialog and click confirm, repeated 5 times.

```json
{
  "id": "example_delete_multiple",
  "title": "Delete 5 objects ⚠️",
  "conditions": {
    "url": "example.com"
  },
  "shortcut": "shift+alt+backspace",
  "repeat": 5,
  "actions": [
    {
      "do": "blur",
      "delay": 900
    },
    {
      "do": "keypress",
      "key": "Backspace",
      "options": {
        "altKey": true
      }
    },
    {
      "do": "click",
      "on": "button.confirm-delete"
    }
  ]
}
```

---

## Details

A _shortlet_ is a custom command. You configure it to perform the hack you desire. Each shortlet contains one or more actions, conditions and other properties. Shortlets are run from the command palette aka. the launcher.

An _action_ is a predefined piece of code that is performed when you run the shortlet. It has a set of defined input values. There are different types of actions, most of them does something with the DOM.

_Conditions_ decide if a shortlet should be available for a certain webpage. Currently, only URL conditions are supported.

Other shortlet properties are _id_, _title_, _shortcut_, and _repeat_.

---

## Actions overview

Each action is written as a JSON object with the following key-value pairs:

### Mandatory properties

- `"do": "action code"` What action to run. Mandatory.

### Element selection properties

- `"on": "selector"` Almost always needed. Defines the list of elements to apply the action to by running querySelectorAll with the provided selector, then filter by _text_, _if_, and _for_.
- `"text": "regex"` Filters the selected list of elements by the value of their property _innerText_.
- `"if": "in view|frontmost"` Filters the list of selected elements by one/both of "in view" and "frontmost". Useful to avoid manipulating elements not currently visible.
- `"for": "FIRST|last|each|but_last|but_first|random"` Applied last, selecting elements based on position in the remaining list.

### Optional properties

- `"delay": 123` Wait the given amount of milliseconds **before** running the action.

### Properties depending on action

See each action below.

---

## List of Actions

Most actions require one or several elements to be selected, see _Element selection properties_ `on/text/if/for` above.

### Element interaction

| Action                            | Description                                                                     | Properties                                                                                |
| :-------------------------------- | :------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------- |
| **click**                         | Click on the selected elements                                                  | <ul><li>`on/text/if/for`</li></ul>                                                        |
| **blur**                          | Remove focus from all elements                                                  | <ul><li>`on/text/if/for`</li></ul>                                                        |
| **focus**                         | Focus the selected elements                                                     | <ul><li>`on/text/if/for`</li></ul>                                                        |
| **select**                        | Select the selected elements                                                    | <ul><li>`on/text/if/for`</li></ul>                                                        |
| **copy**                          | Copy the selected elements' _innerText_ to the clipboard, joined by a delimiter | <ul><li>`on/text/if/for`</li><li>`"delimiter": "\n"`</li></ul>                            |
| **set_text** <br> alias: write    | Change the _innerText_ of the selected elements                                 | <ul><li>`on/text/if/for`</li><li>`"value": "text"`</li></ul>                              |
| **append**                        | Not yet implemented                                                             |                                                                                           |
| **replace**                       | Not yet implemented                                                             | regex, all/one, only in inputs, on full page, always traverse children                    |
| **set_attribute** <br> alias: set | Change the selected elements HTML attribute                                     | <ul><li>`on/text/if/for`</li><li>`"attribute": "alt"`</li><li>`"value": "text"`</li></ul> |

### Element visibility

| Action     | Description                                                                                         | Properties                                                                                           |
| :--------- | :-------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **show**   | Show the selected elements by changing the _display_ and _opacity_ properties                       | <ul><li>`on/text/if/for`</li><li>`"as": "BLOCK\|flex\|inline\|..."`</li><li>`"opacity": 1`</li></ul> |
| **hide**   | Hide the selected elements with _display:none_                                                      | <ul><li>`on/text/if/for`</li></ul>                                                                   |
| **toggle** | Toggle visibility for the selected elements. Visible is achieved by changing the _display_ property | <ul><li>`on/text/if/for`</li><li>`"as": "BLOCK\|flex\|inline\|..."`</li></ul>                        |

### Styling

| Action           | Description                                                         | Properties                                                                                 |
| :--------------- | :------------------------------------------------------------------ | :----------------------------------------------------------------------------------------- |
| **style**        | Change the selected elements style property                         | <ul><li>`on/text/if/for`</li><li>`"property": "color"`</li><li>`"value": "#f9c"`</li></ul> |
| **add_class**    | Add a list of space separated classes to the selected elements      | <ul><li>`on/text/if/for`</li><li>`"class": "class-one class-two"`</li></ul>                |
| **remove_class** | Remove a list of space separated classes from the selected elements | <ul><li>`on/text/if/for`</li><li>`"class": "class-one class-two"`</li></ul>                |
| **toggle_class** | Toggle a list of space separated classes on the selected elements   | <ul><li>`on/text/if/for`</li><li>`"class": "class-one class-two"`</li></ul>                |
| **stylesheet**   | Add the given css code to the page in a _style_ tag                 | <ul><li>`"css": "code"`</li></ul>                                                          |

### Form interaction

| Action         | Description                                                                                                                     | Properties                                                                                                         |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------- |
| **input**      | Input a value into the selected elements. By default, trying to trigger data-binding code. Alternatively use simple assignment. | <ul><li>`on/text/if/for`</li><li>`"value": "text"`</li><li>`"use": "ADVANCED\|simple"`</li></ul>                   |
| **check**      | Change the selected checkbox elements. By default, trying to trigger data-binding code. Alternatively use simple assignment.    | <ul><li>`on/text/if/for`</li><li>`"value": TRUE\|false"`</li><li>`"use": "ADVANCED\|simple"`</li></ul>             |
| **input_from** | Add the selected elements matching _innerText_ to the selected inputs.                                                          | <ul><li>`text/if/for`</li><li>`"from": "selector"`</li><li>`"match": "regex"`</li><li>`"to": "selector"`</li></ul> |

### Create elements

| Action                                  | Description                                                                                                                                                    | Properties                                                                                                                                                                      |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **duplicate**                           | Clone the selected elements and add new after them themselves. Optionally append the new elements id with a code.                                              | <ul><li>`on/text/if/for`</li><li>`"id": "-code"`</li></ul>                                                                                                                      |
| **reveal_data**                         | Create span elements with the matching text from the selected elements dataset attribute. Optionally style the span and define a target _parent_ for the span. | <ul><li>`on/text/if/for`</li><li>`"data": "dataSetNameCamelCase"`</li><li>`"match": "regex"`</li><li>`"target": "PARENT\|selector"`</li><li>`"style": "inline style"`</li></ul> |
| **reveal_attribute** <br> alias: reveal | Create span elements with the matching text from the selected elements html attribute. Optionally style the span and define a target _parent_ for the span.    | <ul><li>`on/text/if/for`</li><li>`"attribute": "name"`</li><li>`"match": "regex"`</li><li>`"target": "PARENT\|selector"`</li><li>`"style": "inline style"`</li></ul>            |
| **tooltip**                             | Not yet implemented.                                                                                                                                           |                                                                                                                                                                                 |

### Events

| Action                                              | Description                                                                                         | Properties                                                                                                                                                                                                  |
| :-------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **dispatch** <br> aliases: trigger, keypress, mouse | Trigger an event on the selected elements.                                                          | <ul><li>`on/text/if/for`</li><li>`"event": "KEYDOWN\|click\|mousedown\|input\|..."`</li><li>`"options": "{ bubbles: true, cancelable: true, view: window }"`</li><li>`"key": "SPACE\|Enter\|..."`</li></ul> |
| **listen**                                          | Add an event listener to the selected elements and run the shortlet's actions when it is triggered. | <ul><li>`on/text/if/for`</li><li>`"event": "click\|keydown\|..."`</li><li>`"actions": [{action1}, {action2}]`</li></ul>                                                                                     |

### Browser interaction

| Action     | Description                                                                           | Properties                                                                                                                                                                            |
| :--------- | :------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **goto**   | Navigate to an url, append the current url or go back/forward in the browser history. | <ul><li>`"url": "https://"` or `"history": "back\|forward"`</li><li>`"append": FALSE\|true`</li></ul>                                                                                 |
| **scroll** | Scroll to the selected element into view, by a delta, or to a fixed position.         | <ul><li>`on/text/if/for`</li><li>`"to": "top,left"`</li><li>`"by": "delta top,delta left"`</li><li>`"options": "{ behavior: 'auto', block: 'nearest', inline: 'nearest' }"`</li></ul> |

### Script control and Utilities

| Action        | Description                             | Properties                         |
| :------------ | :-------------------------------------- | :--------------------------------- |
| **wait**      | Wait the given amount of milliseconds.  | <ul><li>`"delay": 123`</li></ul>   |
| **log**       | Print selected elements in console.log. | <ul><li>`on/text/if/for`</li></ul> |
| **highlight** | Not yet implemented.                    |                                    |

---

## Settings

### Command palette shortcut

Keyboard shortcut to show the shortlet launcher command palette.
**command-pal** uses the hotkeys-js package to capture keyboard input. [hotkeys-js documentation](https://github.com/jaywcjlove/hotkeys-js?tab=readme-ov-file#supported-keys) explains what keys you can use for this setting.

### Shortlets

The JSON object where you define your shortlets.

### Advanced settings

- **Trigger in inputs:** If keyboard shortcuts should be triggered within input, textarea and select elements.
- **Developer mode:** Add 'Developer tools' to the command palette and activate logging.

### command-pal Theme

Not yet implemented.

---

## Code building-blocks

### ShortletAPI.js

Exposes the shortlet actions described in the section _Actions_. In addition, there are internal functions doing the heavy lifting.

### MiniQueue.js

Allows you to setup and run a list of actions, one at a time. Supports queuing, start and delay between steps.

### CommandPal.js

A slightly modified copy of the [command-pal project](https://github.com/benwinding/command-pal).

### Shortlet.js

The main injection script that bootstraps Shortlet by fetching the shortlets from settings and loading them into CommandPal. Also, when needed, keeps track of elements inside and outside of the viewport.

### background.js

The extension backend, handling local storage and open the settings page.

### settings.html/.js/.css

Provide the extension settings page with HTML/CSS and code to access the persistant storage of the settings.

---

## You scrolled all the way down!

### Previous art

Nothing exists in vaccum. Shortlet is built from ideas I got when using the brilliant [Shortkeys browser extension](https://github.com/crittermike/shortkeys). [Alfred app](https://alfredapp.com) has been an inspiration for the command palette interface. ASCII art from [patorjk.com](https://patorjk.com/software/taag/)

### Guiding principles

Queues are cool, use natural language, have fun.

<br>

---

Pontus Sundén, 2025 - [hi@pontus.cc](mailto:hi@pontus.cc)
