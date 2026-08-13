# ADR 0001: Portfolio Workbench presentation

- Status: Accepted
- Date: 2026-08-08

## Context

The requested visual language is the developer's familiar Visual Studio 2022 workspace.
The portfolio must still be responsive, semantic, accessible, and indexable while delivering
the high-fidelity Visual Studio experience requested by its owner.

## Decision

Use a Visual Studio 2022 workbench presentation: compact command chrome, route-backed C#
document tabs, a nine-project solution hierarchy, resizable and pinnable tool windows, code
search, syntax colors, output, and status bars. Use the official Visual Studio 2022 product
icon as the application mark.

The reference screenshot itself is not shipped. The shell recreates its layout and interaction
grammar in semantic HTML; every visible portfolio command has a real action and the editor
content remains accessible HTML rather than a painted screenshot. The product icon identifies
the visual reference and does not imply Microsoft ownership of the portfolio.

On small screens, the workbench becomes a mobile document app with sheets and a bottom dock.
For print, all application chrome disappears and the document renders on a clean light page.

## Consequences

- The experience deliberately feels familiar to a Visual Studio user while remaining a web portfolio.
- Deep links and browser history remain conventional.
- The shell needs more interaction and accessibility testing than a normal landing page.
- Article reading views deliberately reduce visual density while retaining the workbench frame.
