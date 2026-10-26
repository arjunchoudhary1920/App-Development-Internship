# StudyMate Screen Flow

## Screen 1 — Dashboard
**Purpose:** Give students an at-a-glance view of their day.

**Elements:** Welcome message, task progress, today's tasks, upcoming deadlines, and a prominent Add Task action.

**Actions:** Open a task, mark a task complete, navigate to My Tasks or Calendar, add a task.

## Screen 2 — My Tasks
**Purpose:** Manage all academic tasks.

**Elements:** Task list, status filters, priority labels, due dates, and completion controls.

**Actions:** Filter tasks, complete a task, open task editor, add a task.

## Screen 3 — Add/Edit Task
**Purpose:** Capture assignment or study-session details.

**Fields:** Task title (required), subject, due date, priority, and notes.

**Actions:** Save or cancel. Saving returns to the previous screen and updates the prototype's task list.

## Screen 4 — Calendar
**Purpose:** See deadlines over the month.

**Elements:** Monthly calendar grid and a list of upcoming due dates.

**Actions:** Browse the visual schedule and navigate to task management.

## Screen 5 — Profile & Settings
**Purpose:** Provide simple preferences and reminder options.

**Elements:** Profile summary, reminder preference, accessibility note, and app information.

**Actions:** Toggle reminders and return to other primary screens.

## Navigation diagram

```text
                  +----------------+
                  |   Dashboard    |
                  +----------------+
                    |   |   |   |
          +---------+   |   |   +----------+
          v             v   v              v
     +---------+   +---------+        +----------+
     | My Tasks|   | Calendar|        | Profile  |
     +---------+   +---------+        +----------+
          |                                  
          v                                  
     +----------------+
     | Add / Edit Task|
     +----------------+
          |
          v
     Save -> previous screen (Dashboard or My Tasks)
```

## Accessibility checklist
- All controls have readable labels.
- Interactive elements can be reached by keyboard.
- Focus indicators remain visible.
- Layout adapts to narrow screens.
- Task status includes text labels, not color alone.