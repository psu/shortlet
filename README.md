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

#### Common properties

- `"do": "action code"` Mandatory. 
- `"on": "selector"` Almost always needed. Defines the list of elements to apply the action to. Optionally filtered by _text_, _if_, or _for_.
- `"delay": milliseconds` Wait the given time **before** starting the action. 

#### Optional filter properties

- `"text": "regex"` Filters the list of elements by the value of their property _innerText_.
- `"if": "in view|frontmost"` Filters the list of elements by one/both of "in view" and "frontmost". Useful to avoid manipulating elements not currently visible. 
- `"for": "first|last|each|but_last|but_first|random"` Makes a selection from the remaining list of elements. 

#### Properties depending on action
See the list of actions below for details about the additional properties: `class`, `id`, `style`, `data`, `attribute`, `property`, `event`, `key`, `as`.

### List of Actions

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
