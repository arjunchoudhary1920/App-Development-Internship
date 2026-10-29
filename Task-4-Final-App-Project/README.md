# StudyMate — Final App Project (Task 4)

StudyMate is a responsive student task planner built with **HTML, CSS, and vanilla JavaScript**. It gives students one simple place to create study tasks, track deadlines, and celebrate completed work.

## Features

- **Create tasks:** title, subject, due date, priority, and optional notes.
- **Validation:** required title, minimum title length, duplicate active-task prevention, and due-date validation.
- **Task workflow:** mark tasks complete/incomplete and delete tasks with confirmation.
- **Search and filters:** search by title, subject, or notes; view all, to-do, or completed tasks.
- **Progress overview:** total, completed, and remaining task counts plus a progress bar.
- **Helpful states:** demo tasks on first launch, empty list, no search results, and empty filter results.
- **Local persistence:** task changes are stored in the browser using localStorage.
- **Responsive layout:** works on desktop, tablet, and mobile; includes keyboard focus styles and reduced-motion support.
- **Privacy-friendly:** tasks stay in this browser and are not sent to a server.

## Run locally

1. Download or clone this repository.
2. Open Task-4-Final-App-Project/index.html in a modern browser.
3. Add a task using the form. Mark it complete, search, or switch filters to explore the app.

No package installation, build process, or backend is required.

Tip: if your browser restricts local storage for files opened directly, run a simple local server from the repository folder (for example, python -m http.server 8000) and open http://localhost:8000/Task-4-Final-App-Project/.

## Demo walkthrough (about 45–60 seconds)

1. Open the app and point out the summary cards and progress bar.
2. Add a task with a title, subject, future due date, and priority.
3. Try submitting a title that is too short or duplicate an active title to show validation.
4. Search for the new task and switch between All, To do, and Completed.
5. Mark it complete and show the progress counter update.
6. Refresh the page to show that tasks persist in the browser.
7. Mention that delete and clear-completed actions ask for confirmation.

## Screenshots

The screenshots folder contains SVG interface previews that render directly in GitHub. For a real demo recording, open the app in your browser and record the walkthrough above.

- [Dashboard and task list](screenshots/dashboard.svg)
- [Add-task form](screenshots/add-task.svg)

## Project files

- index.html — semantic page structure and form
- style.css — responsive styling and accessibility states
- app.js — validation, rendering, filters, task actions, and local storage
- screenshots/ — SVG interface previews

## Storage and reset

The app stores its list under the browser local-storage key studymate-final-tasks-v1. Use Reset demo data inside the app to restore the sample tasks. Clearing browser site data also clears the saved task list.

## Known limitations

- Data is stored only in the current browser profile; it does not sync across devices.
- This is a front-end demonstration, not a native Android/iOS package.
- Notifications and account login are not included.

## Internship submission

**GitHub repository:** https://github.com/arjunchoudhary1920/App-Development-Internship

**Task 4 folder:** https://github.com/arjunchoudhary1920/App-Development-Internship/tree/main/Task-4-Final-App-Project
