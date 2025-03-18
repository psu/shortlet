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

| Action            | Description                                                                     | Parameters                                                             |
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
