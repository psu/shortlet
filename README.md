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

Other properties include _title_, _keyboard shortcut_, and _repeat_.

## Actions

### Syntax
Each action is written as a JSON object with some of the following key-value pairs: 

#### Common

- `"do": "action code"` Mandatory. 
- `"on": "selector"` Almost always needed. Defines the list of elements to apply the action to. Optionally filtered by _text_, _if_, or _for_.
- `"delay": milliseconds` Wait the given time **before** starting the action. 

#### Optional filters

- `"text": "regex"` Filters the list of elements by the value of their property `innerText`.
- `"if": "in view|frontmost"` Filters the list of elements by one/both of "in view" and "frontmost". Useful to avoid manipulating elements not currently visible. 
- `"for": "first|last|each|but_last|but_first|random"` Makes a selection from the remaining list of elements. 

#### Depending on action
- `class`
- `style`
- `attribute`
- `event`
- `id`
- `key`
- `as`


### List of Actions



## Documentation of Shorlet's components

### ShortletAPI

Exposes the shortlet actions described in the section _Actions_. In addition, there are internal functions doing the heavy lifting. 

### MiniQueue

Allows you to setup and run a list of actions, one at a time. Support for queuing, start and delay between steps. 

### CommandPal

A slightly modified copy of this project. 

### inject.js

The main injection script that bootstraps Shortlet by fetching the shortlets from settings and loading them into CommandPal. Also keeps track of elements in/out of the viewport when needed. 

### service-worker.js

The Chrome extension backend, handling local storage and open the settings page. 

# Previous art
Nothing exists in vaccum. Shortlet is built on ideas from the Shortkeys browser extension. Alfred app has been an inspiration for the command palette interface. 
