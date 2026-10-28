# Task 3 — App Features and State

**StudyMate** is a responsive student task-list web app that demonstrates a complete create-and-list workflow with input validation, empty states, task updates, filters, and persistent browser state.

## Complete feature path
1. Enter a task title and optionally add a subject, due date, priority, and notes.
2. Submit the form. The app validates the title, minimum title length, duplicate active task names, and past due dates.
3. A valid task appears in the list immediately and is saved to browser `localStorage`.
4. Mark a task completed or active, search tasks, filter by status, delete a task, or clear completed tasks.
5. Refresh the page: saved tasks remain available in the same browser on the same device.

## Core requirements covered
- **Create and list:** validated task creation and immediate list rendering.
- **Validation:** required title, trimmed whitespace, minimum 3-character title, duplicate active-title check, date validation, accessible inline error messages.
- **Empty states:** friendly first-use state and separate no-results/filter state.
- **Persistent state:** `localStorage` with safe handling for unavailable or malformed saved data.
- **Task actions:** mark complete/incomplete, delete with confirmation, clear completed with confirmation.
- **Derived state:** live total, completed, and pending counts; filter counts; completion summary.
- **Search and filters:** search title, subject, or notes; filter all, to-do, or completed.
- **Responsive UI:** desktop and mobile layouts, keyboard focus indicators, semantic form labels, and reduced-motion support.

## Technology
- HTML5
- CSS3
- Vanilla JavaScript (no framework, build step, or external API)

## Run locally
1. Download or clone the repository.
2. Open `index.html` from this folder in a modern browser.
3. No dependencies or installation are required.

## Project files
- `index.html` — task creation form, summary cards, and task list.
- `style.css` — responsive interface and states.
- `app.js` — validation, create/list/update/delete, filtering, empty states, and local persistence.

## Data note
The app seeds a few fictional example tasks on first launch so the interface is easy to review. To test the true empty state, clear the app's `studymate-task3-tasks-v1` item from local storage in your browser's developer tools and reload. Data is stored locally, not synced to a server.

**Internship:** App Development Internship — Task 3: App Features and State.

Repository: https://github.com/arjunchoudhary1920/App-Development-Internship/tree/main/Task-3-App-Features-and-State
