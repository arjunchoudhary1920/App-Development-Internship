# StudyMate — Core App Screens (Task 2)

StudyMate is a mobile-responsive student task planner prototype created for Task 2 of an App Development Internship. It helps students organize assignments, track due dates, and see progress in one simple interface.

## Screens included
- **Overview:** task totals, due-today count, upcoming tasks, and completion progress.
- **My Tasks:** mark tasks complete or reopen them, filter by status, delete tasks, and add tasks with a subject, due date, and priority.
- **Calendar:** a week-at-a-glance view populated from task due dates.
- **Progress:** completion rate and remaining-task summary.
- **Settings:** reminder and compact-list preferences.

## Technology used
- HTML5 for screen structure
- CSS3 for responsive layouts and styling
- Vanilla JavaScript for navigation, task interactions, filters, and progress calculations

This is a responsive web app, not a native React Native or Flutter application.

## Features
- Mobile-friendly layout with navigation between five core screens.
- Add tasks, mark tasks complete, and delete tasks.
- Filter tasks by all, to-do, or completed status.
- View due dates in the weekly calendar.
- Save tasks and settings in browser `localStorage`, so changes persist in the same browser on the same device.
- Accessible form labels and status messages.

## Run locally
1. Download or clone this repository.
2. Open `index.html` in this folder in a modern browser.
3. No package installation or build step is required.

## Project structure
- `index.html` — application screens and task form
- `style.css` — responsive layout and styling
- `app.js` — navigation, task actions, progress, and browser storage

## Notes for reviewers
This is a front-end demonstration, not a cloud-synced production app. Tasks and settings are saved only in the browser on the device where the app is used. Sample task data is fictional demo content.

**Internship task:** App Development Internship — Task 2: Core App Screens.

Repository: https://github.com/arjunchoudhary1920/App-Development-Internship/tree/main/Task-2-Core-App-Screens
