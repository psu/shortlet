# Shortlet

**Tinker with Websites**

Shortlet is a framework to configure and launch small hacks for the web. You can ease your day-to-day by: 

- Create keyboard shortcuts
- Multiple actions with one click
- Webpage manipulation without coding

Shortlet comes as a Chrome extension, providing automatic webpage injection and a simple settings UI.

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

A _shortlet_ is a custom command. You configure it with the details needed to perform a small hack on a webpage. Each shortlet contains a list of actions, conditions and other properties. Shortlets are run by the launcher.

An _action_ is a predefined piece of code that are run with a set of defined input values. There are actions of different types, but most of them does something in the DOM. 

A _condition_ needs to be met for a shortlet to be available. Currently, only URL conditions are supported. 

Other shortlet properties include _id_, _title_, _shortcut_, and _repeat_.

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
- **wait:** Wait `"delay": 123` milliseconds.
- **log:** Add selected elements to console.log. 
- **highlight:** Not yet implemented..

### Browser interaction
- **goto:** Navigate to an `"url": "https://"` or `"history": "back|forward"`. Set `"append": true` to append the url to location instead of  replace.
- **scroll:** Scroll either to the selected element, or to the fixed postition `"top": y`, `"left": x`.

### Element interaction

- **click:** Click on the selected elements `"times": 2` number of times..
- **blur:** Remove focus from all elements. 
- **focus:** Focus the selected elements. 
- **select:** Select the selected elements. 
- **copy:** Copy the selected elements' _innerText_ to the clipboard, joined by `"divider": "\n"`..
- **set_text:** (alias: write) Set the _innerText_ of the selected elements to `"value": "text"`..

### Element visibility
    
- **show:** Show the selected elements by setting _display_ to `"as": "BLOCK|flex|inline|..."`.
- **hide:** Hide the selected elements.
- **toggle:** Toggle visibility for the selected elements. Visible is achieved by setting _display_ to `"as": "BLOCK|flex|inline|..."`. 

### Styling

- **style:** Set the selected elements style `"property": "color"` to `"value": "#f9c"`.
- **add_class:** Add a list of space separated `"class": "one two"` to the selected elements. 
- **remove_class:**  Remove the given list of space separated `"class": "one two"` from the selected elements.
- **toggle_class:** Toggle a list of space separated `"class": "one two"` on the selected elements.
- **stylesheet:** Add the given `"css": "code"` to the page in a _style_ tag. 

### Form interaction

- **input:** Input a `"value": "text"` into the selected element. Changing the value can be followed by a _keydown_ event with `"key"; "code"`. The value is set by sending events that will trigger data-binding code. With `"use": "plain"` the value is simply assigned.  
- **check:** Set the selected checkbox elements to `"value": "checked"`. Assign an empty value to _uncheck_. The value is set by sending events that will trigger data-binding code. With `"use": "plain"` the value is simply assigned..

        
    // dom manipulation
 
- **duplicate:** Clone the selected elements and add them after them themselves and append the id with `"id": "-code"`..

    set: this.set_attribute,
    set_attribute: o => {
      o.attribute = o.attribute || o.attr
      el(o).forEach(e => e.setAttribute(o.attribute, o.value))
    },
    // event stuff
    dispatch: this.trigger,
    trigger: o => {
      el(o).forEach(e => dispatchEvent(e, o.event, o.options))
    },
    keypress: o => {
      let elms = el(o)
      if (elms.length === 0) elms = [window]
      elms.forEach(e => dispatchKeyboardEvent(e, o.event || 'keydown', o.key, o.options))
    },
    listen: o => {
      el(o).forEach(e =>
        e.addEventListener(o.for, () => {
          Shortlet.run(o.actions)
        })
      )
    },
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
        const match = e.innerText.match(new RegExp(o.match || '.*'))
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
