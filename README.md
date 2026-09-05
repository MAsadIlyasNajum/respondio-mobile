# respondio-mobile

A cross-platform (iOS + Android + Web) chat application built with Expo, React Native, and TypeScript. Uses JSONPlaceholder as a mock backend for users and posts (chat messages).

## Features

- **Chats list** — Infinite-scroll contact list, pull-to-refresh, blocked-user filtering.
- **Chat screen** — Real-time message display, optimistic send with retry on failure, block/unblock contacts from the header.
- **Profile screen** — User detail view with a two-tap block confirmation flow.
- **Settings** — App info, version, and a blocked-users management list that shows real names when available.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo (SDK 57) |
| Navigation | Expo Router (file-based) |
| UI | React Native, expo-symbols, react-native-reanimated |
| State | Zustand (`blockStore`) + TanStack Query |
| HTTP | Axios (via `@/api/client`) |
| Styling | Shared theme (`colors`, `spacing`, `radius`, `typography`) |
| Testing | Jest + React Native Testing Library |
| Lint | ESLint (expo-config) |
| Type checking | TypeScript (strict) |

## Architecture

```
src/
  api/                    Axios client, typed API calls (users, posts)
  app/                    Expo Router routes — tabs + chat + profile
  components/             Shared UI primitives (AppText, AppButton, states)
  features/
    chats/                Contact list, useContacts hook, ContactItem
    messages/             Message list, input, bubble, optimistic send hook
    settings/components/  BlockedUsersList, AppInfo, AboutText
    profile/             Profile header, details, BlockButton
  store/                  Zustand blockStore (Map of id → name)
  theme/                  Design tokens (colors, spacing, radius, typography)
  types/                  Shared TypeScript interfaces (User, Post, ApiResponse)
  utils/                  Helpers (constants, formatters)

tests/
  setup.ts                Jest mocks for reanimated, expo-router, react-query
  features/               Component & hook tests
  store/                  blockStore unit tests
```

### Data Flow

- **Contacts**: `useContacts` calls `fetchUsers` via `useInfiniteQuery`, then filters blocked users and the current user (`CURRENT_USER_ID`) on the client side.
- **Messages**: `useMessages` loads posts as chat messages. `useCreateMessage` performs optimistic updates — a temp message is inserted immediately, then replaced with the server response on success or marked failed on error.
- **Blocking**: `blockStore` stores a `Map<string, string>` (id → name). Blocked users are filtered from the chats list and displayed by name in Settings.

## Setup

```bash
git clone <repo-url>
cd respondio-mobile
npm install
```

## Running

```bash
npm start        # Expo Dev Client — choose platform
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

The app points to `https://responserift.dev/` (see `CURRENT_USER_ID` and `API_BASE_URL` in `src/utils/constants.ts`).

## Testing

```bash
npm test           # Run all Jest tests
npx tsc --noEmit   # Type checking
npx expo lint      # Linting
```

Test files live under `tests/` and mirror the `src/` structure. The Zustand store is reset in each test via `useBlockStore.setState(...)`.

## Trade-offs

- **Session-only block state**: Blocked users are stored in Zustand and reset on app restart. No persistence layer.
- **Mocked current user**: `CURRENT_USER_ID` is a hardcoded constant (not a real auth session) used only for client-side filtering.
- **JSONPlaceholder as backend**: `/api/users` and `/api/posts` endpoints return synthetic data; message timestamps use post `createdAt` fields.
- **Optimistic UI**: Message sends show immediately; errors are reflected by keeping the message in a failed state with a retry option.

## Future Improvements

- Replace the mocked `CURRENT_USER_ID` with real authentication.
- Persist block state via AsyncStorage or a backend endpoint.
- Add a dedicated `ErrorBanner` component to share between screens.
- Migrate the contact filter to the API layer (server-side filtering).
- Add end-to-end tests with Detox for integration coverage.
