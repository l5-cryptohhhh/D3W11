# Product

## Register

product

## Users

Student (course exercise, Epicode). Practices TS fundamentals by porting a working JS app to React + TypeScript. End result is used the same way as the original: search a sports team, view its next fixtures / last results, save favorites.

## Product Purpose

SportsHub: search a sports team (thesportsdb API), filter by sport, view upcoming events and last results, save favorite teams to localStorage, see aggregated upcoming/past events across favorites. Success = 1:1 functional and visual parity with the reference vanilla-JS implementation (github.com/l5-cryptohhhh/Compito-Settimana-7), rebuilt in React + TypeScript.

## Brand Personality

Utilitarian, clean, no-nonsense — matches the reference: navy header (#193366), light gray-blue background, flat cards, no decorative flourishes.

## Anti-references

N/A — visual design is fixed by the reference implementation, not open for reinterpretation.

## Design Principles

- Faithful port: same DOM structure/classes/behavior, translated to React state instead of manual DOM mutation.
- No new abstractions beyond what the original script already has (classes/helpers only where the original used them).
- TypeScript types model the thesportsdb API responses and the app's own Team/Event shapes.

## Accessibility & Inclusion

Keep what the reference already does: focus-visible outlines, aria-label on icon-only/role=button elements, role="alert" for errors, role="dialog" + Escape-to-close modal, prefers-reduced-motion handling.
