# Shortlet - Alfred workflow

[⤓ Download Workflow]()

## About

This is the Alfred Workflow for Shortlet – a small utility to automate tasks in the browser.

## Installation

- Download and install workflow.
- Add your Shortlets to a shortlet.json file.
- Select your shortlet.json in Configure Workflow.

## Changelog

v3

- Create execute.jxa and move inject commands to it.
- Add readme.
- Add license.
- Add workflow icon.
- Replace domain with uri

v2

- Add "id" to shortlet definition.
- Use "id" to trigger pre-defined shortlets from single Hotkeys.
- Switched from nice browser names ("Google Chrome") to application id ("com.google.Chrome").
- Refactor JXA code to be run as shebang scripts.
- Move shortlets definitions to a separate file: shortlets.json

v1

- Run custom actions from Hotkey.
- Alfred workflow POC using Shortlet and Queue classes.
- Trigger filter by Hotkey.

## Roadmap

- Detect frontmost browser instead of using a pre-set var.
- Use website favicon
