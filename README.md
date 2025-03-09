# Shortlet

**Tinker with Websites**

Shortlet is a framework to configure and launch small hacks for the web. You can smoothen your day-to-day by: 

- Create keyboard shortcuts
- Multiple actions with one click
- Simple DOM manipulation without coding

Shortlet comes as a Chrome extension, providing automatic webpage injection and a simple settings UI.

## Usage

Download the code and load the folder _src_ as an unpacked extension in Chrome.
Click the extension icon to open settings or launch the command palette with the default shortcut `ctrl+space`.

## Details

A _shortlet_ is a custom command. You configure it with the details needed to perform a small hack on a webpage. Each shortlet contains a list of actions, conditions and other properties. Shortlets are run by the launcher.

An _action_ is a predefined piece of code that are run with a set of defined input values. There are actions of different types, but most of them does something in the DOM. 

A _condition_ needs to be met for a shortlet to be available. Currently, only URL conditions are supported. 

## Documentation of Shorlet's components

### ShortletAPI

### MiniQueue

### CommandPal

### inject.js

### service-worker.js

## ShortletAPI

# Previous art
Nothing exists in vaccum. Shortlet is built on ideas from the Shortkeys browser extension. The Alfred app has been an inspiration for the command pallet interface. 
- 