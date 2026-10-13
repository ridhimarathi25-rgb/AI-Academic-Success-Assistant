# AI Academic Success Assistant

> **An AI-Receptive, Human-Centered Student Support Application**  
> *Developed as an academic mini-project for the course: **AI-Receptive Software Development***

---

## 1. Project Background & Problem Statement

University students regularly juggle multiple academic commitments across several subjects: programming assignments, laboratory reports, continuous assessments, quizzes, semester examinations, and independent revision sessions. In this high-pressure environment, students frequently face severe planning bottlenecks:

- **Difficulty identifying what deserves attention first** amid competing deadlines.
- **Unrealistic time allocation**, often leading to late-night cramming, cognitive fatigue, and diminished retention.
- **Inability to adjust routines gracefully** when unexpected events cause them to fall behind.
- **Rigid traditional task managers**, which record submission dates but lack workload awareness, time budgeting, and personalized pacing advice.

The **AI Academic Success Assistant** bridges this gap. It provides an intuitive, student-first productivity web platform featuring an academic workload dashboard, an interactive smart study planner powered by a deterministic scheduling engine, and a context-aware simulated AI academic assistant.

---

## 2. Project Objectives

The core objectives of the application are to empower university students to:

1. **Gain immediate clarity** over upcoming academic deadlines and overall workload.
2. **Organize and prioritize tasks** dynamically using a composite formula of deadline urgency, cognitive difficulty, task type, and available study hours.
3. **Generate editable daily and weekly study plans** that respect personal study-time limits without causing burnout.
4. **Receive understandable, context-aware academic guidance** explaining *why* specific tasks are prioritized.
5. **Track study session completion** incrementally while retaining total control over final decisions.
6. **Experience an AI-receptive workflow** that operates entirely locally without requiring paid API keys, cloud subscriptions, or external servers.

---

## 3. Intended User Personas

### Persona A: The Overloaded Student (e.g., Alex)
- **Profile:** 4th-semester Computer Science undergraduate enrolled in 5 demanding technical subjects.
- **Pain Point:** Has multiple major deliverables (Data Structures assignment, Probability & Statistics examination, Database practice set) due within the same week.
- **Need:** Needs immediate triage to understand what must be tackled today versus what can be scheduled across the week, strictly capped within their 2.0 hours/day study capacity.

### Persona B: The Inconsistent Planner (e.g., Jordan)
- **Profile:** Undergraduate who struggles with procrastination and starts studying only when deadlines are imminent.
- **Pain Point:** Large 4-hour assignments feel overwhelming, resulting in avoidance and guilt when falling behind.
- **Need:** Manageable 30-minute study chunks, positive progress feedback, and non-judgmental guidance for recovering from missed deadlines.

---

## 4. System Architecture & Technology Stack

The application is engineered as a clean, responsive, zero-dependency front-end application built with standard modern web technologies:

- **HTML5:** Semantic markup (`<main>`, `<aside>`, `<nav>`, `<section>`, `<dialog>`/modal overlays) ensuring accessibility and clear document structure.
- **CSS3:** Modern CSS variables/design tokens, CSS Grid, Flexbox, custom responsive breakpoints, focus outlines, and reduced-motion media query support.
- **Vanilla JavaScript (ES6+):** Pure client-side application logic modularized across state management, algorithmic scheduling, context-aware simulated intelligence, and UI coordination.
- **Offline Inline SVGs:** High-fidelity, Lucide-compatible icons rendered via pure vector SVGs without external icon font or CDN dependencies.
- **Local Persistence:** Resilient `localStorage` caching with automatic runtime schema validation, sample data auto-seeding, and an in-memory fallback.
- **Local Runtime Server (Optional):** A lightweight, zero-dependency Node.js script (`server.js`) for running a local static server on `http://localhost:3000`.

---

## 5. File & Directory Structure

```
ai-academic-success-assistant/
├── index.html          # Student Dashboard (metrics, workload overview, tasks table, AI insight)
├── planner.html        # Smart Study Planner (preferences form, task selection, schedule view)
├── assistant.html      # AI Academic Assistant (chat interface, suggested prompts, prototype badge)
├── css/
│   └── styles.css      # Shared design system, SaaS aesthetic, responsive styles & theme tokens
├── js/
│   ├── data.js         # State management, runtime-relative date helpers, localStorage & CRUD
│   ├── planner.js      # Deterministic scheduling algorithm, priority engine, session chunking & UI
│   ├── assistant.js    # Context-aware simulated AI engine, prompt matching, chat controller
│   └── app.js          # Shared navigation, accessible modals, toast alerts, dashboard controller
├── assets/             # Project screenshots and vector assets
├── server.js           # Zero-dependency local Node.js static server
├── test_e2e.js         # Automated end-to-end browser QA suite (via Chrome DevTools Protocol)
├── README.md           # Master project documentation and academic report
└── TESTING.md          # Comprehensive verification and test execution report
```

---

## 6. Local Setup & Quick Start Instructions

The application requires **zero build steps, zero package installations, and no external API keys**.

### Method 1: Direct Browser Launch (Simplest)
1. Navigate to the project directory: `d:\ridhima project\`
2. Double-click `index.html` or right-click `index.html` and select **Open with Microsoft Edge / Google Chrome / Mozilla Firefox**.
3. The application will immediately load with full functionality.

### Method 2: Local HTTP Server (Recommended)
1. Open PowerShell or a terminal in the project directory:
   ```powershell
   cd "d:\ridhima project"
   node server.js
   ```
2. Open your browser and visit:
   ```
   http://localhost:3000
   ```
3. To run the automated end-to-end test suite:
   ```powershell
   node test_e2e.js
   ```

---

## 7. Core Features & User Journey

### Page 1: Student Dashboard (`index.html`)
- **Personalized Header:** Displays a welcoming greeting to the sample student (*Alex Morgan*), academic course badge (*B.Tech CS Sem 4*), and current runtime date.
- **4 Metric Summary Cards:**
  1. *Pending Tasks:* Real-time count of active deliverables.
  2. *Upcoming Deadlines:* Incomplete tasks due within the next 7 calendar days.
  3. *Completed Tasks:* Coursework finished to date.
  4. *Daily Study Time:* Configurable daily study preference (default: 2.0h/day).
- **AI Academic Insight Card:** Evaluates actual student workload to generate a tailored, actionable advisory banner with direct shortcuts.
- **Overall Coursework Progress:** Visual progress bar tracking completion percentage and ratio.
- **Academic Tasks Table:** Fully sortable (urgency, deadline, difficulty, title) and filterable (all, pending, in progress, completed, exams) table with color-coded urgency badges.
- **Task Management Modal:** Accessible modal dialog with real-time validation for adding, editing, and deleting tasks.
- **Reset Demo Data Action:** Safe, confirmation-guarded reset back to default sample student data.

### Page 2: Smart Study Planner (`planner.html`)
- **Study Preferences Form:** Configurable daily study hours (0.5h–12h), planning horizon (Today / 3 Days / 7 Days), session length (30 / 45 / 60 mins), break length (5 / 10 / 15 mins), and priority style (Balanced / Closest Deadlines / Most Difficult First).
- **Task Selection Checklist:** Checkbox interface allowing students to include or exclude specific tasks from their planning cycle. Includes "Select All", "Deselect All", and an inline "Add Another Task" shortcut.
- **Study Plan Generation:** Executes the deterministic scheduling algorithm with a single click.
- **Interleaved Daily Schedule:** Visual day-by-day cards breaking down work into digestible sessions, each marked with its duration, parent course, and the explicit algorithmic reason for its placement.
- **Incremental Session Completion:** Students can check off individual 30-minute sessions without prematurely marking the entire multi-hour project complete.
- **Workload Deficit & Unscheduled Work Notice:** If student workload exceeds available study hours over the planning horizon, the application prominently discloses unscheduled tasks and calculates the exact deficit rather than pretending everything fits.
- **Plan Persistence:** Plans automatically save to `localStorage` and restore upon page reload.

### Page 3: AI Academic Assistant (`assistant.html`)
- **Prototype Mode Disclosure:** Prominent badge clearly disclosing that responses are generated by a local simulated intelligence engine.
- **Context-Aware Dialogue:** Analyzes the student's live workspace (number of tasks, upcoming exams, days until deadlines, daily hours) to provide tailored responses.
- **5 One-Click Prompt Chips:**
  1. *"What should I study first?"* &rarr; Recommends the highest-urgency task with detailed rationale and a 30-minute starter action.
  2. *"Help me prepare for upcoming exams."* &rarr; Isolates examinations/quizzes and suggests active recall & spaced retrieval strategies.
  3. *"How can I manage multiple deadlines?"* &rarr; Calculates workload hours versus daily pace and advises on multi-subject interleaving.
  4. *"Create a balanced study routine."* &rarr; Proposes a structured daily study block respecting the student's 2-hour target.
  5. *"What should I do if I fall behind?"* &rarr; Delivers empathetic, non-judgmental triage advice to regain momentum.
- **Interactive Action Pills:** Inline shortcuts inside assistant messages enabling one-click navigation directly to the Planner or Dashboard.
- **Conversation State Management:** Safely caches chat history with clear-conversation confirmation.

---

## 8. Explanation of the Study-Planning Algorithm

The study planner utilizes a **deterministic, multi-variable heuristic scheduling algorithm** designed to replicate human-centered academic advisory logic:

### Priority Scoring Formula
For each active task $T$:
$$\text{Priority Score} = w_d \cdot B_{\text{deadline}} + w_c \cdot M_{\text{difficulty}} + w_t \cdot M_{\text{type}}$$

Where:
1. **Deadline Urgency Base ($B_{\text{deadline}}$):**
   - Overdue ($D < 0$): $120 + \min(|D| \times 10, 50)$
   - Due Today ($D = 0$): $100$
   - Due Tomorrow ($D = 1$): $85$
   - Due in 2–3 Days ($2 \le D \le 3$): $70 - (D \times 5)$
   - Due in 4–7 Days ($4 \le D \le 7$): $50 - (D \times 3)$
   - Due > 7 Days or No Deadline: $20$
2. **Cognitive Difficulty Modifier ($M_{\text{difficulty}}$):**
   - High: $+30$ | Medium: $+15$ | Low: $+5$
3. **Task Type Modifier ($M_{\text{type}}$):**
   - Examination: $+25$ | Assignment: $+18$ | Revision: $+12$ | Practice: $+8$
4. **User-Selected Preference Weights ($w_d, w_c, w_t$):**
   - *Balanced Approach:* $w_d = 1.0, w_c = 1.0, w_t = 1.0$
   - *Closest Deadlines First:* $w_d = 1.8, w_c = 0.6, w_t = 0.8$
   - *Most Difficult First:* $w_d = 0.7, w_c = 2.2, w_t = 0.9$

### Session Chunking & Interleaved Allocation
1. Tasks are decomposed into discrete study sessions of duration $S_{\text{session}}$ (e.g., 30 minutes).
2. For each day in the planning horizon $H$, a capacity limit is enforced:
   $$\text{Daily Capacity} = \text{Daily Available Hours} \times 60 \text{ minutes}$$
3. Sessions are allocated day by day in order of priority score.
4. **Interleaving Rule:** The algorithm avoids scheduling the same subject consecutively on the same day when alternative high-priority tasks exist, reducing cognitive fatigue and promoting spaced practice.
5. **Capacity Guard & Deficit Reporting:** If total required study minutes exceed the planning window's capacity ($H \times \text{Daily Capacity}$), unallocated sessions are recorded in `unscheduledTasks` and flagged with clear diagnostic guidance.

---

## 9. Simulated AI Behavior Disclosure

> **Transparency Notice:**  
> The **AI Academic Assistant** operates in **Prototype Mode** using **deterministic, rule-based simulated intelligence**.
> 
> - **No External Cloud AI:** The prototype does not connect to OpenAI, Google Gemini, Anthropic, or any paid cloud LLM endpoint.
> - **Zero Latency & Privacy Preserving:** All prompts and responses are computed instantaneously in the student's browser using context-aware JavaScript matching functions.
> - **Context-Aware Dynamic Template Mapping:** When the student queries the assistant, the engine inspects live application state (active task titles, subject names, calculated days remaining, difficulty levels, and study limits) to synthesize tailored, grounded advice.

---

## 10. Human-Centered Design Decisions

1. **User Control and Agency:** The student retains final authority over all study decisions. Study plans can be regenerated, preferences adjusted, and sessions rescheduled at will. Automated advice is never forced upon the user.
2. **Incremental Session Completion:** Students frequently work on large multi-hour assignments in increments. Completing a 30-minute study session does not mark the entire academic assignment complete; it updates daily study progress while preserving remaining work.
3. **Visibility of System Status (Nielsen's Heuristic #1):** Urgency badges, progress bars, and allocation indicators immediately show where the student stands. Overload warnings proactively disclose when deadlines cannot fit into available hours.
4. **Error Prevention & Recovery:** All forms implement strict client-side validation (preventing negative effort hours or empty titles). Destructive actions like "Reset Demo Data" and "Clear Conversation" require explicit confirmation modal verification.
5. **Accessibility (WCAG 2.1 AA Compatibility):** Semantic landmarks (`<main>`, `<aside>`, `<nav>`), high-contrast color tokens, keyboard-accessible focus outlines, ARIA progressbar roles, and responsive touch targets ($\ge 44\text{px}$).

---

## 11. Support for Academic Assignment Tasks

### Task 1: Problem Identification & AI-Receptive Approach
- **Identified Problem:** University students face cognitive overload when balancing multiple deadlines across distinct subjects.
- **Target Audience:** Tertiary students in modular degree programs managing coursework and examinations.
- **AI-Receptive Solution:** An intelligent assistant that interprets deadlines and cognitive difficulty to automate realistic scheduling while leaving final decision control with the student.
- **AI Risks & Limitations Addressed:**
  - *Risk 1: Unrealistic Expectations.* Addressed by enforcing hard daily study hour constraints.
  - *Risk 2: Lack of Transparency.* Addressed by annotating every scheduled session with the exact reason for its placement.
  - *Risk 3: Over-Reliance.* Addressed by presenting recommendations as editable suggestions rather than rigid commands.

### Task 2: User Needs & Behavioral Analysis
- Directly satisfies **Persona A (Overloaded Student)** via automated workload triage, balanced weekly distribution, and deficit notifications.
- Directly satisfies **Persona B (Inconsistent Planner)** via 30-minute chunking, encouraging feedback, and empathetic guidance when falling behind.

### Task 3: Human-Centered Design
- Delivers 3 comprehensive, deeply integrated interfaces:
  - *Screen 1:* Workload Overview & Task Management Dashboard (`index.html`)
  - *Screen 2:* Smart Study Planner with Interleaved Allocation (`planner.html`)
  - *Screen 3:* Context-Aware AI Academic Assistant (`assistant.html`)
- Unified visual design system using deep navy (`#172554`), teal accent (`#0D9488`), and clean typography.

### Task 4: AI-Assisted Development Evidence
The implementation followed structured AI-pair-programming workflows. Below is the framework for recording evidence:

| Development Step | Tool / Environment | Prompt / Objective | Generated Result | Human Review & Refinement |
| :--- | :--- | :--- | :--- | :--- |
| **Requirements & Architecture** | Gemini 3.8 Flash | Structure a 3-page zero-dependency student planner prototype with deterministic scheduling. | Proposed architecture with shared `data.js`, `planner.js`, and `assistant.js`. | Accepted modular separation; added localStorage fallback and inline SVG icons. |
| **Scheduling Algorithm** | Gemini 3.8 Flash | Develop an interleaved study allocation algorithm respecting daily hour caps. | Initial allocation loop with priority formulas. | Added deadline-slip warnings and unscheduled workload deficit reporting. |
| **Assistant Logic** | Gemini 3.8 Flash | Build deterministic context-aware response engine referencing live tasks. | Rule-based template matching with task queries. | Enhanced with empathetic recovery advice and quick-action navigation pills. |
| **Automated QA Testing** | Gemini 3.8 Flash | Create an end-to-end browser test suite using native Node.js and CDP. | `test_e2e.js` driving headless Microsoft Edge. | Discovered and fixed a metric synchronization defect in session completion toggling. |

---

## 12. Known Limitations & Future Roadmap

### Current Prototype Limitations
1. **Single-Device Persistence:** State is stored in browser `localStorage`. Data does not synchronize across separate physical devices.
2. **Deterministic Response Templates:** While responses are dynamically parameterized with live student data, the conversational vocabulary is based on predefined templates rather than a generative foundation model.
3. **Simplified Time Modeling:** Study sessions are scheduled on calendar days rather than specific clock times (e.g., 2:00 PM to 2:30 PM).

### Future Roadmap
1. **iCalendar (.ics) Export:** Enable one-click export of scheduled study sessions to Google Calendar and Apple Calendar.
2. **Optional LLM Integration:** Provide an opt-in toggle for students to supply their own API key for open-ended conversational tutoring.
3. **Grade Tracking & GPA Projections:** Incorporate module weightings to prioritize assignments carrying higher percentage impacts on final marks.
