# Respond.io — Mobile Chat Application

> A production-minded React Native messaging client built as part of the **Respond.io Mobile Developer Assessment**, with a focus on maintainable architecture, server-state management, optimistic interactions, performance, reliability, and user experience.

<p align="center">

**React Native** · **Expo** · **TypeScript** · **Expo Router** · **TanStack React Query** · **Zustand**

</p>

<p align="center">

<a href="#screenshots">Screenshots</a> · <a href="#architecture">Architecture</a> · <a href="#key-engineering-highlights">Engineering Highlights</a> · <a href="#getting-started">Getting Started</a> · <a href="#testing--quality">Testing</a> · <a href="#known-limitations">Limitations</a>

</p>

---

## Overview

This project is a React Native chat application developed for the **Respond.io Mobile Developer Assessment**.

The application demonstrates a complete messaging-oriented user flow:

```text
Chats
  │
  ├── Browse contacts
  │
  ├── Infinite pagination
  │
  └── Open conversation
          │
          ├── View messages
          ├── Send message
          ├── Optimistic update
          └── Open contact profile
                    │
                    └── Block / Unblock

Settings
  │
  └── Application information
```

The implementation focuses on more than simply rendering screens. The project separates **server state from client state**, introduces an API abstraction layer, uses React Query for asynchronous data and caching, applies optimistic mutation patterns for messaging, and incorporates practical React Native performance techniques.

---

## Assessment Submission

| Resource             | Link                                                                                |
| -------------------- | ----------------------------------------------------------------------------------- |
| **Source Code**      | [GitHub Repository](https://github.com/MAsadIlyasNajum/respondio-mobile)            |
| **Release & APK**    | [GitHub Releases](https://github.com/MAsadIlyasNajum/respondio-mobile/releases)     |
| **Version Tags**     | [GitHub Tags](https://github.com/MAsadIlyasNajum/respondio-mobile/tags)             |
| **Milestone**        | [GitHub Milestones](https://github.com/MAsadIlyasNajum/respondio-mobile/milestones) |
| **Project Tracking** | [GitHub Project](https://github.com/MAsadIlyasNajum/respondio-mobile/projects/4)    |
| **API**              | [ResponseRift](https://responserift.dev/)                                           |

> **APK:** The Android APK is included in the repository/release as required by the assessment.

---

# Screenshots

The application UI and main user flows are shown below.

> Screenshots are intentionally kept as the primary visual demonstration of the application.
> Add the final captured screenshots to `docs/screenshots/` using the filenames below, or update the paths to match the actual repository.

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/70e658ff-cc3f-41f8-8ea2-e0dc0ecdc04e" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/4c92e5b5-6271-4250-8baa-b8b0c28cff74" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/8ae0badc-ec5c-4675-b5a6-bccdd5550b04" width="250"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/fe2af058-caa6-4e39-bc79-6330c1c209a7" width="250"/></td>
     <td><img src="https://github.com/user-attachments/assets/d76c1e7a-824a-4875-826c-ca9f8c4f0320" width="250"/></td>
     <td><img src="https://github.com/user-attachments/assets/e794dea7-5c89-47c3-8c8b-bb1e9ea473fb" width="250"/></td>
  </tr>
  <tr>
     <td><img src="https://github.com/user-attachments/assets/8f67c32a-8d37-452f-a1b6-3154bca93018" width="250"/></td>
      <td><img src="https://github.com/user-attachments/assets/f82ecdf2-7657-4f1c-b4a9-8efa156c1c70" width="250"/></td>

  </tr>
</table>

### Suggested Screenshot Set

The most useful screenshots for assessment review are:

- Chats / contact list
- Conversation screen
- Profile screen
- Settings screen
- Loading / skeleton state
- Empty state
- Error / retry state
- Optimistic message state, if visually distinguishable

The goal is to show both the **happy path** and the application's handling of real UI states.

---

# Key Engineering Highlights

### Architecture

- Feature-oriented React Native application structure
- Expo + Expo Router navigation
- Separation between presentation, feature logic, API access, and state
- Typed API interactions using TypeScript
- Clear ownership between server state and client state

### Server State

- TanStack React Query for asynchronous server state
- Query caching and cache reuse
- Infinite queries for contact pagination
- Targeted query invalidation
- Background refetching
- Pull-to-refresh integration
- Mutation lifecycle management

### Messaging

- Message history rendering
- Message composition and sending
- Optimistic message updates
- Mutation reconciliation
- Failed-message handling
- Message timestamps
- Message grouping
- Date separators

### UX

- Loading skeletons
- Empty states
- Error and retry states
- Pull-to-refresh
- Keyboard-aware message composition
- Safe-area handling
- Contact profile navigation
- Block/unblock feedback

### Performance

- `FlatList` virtualization
- Memoized list components
- Stable callbacks
- Efficient list rendering
- Image caching
- Avoidance of unnecessary server requests through React Query caching
- Efficient message transformation and deduplication

### Quality

- TypeScript
- Automated tests
- Linting
- Separation of concerns
- Explicit API error handling
- Documented architectural trade-offs

---

# Technology Stack

| Technology                              | Purpose                                         |
| --------------------------------------- | ----------------------------------------------- |
| **React Native**                        | Cross-platform mobile application               |
| **Expo**                                | React Native development and platform tooling   |
| **Expo Router**                         | File-based application navigation               |
| **TypeScript**                          | Static typing and safer application development |
| **TanStack React Query**                | Server-state management, caching and mutations  |
| **Zustand**                             | Lightweight client-side global state            |
| **Axios**                               | HTTP/API communication                          |
| **Reanimated**                          | UI animation where required                     |
| **expo-image**                          | Efficient image rendering and caching           |
| **Jest / React Native Testing Library** | Automated testing                               |

> Keep this table synchronized with `package.json`. Remove anything that is not actually installed or used in the final implementation.

---

# Architecture

The application follows a layered, feature-oriented architecture designed to keep UI concerns separate from data access and state management.

```text
┌──────────────────────────────────────────────┐
│                    Screens                   │
│                                              │
│       Chats · Chat · Profile · Settings     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              Feature Components              │
│                                              │
│   Contacts · Messages · Profile · Settings  │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                Feature Hooks                 │
│                                              │
│     React Query · Mutations · UI Logic      │
└──────────────────────┬───────────────────────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
┌────────────────────┐  ┌─────────────────────┐
│    Client State    │  │     Server State    │
│                    │  │                     │
│     Zustand        │  │   React Query       │
│                    │  │                     │
│  Blocked users     │  │ Users / Posts       │
└────────────────────┘  └──────────┬──────────┘
                                   │
                                   ▼
                         ┌─────────────────────┐
                         │       API Layer     │
                         │                     │
                         │  Typed API Client   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   ResponseRift API  │
                         └─────────────────────┘
```

## Separation of Responsibilities

### UI / Screens

Responsible for:

- Rendering application screens
- Navigation
- User interactions
- Loading/error/empty presentation

### Feature Layer

Responsible for:

- Feature-specific components
- Feature-specific hooks
- UI behavior
- Data transformation required by the feature

### React Query

Owns **server state**, including:

- Contacts
- Profiles
- Messages/posts
- Conversation-related server data
- Cache lifecycle
- Refetching
- Mutations
- Invalidation

### Zustand

Owns **client-controlled state** that does not belong to the server cache.

For this assessment, the primary example is:

- Blocked users

This avoids turning Zustand into a second server-state management system.

### API Layer

Provides a single boundary between application logic and the backend API.

This allows backend-specific details to remain isolated from UI components and makes the data layer easier to evolve.

---

# Project Structure

The project follows a feature-oriented structure.

```text
src/
├── api/
│   └── ...
│
├── app/
│   └── ...
│
├── components/
│   └── ...
│
├── features/
│   ├── chats/
│   ├── messages/
│   ├── profile/
│   └── settings/
│
├── store/
│   └── ...
│
├── theme/
│   └── ...
│
├── types/
│   └── ...
│
└── utils/
    └── ...
```

### Directory Responsibilities

| Directory     | Responsibility                       |
| ------------- | ------------------------------------ |
| `app/`        | Routes and application navigation    |
| `api/`        | API client and backend communication |
| `features/`   | Feature-specific UI, hooks and logic |
| `components/` | Shared reusable components           |
| `store/`      | Client-side global state             |
| `theme/`      | Application visual system/theme      |
| `types/`      | Shared TypeScript types              |
| `utils/`      | Reusable utility functions           |

The structure intentionally avoids putting all application logic into screens. Screens primarily compose features and coordinate navigation, while feature modules own their respective behavior.

---

# State Management Strategy

A key architectural decision is separating **server state** from **client state**.

## Server State — React Query

Server-owned data is managed through TanStack React Query.

Examples:

```text
Users
Profiles
Posts / Messages
Conversation-related data
```

React Query provides:

- Request lifecycle management
- Caching
- Background refetching
- Stale data management
- Mutation handling
- Query invalidation
- Cache synchronization

## Client State — Zustand

Zustand is reserved for local application state that does not need to be treated as server data.

Example:

```text
Blocked Users
```

This separation keeps the state model predictable:

```text
Backend owns data
      ↓
React Query

Application owns UI/client state
      ↓
Zustand
```

This prevents unnecessary duplication of server state between React Query and a global state store.

---

# React Query Strategy

React Query is used as the primary server-state layer.

## Queries

Typical query responsibilities include:

```text
Users
User Profile
Messages
Conversation-related data
```

Representative query-key patterns:

```ts
["users"][("user", userId)][("posts", { userId })];
```

> The exact query keys should remain aligned with the current implementation.

Structured query keys make cache ownership explicit and reduce accidental collisions between unrelated resources.

## Infinite Queries

The contacts list uses an infinite-query approach to support incremental loading as the user reaches the end of the list.

Conceptually:

```text
Initial request
      ↓
Page 1
      ↓
User reaches list end
      ↓
Page 2
      ↓
User reaches list end
      ↓
Page 3
      ↓
...
```

This avoids loading the entire contact dataset into the UI at once.

## Pull-to-Refresh

Pull-to-refresh triggers a React Query refetch while preserving the existing server-state architecture.

This keeps manual refresh behavior consistent with the normal query lifecycle.

## Cache Invalidation

Mutations that affect cached server data can invalidate or reconcile the relevant query rather than forcing unrelated parts of the application to refetch.

---

# Optimistic Messaging

One of the key engineering requirements of the assessment is optimistic message sending.

The intended lifecycle is:

```text
User taps "Send"
        │
        ▼
Create temporary client message
        │
        ▼
Update UI immediately
        │
        ▼
POST /api/posts
        │
        ├───────────────┐
        │               │
     Success          Failure
        │               │
        ▼               ▼
Reconcile with       Mark / handle
server response      failed mutation
        │               │
        ▼               ▼
Final message        Retry / recovery
```

## Why Optimistic Updates?

Messaging interfaces should feel immediate.

Waiting for the API response before displaying the user's message creates unnecessary perceived latency.

Optimistic updates allow the UI to respond immediately while the network request completes in the background.

## Reconciliation

Temporary client-side messages need to be reconciled with the server response to avoid:

- Duplicate messages
- Incorrect ordering
- Temporary records remaining permanently
- Cache inconsistencies

The implementation therefore treats optimistic data as temporary state that must eventually converge with the server representation.

## Failure Handling

Optimistic UI must also account for failure.

A failed mutation should not silently disappear.

The UI should provide an appropriate failure state and allow recovery/retry where supported by the implementation.

---

# Conversation Data Model

## Important API Consideration

The provided API is suitable for demonstrating the required frontend patterns, but it does not expose all of the concepts that a production messaging backend would normally provide.

In particular, the available post/message model is primarily author-oriented and does not provide a complete first-class conversation relationship such as:

```text
conversationId
participantId / recipientId
threadId
messageId
delivery status
read status
```

As a result, the frontend cannot mathematically reconstruct every possible two-sided conversation with the same guarantees as a backend designed specifically around conversations.

This is treated as a **backend/API limitation rather than hidden application behavior**.

The frontend keeps conversation-related logic isolated behind feature hooks and the API layer so that a future conversation-oriented backend can be adopted without requiring a rewrite of the presentation layer.

A production messaging API would ideally expose something closer to:

```text
Conversation
├── conversationId
├── participants[]
│
└── messages[]
    ├── messageId
    ├── senderId
    ├── recipientId
    ├── createdAt
    ├── content
    └── status
```

This distinction is important because frontend architecture should not compensate for missing backend domain semantics by creating assumptions that cannot be guaranteed.

---

# Chat List & Conversation Metadata

The Chats screen derives the information required to present a messaging-oriented contact list:

- Contact
- Avatar
- Display name
- Latest available message
- Timestamp

Where the backend does not provide first-class conversation metadata, the frontend derives what is possible from the available API response while keeping those assumptions isolated from the presentation layer.

The implementation also considers states such as:

- No available messages
- Incoming-only messages
- Outgoing messages
- Optimistic messages
- Failed messages
- Empty contacts
- Loading contacts
- Failed contact requests

---

# Performance Engineering

Performance was treated as part of the implementation rather than as a future-only concern.

## List Rendering

The application uses React Native's `FlatList` for virtualized rendering.

Relevant considerations include:

- Virtualized list rendering
- Memoized rows
- Stable callbacks
- Efficient keys
- Controlled rendering
- Avoidance of unnecessary parent-driven rerenders

For the current assessment workload, `FlatList` provides an appropriate native solution without introducing another list abstraction prematurely.

### FlatList vs FlashList

A migration to FlashList is not automatically assumed to be an optimization.

For a production application, the decision should be driven by:

1. Actual dataset size
2. Device performance
3. Rendering complexity
4. Profiling results
5. Measured frame/render performance

The current implementation therefore favors the simpler native virtualization approach unless profiling demonstrates a meaningful benefit from changing it.

## Message Rendering

Message rendering is optimized around:

- Memoized message components
- Efficient transformation
- Deduplication
- Stable list keys
- Message grouping
- Date grouping
- Avoiding unnecessary recalculation

For dynamic-height message bubbles, `getItemLayout` is not universally appropriate because message height depends on content and layout.

## Images

Contact avatars are rendered using an image implementation that supports efficient loading/caching.

This reduces unnecessary repeated image work during list scrolling.

## Network Efficiency

React Query helps reduce unnecessary network traffic through:

- Cache reuse
- Query deduplication
- Targeted refetching
- Controlled invalidation
- Background synchronization

---

# UI / UX

The application treats loading, empty, error and interaction states as first-class UI states rather than exceptional cases.

## Loading

Where appropriate, skeleton/loading states are used instead of leaving large areas of the screen blank.

## Empty States

Empty states communicate when there is no content to display rather than presenting an empty screen.

Examples include:

- No contacts
- No messages
- No available conversation data

## Error States

Network/API failures are surfaced through user-friendly error states with retry/recovery behavior where applicable.

## Messaging UX

The conversation experience includes:

- Message timestamps
- Message grouping
- Date separators
- Keyboard-aware input
- Scroll behavior
- Optimistic sending
- Failed-message handling

## Navigation

The primary flow is:

```text
Chats
  ↓
Conversation
  ↓
Profile
```

with Settings available through the bottom-tab navigation.

The interface is inspired by common modern messaging workflows without attempting to reproduce Respond.io's proprietary UI.

---

# Reliability & Error Handling

The application treats network communication as an unreliable boundary.

The API layer accounts for concerns such as:

- Request failures
- Timeout behavior
- Error normalization
- Loading states
- Mutation failures
- Cache consistency
- Manual refresh
- Recovery/retry behavior

Mutation retries require particular care for POST requests because blindly retrying a request can potentially produce duplicate side effects.

Where mutation retries are introduced in a production system, idempotency and server-side request identity should be considered.

---

# Security Considerations

The application follows frontend security-conscious practices appropriate for a mobile assessment, including:

- No hardcoded secrets
- Controlled API communication
- Safe handling of API errors
- Avoidance of unnecessary sensitive logging
- Dependency hygiene
- Safe rendering of API-provided content
- Input handling at the application boundary

However, frontend code cannot replace backend security controls.

The following ultimately require backend enforcement:

- Authentication
- Authorization
- Server-side validation
- Rate limiting
- Data isolation
- Access control
- Secure persistence
- Abuse prevention

These capabilities are outside the guarantees of the supplied demo API.

---

# Testing & Quality

Testing focuses on application behavior rather than simply maximizing test-count metrics.

Areas covered include:

- Feature hooks
- Components
- Message behavior
- Optimistic mutations
- Cache interactions
- Loading states
- Error states
- Refresh behavior
- Conversation data handling
- Block/unblock behavior

The project also uses:

```text
TypeScript
Linting
Automated Tests
```

Before submission, the following should be verified against the final repository:

```bash
# Example only — use the actual scripts defined in package.json

npm test

npm run lint

npx tsc --noEmit
```

> **Important:** Keep the commands above only if they exist in the final `package.json`. The README should always reflect the repository's actual commands and current verification status.

---

# API

The application uses the **ResponseRift API** supplied for the assessment.

**API:** https://responserift.dev/

## Endpoints Used

| Endpoint                    | Purpose                               |
| --------------------------- | ------------------------------------- |
| `GET /api/users`            | Fetch contacts/users                  |
| `GET /api/users/:id`        | Fetch contact profile                 |
| `GET /api/posts`            | Fetch available messages/posts        |
| `GET /api/posts?userId=:id` | Fetch messages associated with a user |
| `POST /api/posts`           | Create/send a message                 |

The frontend API layer keeps endpoint-specific behavior isolated from screen components.

> Only document endpoints that are actually used by the final implementation.

---

# Assignment Coverage

The implementation maps the assessment requirements to concrete application behavior.

| Assessment Requirement | Implementation                   |
| ---------------------- | -------------------------------- |
| Bottom Tabs            | Chats + Settings                 |
| Chats Screen           | Contact list                     |
| Fetch contacts         | React Query users query          |
| Contact avatar/name    | Contact list item                |
| Pagination             | Infinite query                   |
| Chat navigation        | Expo Router                      |
| Chat screen            | Messages feature                 |
| Fetch messages         | React Query                      |
| Message input          | Message input component          |
| Send message           | POST mutation                    |
| Optimistic update      | React Query mutation lifecycle   |
| Contact profile        | Profile screen                   |
| Profile data           | React Query                      |
| Block / Unblock        | Zustand                          |
| Settings               | Settings screen                  |
| Loading states         | Skeleton/loading UI              |
| Empty states           | Empty-state UI                   |
| Error handling         | Error/retry UI                   |
| Performance            | FlatList + memoization + caching |
| Testing                | Automated test suite             |
| APK                    | GitHub release/repository        |

---

# Engineering Decisions & Trade-offs

| Decision                          | Reason                                                                      |
| --------------------------------- | --------------------------------------------------------------------------- |
| **React Query for server state**  | Provides caching, synchronization and async lifecycle management            |
| **Zustand for client state**      | Lightweight solution for application-owned state                            |
| **Feature-oriented architecture** | Keeps related UI, hooks and logic together                                  |
| **API abstraction**               | Prevents backend-specific details from leaking into presentation components |
| **Optimistic mutations**          | Provides responsive messaging UX                                            |
| **FlatList**                      | Native virtualization appropriate for the current workload                  |
| **Memoized components**           | Reduces unnecessary list-item rerenders                                     |
| **Infinite query for contacts**   | Loads contact data incrementally                                            |
| **TypeScript**                    | Improves type safety and maintainability                                    |
| **Explicit error states**         | Makes network failures visible and recoverable                              |
| **Backend limitation isolation**  | Prevents API constraints from spreading through the UI layer                |

---

# Scalability Considerations

The frontend architecture is designed to evolve as the backend capabilities grow.

## Frontend Foundations

The current architecture provides foundations for:

- Cache-aware data access
- Virtualized lists
- Feature isolation
- Typed API communication
- Predictable state ownership
- Reusable components
- Optimistic interactions
- Testable feature logic

## Backend Capabilities Required for Production Messaging

A production-scale messaging platform would additionally require backend/platform capabilities such as:

- Authentication
- Authorization
- First-class conversation IDs
- Participant/recipient relationships
- Cursor-based message pagination
- Real-time transport
- WebSockets or SSE
- Push notifications
- Database indexing
- Distributed caching where appropriate
- Rate limiting
- Observability
- Analytics
- Message delivery/read states
- Idempotency
- Retry infrastructure

These are intentionally distinguished from frontend responsibilities.

---

# Known Limitations

The current limitations primarily originate from the assessment API rather than the React Native architecture.

### Backend / API

- No first-class conversation model
- No explicit recipient relationship for messages
- No real-time messaging transport
- No authentication/authorization model
- No delivery/read state
- Limited conversation semantics compared with a production messaging backend

### Application Scope

This project is intentionally scoped to the requirements of the assessment rather than attempting to implement a complete production messaging platform.

Where limitations exist, the frontend isolates the affected logic so the application can evolve when richer backend capabilities become available.

---

# Future Improvements

If this application were being evolved into a production messaging client, the highest-value next steps would be:

1. Introduce a first-class conversation API
2. Add cursor-based message pagination
3. Introduce real-time messaging
4. Add authentication and authorization
5. Add push notifications
6. Add message delivery/read receipts
7. Introduce an offline mutation queue
8. Add structured observability and crash reporting
9. Add product analytics
10. Profile performance on low-end devices and large datasets

The priority would be driven by actual product requirements and measured system behavior rather than adding complexity prematurely.

---

# AI-Assisted Development

The assessment explicitly permits the use of AI tools.

AI was used as a **development aid** for areas such as:

- Architectural brainstorming
- Implementation exploration
- Code review
- Debugging assistance
- Test-case generation
- Edge-case identification
- Documentation refinement

AI-generated suggestions were not treated as authoritative.

All final architectural decisions, implementation, testing, debugging, and validation were reviewed and performed by the developer.

The goal was to use AI to improve development efficiency while maintaining engineering ownership of the resulting codebase.

---

# Getting Started

## Prerequisites

Before running the project locally, ensure the required development environment is installed.

Typical requirements include:

- Node.js
- npm / package manager used by the repository
- Expo CLI / Expo tooling
- Android Studio and Android SDK for Android development
- Xcode for iOS development on macOS

> Use the exact versions recommended by the final project configuration.

## Installation

Clone the repository:

```bash
git clone https://github.com/MAsadIlyasNajum/respondio-mobile.git
```

Navigate into the project:

```bash
cd respondio-mobile
```

Install dependencies using the package manager configured by the project:

```bash
npm install
```

## Start Development

Use the project's configured Expo start command.

For example:

```bash
npx expo start
```

Then launch the application using the available Expo development options.

### Android

```bash
npx expo start --android
```

### iOS

```bash
npx expo start --ios
```

> Verify these commands against the final `package.json` and Expo configuration before submission.

---

# Project Workflow

The project was managed using a structured GitHub workflow rather than treating the assessment as a single unstructured coding task.

Development artifacts include:

- GitHub Project
- Milestone tracking
- Version tags
- Release management
- Repository documentation

This provides visibility into implementation progress and keeps the assessment work organized around incremental deliverables.

---

# Release

The application release and APK are available through GitHub Releases:

**[View Releases](https://github.com/MAsadIlyasNajum/respondio-mobile/releases)**

Version tags are available here:

**[View Tags](https://github.com/MAsadIlyasNajum/respondio-mobile/tags)**

---

# Assessment Notes

This project was developed specifically for the **Respond.io Mobile Developer Assessment**.

The implementation prioritizes:

```text
Correctness
    ↓
Maintainability
    ↓
User Experience
    ↓
Performance
    ↓
Testability
    ↓
Scalability
```

The objective was not to introduce unnecessary complexity, but to demonstrate how a React Native application can be structured so that additional product requirements can be introduced without tightly coupling screens, state, API communication, and feature logic.

---

# Author

**Muhammad Asad Ilyas**

Senior / Lead Software Engineer
React Native · React · TypeScript · Mobile Engineering · Software Architecture

---

## Final Notes

This README is intentionally designed to be useful at two levels:

**For a reviewer who has 2 minutes:**

- Overview
- Screenshots
- Engineering Highlights
- Technology Stack
- Assignment Coverage

**For a technical interviewer who wants to go deeper:**

- Architecture
- State Management
- React Query
- Optimistic Messaging
- Performance
- API limitations
- Testing
- Security
- Scalability
- Engineering Trade-offs

The implementation should always be treated as the source of truth. If the repository differs from any example or documentation above, the README should be updated to reflect the actual implementation.
