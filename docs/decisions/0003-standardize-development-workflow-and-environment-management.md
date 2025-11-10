---
status: "accepted"
date: 2025-11-07
---

# Standardize Development Workflow

## Context and Problem Statement

How should developers run, test, and manage both backend and frontend services in the monorepo? Need simple, unified commands.

## Decision Drivers

- Simple unified commands for all operations
- Easy onboarding for new developers
- Cross-platform compatibility
- Minimal context switching

## Considered Options

1. Root-level npm scripts (chosen)
2. Independent commands per service
3. Makefile-based workflow
4. Shell scripts

## Decision Outcome

Chosen option: **Root-level npm scripts**

Commands from root: `npm run dev`, `npm run build`, `npm run test`, `npm run stop`

Uses `concurrently` to run both services. Backend starts immediately, frontend after 15s delay.

### Consequences

- Good: Single source of commands, familiar npm interface
- Good: Easy onboarding (`npm install && npm run setup && npm run dev`)
- Bad: Requires npm even for backend-only work

## Pros and Cons of the Options

### Root-level npm scripts

- Good: Unified interface, self-documenting
- Bad: Adds indirection over native tools

### Independent commands per service

- Good: Direct tool access
- Bad: Must remember different commands, navigate directories

### Makefile-based workflow

- Good: Standard Unix tool
- Bad: Not cross-platform (Windows issues)

### Shell scripts

- Good: Simple to understand
- Bad: Not cross-platform, harder to discover
