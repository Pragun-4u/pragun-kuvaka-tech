

# Gemini Chat: A Real-time Chat Application

This is a modern, responsive chat application built with Next.js and the App Router. It features a clean, intuitive interface for creating and managing chatrooms, with persistent conversations powered entirely by client-side `localStorage`. The project emphasizes a streamlined, simplified state management approach by using React Context instead of Redux, demonstrating a lightweight yet powerful alternative for single-user, session-persistent applications.

**Live Demo Link:** `(https://pragun-kuvaka-tech.vercel.app/)`

## Key Features

*   **Chatroom Management:** Create, delete, and search for chatrooms from a central dashboard.
*   **Persistent Conversations:** All chat messages and rooms are saved directly to the browser's `localStorage`, ensuring your data is preserved across sessions.
*   **Infinite Scroll:** Message history is loaded on-demand as you scroll up, ensuring fast initial load times and efficient data handling.
*   **Client-Side State Management:** Utilizes React Context and Hooks (`useChat`) for a clean, centralized state management solution without the boilerplate of Redux.
*   **Modern UI/UX:** Built with **shadcn/ui** and **Tailwind CSS** for a beautiful, responsive, and themeable interface.
*   **Robust Error Handling:** Custom, beautifully themed pages for `404 Not Found` and application errors.

---

## Setup and Run Instructions

Follow these steps to get the project running on your local machine.

**Prerequisites:**
*   Node.js (v18.0 or later)
*   npm, yarn, or pnpm

**1. Clone the Repository**
```bash
git clone https://github.com/Pragun-4u/pragun-kuvaka-tech
cd [repository-folder]
```

**2. Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

**3. Run the Development Server**
```bash
npm run dev
```

**4. Open the Application**
Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Folder & Component Structure

The project follows the standard Next.js App Router structure, organizing files by routes and features.

*   `src/app/`
    *   **`(protected)/`**: A route group for pages that would typically require authentication. The `middleware.ts` file can be used to enforce this protection.
        *   **`dashboard/`**: The main dashboard page where users can see and manage all their chatrooms.
        *   **`chat/[id]/`**: The dynamic route for an individual chat session. The `[id]` parameter corresponds to the unique ID of the chatroom.
    *   **`layout.tsx`**: The root layout of the application. It wraps all pages and contains the `ChatProvider` to make the global state available everywhere.
    *   **`page.tsx`**: The main landing page, likely serving as a login or entry point.
    *   **`not-found.tsx` & `global-error.tsx`**: Custom, styled pages for handling 404 errors and unexpected application crashes, ensuring a consistent user experience.

*   `src/components/`
    *   **`ui/`**: Contains the unstyled, reusable components from the `shadcn/ui` library (e.g., `Button.tsx`, `Card.tsx`).
    *   **`shared/`**: Contains custom, application-wide components built upon the `ui` components, like `ConfirmDialog.tsx`.
    *   **`ChatInput.tsx`**: The component for the message input field, including the send button and logic for creating new messages.
    *   **`ChatMessage.tsx`**: The component responsible for rendering a single message bubble in the chat history.

*   `src/lib/`
    *   **`store/chatStore.tsx`**: **The core of the application's state management.** This file replaces Redux. It defines the `ChatProvider` context, the `useChat` hook, and all the functions for interacting with the chat state (e.g., `initializeChat`, `addMessage`, `getPreviousMessages`). All data is read from and written to `localStorage` within this file.
    *   **`middleware.ts`**: The Next.js middleware file, used to intercept requests. It's perfectly placed to handle authentication logic for the `(protected)` route group.

---

## Technical Implementation Details

#### 1. Pagination and Infinite Scroll

The infinite scroll feature is implemented with a combination of client-side data slicing (pagination) and a scroll event listener.

*   **Data Pagination (in `chatStore.tsx`)**:
    *   A large array of `dummyOlderMessages` simulates a full message history database.
    *   The state for each chat tracks `currentPage` and `hasMoreMessages`.
    *   When a new chat is created, it's initialized with only the most recent "page" of messages (`MESSAGES_PER_PAGE`).
    *   The `getPreviousMessages` function calculates the next slice of older messages based on the `currentPage` and prepends them to the existing message array, mimicking fetching the next page from a server.

*   **Infinite Scroll (in `chat/[id]/page.tsx`)**:
    *   A `useEffect` hook attaches a `scroll` event listener to the message container `div`.
    *   It checks if the `scrollTop` of the container is `0` (meaning the user has scrolled to the very top).
    *   When this condition is met, it calls `getPreviousMessages(id)` from the `useChat` hook to fetch and display the older messages.
    *   A local `isLoadingOlder` state is used to display a loading spinner and prevent multiple fetches while one is already in progress.

#### 2. Throttling (Debouncing)

To make the chatroom search feature on the dashboard efficient, input is **debounced** to prevent re-filtering on every keystroke.

*   **Implementation (in `dashboard/page.tsx`)**:
    *   A `useEffect` hook watches for changes in the `searchQuery` state variable.
    *   Inside the effect, a `setTimeout` of 500ms is initiated.
    *   The effect's cleanup function (`return () => clearTimeout(timer)`) clears the previous timer every time the `searchQuery` changes.
    *   As a result, the filtering logic inside the `setTimeout` only executes once the user has stopped typing for 500 milliseconds, significantly improving performance.

#### 3. Form Validation

Validation is handled client-side for a fast and responsive user experience.

*   **Implementation (in `login.tsx`)**:
    *   When entering a phone number the value is checked with `zod`
    *   The phone number must not be empty. 
    *   Also check if the country code is selected.
---
## Screenshots



**Login**
*(A screenshot showing the login screen of the app)*
<img width="1917" height="901" alt="image" src="https://github.com/user-attachments/assets/8138f0ca-b870-465a-afe8-b24b739d2b32" />

**Dashboard View:**
*(A screenshot showing the grid of chatroom cards, the search bar, and the "Create Chatroom" button)*
<img width="1919" height="899" alt="image" src="https://github.com/user-attachments/assets/ab9d16aa-e0cd-4a06-bfe9-845f0a555287" />


**Chat Session View:**
*(A screenshot of an active chat, showing messages from both user and AI, and the message input field.*
<img width="389" height="788" alt="image" src="https://github.com/user-attachments/assets/482aa6ca-0a1e-4665-98a0-3aabc6c3e351" />


**Create Chatroom Dialog:**
*(A screenshot of the dialog modal for creating a new chatroom)*
`![Create Dialog](./path/to/dialog-screenshot.png)`
