# Shortlet

**Tinker with Websites**

Shortlet is a framework to configure and launch small hacks for the web. You can ease your day-to-day by: 

- Create keyboard shortcuts
- Multiple actions with one click
- Simple DOM manipulation without coding

Shortlet comes as a Chrome extension, providing automatic webpage injection and a simple settings UI.

## Usage

Download the code and load the folder _src_ as an unpacked extension in Chrome.
Launch the command palette with the default shortcut `ctrl+space` or click the extension icon to open the settings.

## Details

A _shortlet_ is a custom command. You configure it with the details needed to perform a small hack on a webpage. Each shortlet contains a list of actions, conditions and other properties. Shortlets are run by the launcher.

An _action_ is a predefined piece of code that are run with a set of defined input values. There are actions of different types, but most of them does something in the DOM. 

A _condition_ needs to be met for a shortlet to be available. Currently, only URL conditions are supported. 

Other properties include _id_, _title_, _shortcut_, and _repeat_.

## Actions

### Syntax
Each action is written as a JSON object with the following key-value pairs: 

#### Mandatory properties

- `"do": "action code"` What action to run. Mandatory. 

#### Element selection properties

- `"on": "selector"` Almost always needed. Defines the list of elements to apply the action to by running querySelectorAll with the provided selector, then filter by _text_, _if_, and _for_.
- `"text": "regex"` Filters the selected list of elements by the value of their property _innerText_.
- `"if": "in view|frontmost"` Filters the list of selected elements by one/both of "in view" and "frontmost". Useful to avoid manipulating elements not currently visible. 
- `"for": "**first**|last|each|but_last|but_first|random"` Applied last, selecting elements based on position in the remaining list. 

#### Optional properties
- `"delay": milliseconds` Wait the given time **before** starting the action. 

#### Properties depending on action
See the list of actions below for details about the additional properties: `value`, `class`, `id`, `style`, `css`, `data`, `attribute`, `property`, `event`, `key`, `as`, `history`, `url`, `append`,

### List of Actions
These properties are applicable to all actions and described above: `on`, `text`, `if`, `for`, and `delay`.

#### Script control and Utilities 
- **wait:** Wait `delay: 123` milliseconds.
- **log:** Add selected elements to console.log. 
- **highlight:** Not yet implemented. 

#### Browser interaction
- **goto:** Navigate to an `url` or `history: back|forward`. Set `append: true` to not append the location with `url` rather than replace.

#### Webpage interaction
- **click:** Click on the selected elements `times` number of times. 
- **scroll:** Scroll either to the selected elements or to a fixed postition `top: y`, `left: x`.

#### Element interaction
- **blur:** Remove focus from all elements. 
- **focus:** Focus the selected elements. 
- **select:** Select the selected elements. 
- **copy:** Copy the selected elements' _innerText_ to the clipboard, joined by `divider: **\n**`

#### Element visibility
    
- **show:** Show the selected elements `as: **block**` 
- **hide:** Hide the selected elements 
- **toggle:** Toggle visibility for the selected elements. Use `as` when shown. 

#### Element styling
- **style:**  o => {
      el(o).forEach(e => (e.style[o.property] = o.value))
    },
    add_class: o => {
      el(o).forEach(e => e.classList.add(...o.class.split(' ')))
    },
    remove_class: o => {
      el(o).forEach(e => e.classList.remove(...o.class.split(' ')))
    },
    toggle_class: o => {
      el(o).forEach(e => e.classList.toggle(...o.class.split(' ')))
    },
    stylesheet: o => {
      const s = document.createElement('style')
      s.textContent = o.css
      document.head.appendChild(s)
    },
    // forms
    input: o => {
      el(o).forEach(e => {
        if (o.use && o.use === 'plain') {
          e.value = o.value
        } else {
          setInput(e, 'value', o.value)
          if (o.key) dispatchKeyboardEvent(e, 'keydown', o.key)
        }
      })
    },
    check: o => {
      el(o).forEach(e => setChecked(e, o.value))
    },
    // dom manipulation
    write: this.set_text,
    set_text: o => {
      el(o).forEach(e => (e.innerText = o.text))
    },
    duplicate: o => {
      el(o).forEach(old => {
        const dup = old.cloneNode(true)
        old.after(dup)
        dup.id = o.id
      })
    },
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






## Settings

### Trigger shortcut

### Shortlets

### Advanced settings

### command-pal Theme

## Code building blocks

### ShortletAPI

Exposes the shortlet actions described in the section _Actions_. In addition, there are internal functions doing the heavy lifting. 

### MiniQueue

Allows you to setup and run a list of actions, one at a time. Supports queuing, start and delay between steps. 

### CommandPal

A slightly modified copy of the [command-pal project](https://github.com/benwinding/command-pal).

### inject.js

The main injection script that bootstraps Shortlet by fetching the shortlets from settings and loading them into CommandPal. Also, when needed, keeps track of elements inside and outside of the viewport. 

### service-worker.js

The extension backend, handling local storage and open the settings page. 

### settings.html/.js/.css

Extension settings HTML/CSS and persistence. 

# You scrolled all the way down!

## Previous art
Nothing exists in vaccum. Shortlet is built from ideas I got when using the brilliant [Shortkeys browser extension](https://github.com/crittermike/shortkeys). [Alfred app](https://alfredapp.com) has been an inspiration for the command palette interface. 

## Guiding principles 
- Use natural language. 
- Queues are cool. 
- Premature optimization is immature.
