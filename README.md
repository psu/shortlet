# Shortlet

**Tinker with Websites**

Shortlet is a framework to configure and launch small hacks for the web. You can ease your day-to-day by:

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

See the list of actions below.

---

## List of Actions

Most actions require one or several elements to be selected, see _Element selection properties_ above.

### Script control and Utilities

- **wait** Wait the given amount of milliseconds:
  - `"delay": 123`
- **log** Add selected elements to console.log.
- **highlight** Not yet implemented..

### Browser interaction

- **goto** Navigate to an url, append the current url or go back/forward in the browser history:
  - `"url": "https://"` or `"history": "back|forward"`
  - `"append": FALSE|true`
- **scroll** Scroll to the selected element or to a fixed postition:
  - `on/test/if/for`
  - `"top": y`
  - `"left": x`

### Element interaction

- **click** Click on the selected elements:
  - `on/test/if/for`
- **blur** Remove focus from all elements:
  - `on/test/if/for`
- **focus** Focus the selected elements:
  - `on/test/if/for`
- **select** Select the selected elements:
  - `on/test/if/for`
- **copy** Copy the selected elements' _innerText_ to the clipboard, joined by a delimeter:
  - `on/test/if/for`
  - `"delimiter": "\n"`
- **set_text** (alias: write) Change the _innerText_ of the selected elements:
  - `on/test/if/for`
  - `"value": "text"`

### Element visibility

- **show** Show the selected elements by changing the _display_ and _opacity_ properties:
  - `on/test/if/for`
  - `"as": "BLOCK|flex|inline|..."`
  - `"opacity": 1`..
- **hide** Hide the selected elements with _display: none_:
  - `on/test/if/for`
- **toggle** Toggle visibility for the selected elements. Visible is achieved by chaning the _display_ property:
  - `on/test/if/for`
  - `"as": "BLOCK|flex|inline|..."`

### Styling

- **style** Change the selected elements style property:
  - `on/test/if/for`
  - `"property": "color"`
  - `"value": "#f9c"`
- **add_class** Add a list of space separated classes to the selected elements:
  - `on/test/if/for`
  - `"class": "class-one class-two"`
- **remove_class** Remove a list of space separated classes from the selected elements:
  - `on/test/if/for`
  - `"class": "class-one class-two"`
- **toggle_class** Toggle a list of space separated classes on the selected elements:
  - `on/test/if/for`
  - `"class": "class-one class-two"`
- **stylesheet** Add the given css code to the page in a _style_ tag:
  - `"css": "code"`

### Form interaction

- **input** Input a value into the selected elements. By default, trying to trigger data-binding code. Alternatively use simple assignment:
  - `on/test/if/for`
  - `"value": "text"`
  - `"use": "ADVANCED|simple"`
- **check** Change the selected checkbox elements. By default, trying to trigger data-binding code. Alternatively use simple assignment:
  - `on/test/if/for`
  - `"value": TRUE|false`..
- **duplicate** Clone the selected elements and add new after them themselves. Optionally.. append the new elements id with a code:
  - `on/test/if/for`
  - `"id": "-code"`
- **set_attribute** (alias: set) Change the selected elements HTML attribute:
  - `on/test/if/for`
  - `"attribute": "alt"`
  - `"value": "text"`
- **dispatch** (alias: trigger, keypress, mouse) Trigger an event on the selected elements:
  - `on/test/if/for`
  - `"event": "KEYDOWN|click|mousedown|input|..."`
  - `"options": "{ bubbles: true, cancelable: true, view: window }"`
  - `"key": "SPACE|Enter|s"` -**listen** Add an event listener to the selected elements and run the shortlet's actions when it is triggered:
  - `on/test/if/for`
  - `"event": "click|keydown|..."`..
  - `"actions": [{action}, {action}]`
    reveal_data: o => {
    el(o).forEach(e => addSpan(e, e.dataset[o.data] || '', o.target, o.style))
    },
    reveal: this.reveal_attribute,
    reveal_attribute: o => {
    o.attribute = o.attribute || o.attr
    el(o).forEach(e => addSpan(e, e.getAttribute(o.attribute) || '', o.target, o.style))
    },
    // spcial actions
    input_from: o => {
    el({ ...o, on: o.from }).forEach(e => {
    const match = e.innerText.match(new RegExp(o.match || '.\*'))
    if (match === null) return
    el({ ...o, on: o.to || o.on }).forEach(e => setInput(e, 'value', match.length === 1 ? match[0] : match.slice(1).join(o.join || ' ')))
    })
    },
    tooltip: Not yet implemented

---

## Settings

### Trigger shortcut

### Shortlets

### Advanced settings

### command-pal Theme

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
