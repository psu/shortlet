# Shortlet

**Tinker with Websites**

Shortlet is a framework to configure and launch small hacks for the web. Ease your day-to-day by:

- Create keyboard shortcuts
- Multiple actions with one click
- Webpage manipulation without coding

Shortlet comes as a Chrome extension, providing automatic webpage injection, a command palette and a settings UI.

---

## Usage

1. Download and load the folder _src_ as an unpacked extension in Chrome.
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

### Syntax

Each action is written as a JSON object with the following key-value pairs:

#### Mandatory properties

- `"do": "action code"` What action to run. Mandatory.

#### Element selection properties

- `"on": "selector"` Almost always needed. Defines the list of elements to apply the action to by running querySelectorAll with the provided selector, then filter by _text_, _if_, and _for_.
- `"text": "regex"` Filters the selected list of elements by the value of their property _innerText_.
- `"if": "in view|frontmost"` Filters the list of selected elements by one/both of "in view" and "frontmost". Useful to avoid manipulating elements not currently visible.
- `"for": "FIRST|last|each|but_last|but_first|random"` Applied last, selecting elements based on position in the remaining list.

#### Optional properties

- `"delay": 123` Wait the given amount of milliseconds **before** running the action.

#### Properties depending on action

See each action below.

---

## List of Actions

Most actions require one or several elements to be selected, see _Element selection properties_ `on/test/if/for` above.

### Element interaction

| Action            | Description                                                                     | Properties                                                             |
| ----------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **click**         | Click on the selected elements                                                  | `on/test/if/for`                                                       |
| **blur**          | Remove focus from all elements                                                  | `on/test/if/for`                                                       |
| **focus**         | Focus the selected elements                                                     | `on/test/if/for`                                                       |
| **select**        | Select the selected elements                                                    | `on/test/if/for`                                                       |
| **copy**          | Copy the selected elements' _innerText_ to the clipboard, joined by a delimiter | `on/test/if/for` <br> `"delimiter": "\n"`                              |
| **set_text**      | (alias: write) Change the _innerText_ of the selected elements                  | `on/test/if/for` <br> `"value": "text"`                                |
| **append**        | Not yet implemented                                                             |                                                                        |
| **replace**       | Not yet implemented                                                             | regex, all/one, only in inputs, on full page, always traverse children |
| **set_attribute** | (alias: set) Change the selected elements HTML attribute                        | `on/test/if/for` <br> `"attribute": "alt"` <br> `"value": "text"`      |

### Element visibility

| Action     | Description                                                                                         | Properties                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **show**   | Show the selected elements by changing the _display_ and _opacity_ properties                       | `on/test/if/for` <br> `"as": "BLOCK&vert;flex&vert;inline&vert;..."`<br>`"opacity": 1` |
| **hide**   | Hide the selected elements with _display:none_                                                      | `on/test/if/for`                                                                       |
| **toggle** | Toggle visibility for the selected elements. Visible is achieved by changing the _display_ property | `on/test/if/for` <br> `"as": "BLOCK&vert;flex&vert;inline&vert;..."`                   |

### Styling

| Action           | Description                                                         | ParamPropertieseters                                               |
| ---------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **style**        | Change the selected elements style property                         | `on/test/if/for` <br> `"property": "color"` <br> `"value": "#f9c"` |
| **add_class**    | Add a list of space separated classes to the selected elements      | `on/test/if/for` <br> `"class": "class-one class-two"`             |
| **remove_class** | Remove a list of space separated classes from the selected elements | `on/test/if/for` <br> `"class": "class-one class-two"`             |
| **toggle_class** | Toggle a list of space separated classes on the selected elements   | `on/test/if/for` <br> `"class": "class-one class-two"`             |
| **stylesheet**   | Add the given css code to the page in a _style_ tag                 | `"css": "code"`                                                    |

### Form interaction

| Action         | Description                                                                                                                     | Properties                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **input**      | Input a value into the selected elements. By default, trying to trigger data-binding code. Alternatively use simple assignment. | `on/test/if/for` <br> `"value": "text"` <br> `"use": "ADVANCED&vert;simple"`            |
| **check**      | Change the selected checkbox elements. By default, trying to trigger data-binding code. Alternatively use simple assignment.    | `on/test/if/for` <br> `"value": TRUE&vert;false"` <br> `"use": "ADVANCED&vert;simple"`  |
| **input_from** | Add the selected elements matching _innerText_ to the selected inputs.                                                          | `test/if/for` <br> `"from": "selector"` <br> `"match": "regex"` <br> `"to": "selector"` |

### Create elements

| Action                               | Description                                                                                                                                                    | Properties                                                                                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **duplicate**                        | Clone the selected elements and add new after them themselves. Optionally append the new elements id with a code.                                              | `on/test/if/for` <br> `"id": "-code"`                                                                                                                 |
| **reveal_data**                      | Create span elements with the matching text from the selected elements dataset attribute. Optionally style the span and define a target _parent_ for the span. | `on/test/if/for` <br> `"data": "dataSetNameCamelCase"` <br> `"match": "regex"` <br> `"target": "PARENT&vert;selector"` <br> `"style": "inline style"` |
| **reveal_attribute** (alias: reveal) | Create span elements with the matching text from the selected elements html attribute. Optionally style the span and define a target _parent_ for the span.    | `on/test/if/for` <br> `"attribute": "name"` <br> `"match": "regex"` <br> `"target": "PARENT&vert;selector"` <br> `"style": "inline style"`            |
| **tooltip**                          | Not yet implemented.                                                                                                                                           |                                                                                                                                                       |

### Events

| Action                                         | Description                                                                                         | Properties                                                                    |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **dispatch** (alias: trigger, keypress, mouse) | Trigger an event on the selected elements.                                                          | `on/test/if/for` <br> `"event": "KEYDOWN&vert;click&vert;mousedown&vert;input | ..."`<br>`"options": "{ bubbles: true, cancelable: true, view: window }"`<br>`"key": "SPACE&vert;Enter&vert;s"` |
| **listen**                                     | Add an event listener to the selected elements and run the shortlet's actions when it is triggered. | `on/test/if/for` <br> `"event": "click&vert;keydown                           | ..."`<br>`"actions": [{action1}, {action2}]`                                                                    |

### Browser interaction

| Action     | Description                                                                           | Properties                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **goto**   | Navigate to an url, append the current url or go back/forward in the browser history. | `"url": "https://"` or `"history": "back&vert;forward"` <br> `"append": FALSE&vert;true`                                                                   |
| **scroll** | Scroll to the selected element into view, by a delta, or to a fixed position.         | `on/test/if/for` <br> `"to": "top,left"` <br> `"by": "delta top,delta left"` <br> `"options": "{ behavior: 'auto', block: 'nearest', inline: 'nearest' }"` |

### Script control and Utilities

| Action        | Description                             | Properties       |
| ------------- | --------------------------------------- | ---------------- |
| **wait**      | Wait the given amount of milliseconds.  | `"delay": 123`   |
| **log**       | Print selected elements in console.log. | `on/test/if/for` |
| **highlight** | Not yet implemented.                    |                  |

---

## Settings

### Command palette shortcut

Keyboard shortcut to show the shortlet launcher command palette.
**command-pal** uses the hotkeys-js package to capture keyboard input. [hotkeys-js documentation](https://github.com/jaywcjlove/hotkeys-js?tab=readme-ov-file#supported-keys) explains what keys you can use for this setting.

### Shortlets

The JSON object where you define your shortlets.

### Advanced settings

- **Trigger in input, textarea:** If keyboard shortcuts should be triggered within input elements.
- **Show dev tools:** Activates logging.

### command-pal Theme

Not yet implemented

---

## Code building-blocks

### ShortletAPI.js

Exposes the shortlet actions described in the section _Actions_. In addition, there are internal functions doing the heavy lifting.

### MiniQueue.js

Allows you to setup and run a list of actions, one at a time. Supports queuing, start and delay between steps.

### CommandPal.js

A slightly modified copy of the [command-pal project](https://github.com/benwinding/command-pal).

### inject.js

The main injection script that bootstraps Shortlet by fetching the shortlets from settings and loading them into CommandPal. Also, when needed, keeps track of elements inside and outside of the viewport.

### service-worker.js

The extension backend, handling local storage and open the settings page.

### settings.html/.js/.css

Provide the extension settings page with HTML/CSS and code to access the persistant storage of the settings.

---

## You scrolled all the way down!

### Previous art

Nothing exists in vaccum. Shortlet is built from ideas I got when using the brilliant [Shortkeys browser extension](https://github.com/crittermike/shortkeys). [Alfred app](https://alfredapp.com) has been an inspiration for the command palette interface.

### Guiding principles

- Use natural language.
- Queues are cool.
- Premature optimization is immature.

---

Pontus Sundén, 2025
