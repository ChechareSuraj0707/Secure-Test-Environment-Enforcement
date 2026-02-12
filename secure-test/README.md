# Secure Test Environment - Feature Verification Guide

## Overview

This document provides step-by-step verification for all implemented features.

---

## ✅ Feature 1: Unified Event Logging with Timestamp, Attempt ID, and Metadata

### Implementation Location:

- **File:** `src/logger/eventSchema.js`
- **File:** `src/logger/logger.js`

### What It Does:

Every event logged includes:

- `id`: Unique UUID for each event
- `timestamp`: ISO 8601 formatted timestamp
- `attemptId`: Unique test attempt identifier
- `type`: Event type (TAB_BLUR, TAB_FOCUS, etc.)
- `metadata`: Object containing:
  - `userAgent`: Browser information
  - `focus`: Document focus state at time of event
  - Custom metadata as needed

### Verification Steps:

1. Click "Show Logs" button
2. Open browser console (F12 → Console)
3. Run: `JSON.parse(localStorage.getItem('secure_test_logs'))`
4. Inspect any log entry to see:
   - Timestamp (e.g., "2026-02-12T10:30:45.123Z")
   - AttemptId (UUID format)
   - Type (e.g., "TAB_BLUR")
   - Metadata object with userAgent and focus

### Example Log Entry:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "TAB_BLUR",
  "timestamp": "2026-02-12T10:30:45.123Z",
  "attemptId": "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
  "questionId": null,
  "metadata": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "focus": false
  }
}
```

---

## ✅ Feature 2: Tracking of Tab/Focus Changes and Fullscreen Events

### Implementation Location:

- **File:** `src/security/focusTracker.js`
- **File:** `src/security/fullscreen.js`
- **File:** `src/security/enforcer.js`

### Tracked Events:

1. **TAB_BLUR**: User switches away from browser tab
2. **TAB_FOCUS**: User returns focus to browser tab
3. **TAB_HIDDEN**: Tab/window is hidden or minimized
4. **TAB_VISIBLE**: Tab/window becomes visible again
5. **FULLSCREEN_ENTER**: User enters fullscreen mode
6. **FULLSCREEN_EXIT**: User exits fullscreen mode
7. **SECURITY_VIOLATION**: Attempted security breach detected

### Verification Steps:

1. Start the application
2. Click "Show Logs"
3. Perform these actions and observe logs:
   - **Click outside browser**: See TAB_BLUR event
   - **Click back on browser**: See TAB_FOCUS event
   - **Minimize window**: See TAB_HIDDEN event
   - **Restore window**: See TAB_VISIBLE event
   - **Press F11 (fullscreen)**: See FULLSCREEN_ENTER event
4. Check the Audit Panel - each event should appear in real-time

---

## ✅ Feature 3: Local Persistence of Logs for Offline/Refresh Scenarios

### Implementation Location:

- **File:** `src/logger/storage.js`
- **File:** `src/components/AuditPanel.jsx`

### How It Works:

- All logs are stored in browser's localStorage with key: `secure_test_logs`
- Persists across page refreshes and offline sessions
- Logs are in JSON array format for easy access

### Verification Steps:

1. Click "Show Logs" and perform several actions (tab switching, etc.)
2. Open browser console and run:
   ```javascript
   localStorage.getItem("secure_test_logs");
   ```
3. Refresh the page (F5)
4. Click "Show Logs" again
5. **Expected Result**: All logs from before refresh are still visible
6. Close and reopen the browser tab
7. **Expected Result**: All logs persist

### Test Offline Scenario:

1. Generate some logs
2. Open DevTools → Network tab
3. Set "Offline" mode
4. Perform actions (tab blur/focus)
5. Logs still recorded locally
6. Go back online - logs ready to sync

---

## ✅ Feature 4: Log Immutability After Test Submission

### Implementation Location:

- **File:** `src/logger/storage.js` (lines with `LOCKED` check)
- **File:** `src/App.jsx` (handleSubmit function)

### How It Works:

- When "Submit Test" button is clicked:
  1. `LOCKED` flag is set in localStorage
  2. All new logging attempts are blocked (saveLog returns early if LOCKED)
  3. Audit Panel shows "LOCKED 🔒" status
  4. Logs become read-only and immutable

### Verification Steps:

1. Click "Show Logs"
2. Perform several actions to generate logs
3. Observe count in "Logs: X"
4. Click "Submit Test"
5. Check Audit Panel header - status changes to "LOCKED 🔒"
6. Perform more actions (tab switching, etc.)
7. **Expected Result**: Log count remains same - no new logs added
8. Verify in browser console:
   ```javascript
   localStorage.getItem("LOCKED"); // Returns "true"
   ```

### Code Logic:

```javascript
// In storage.js
export const saveLog = (event) => {
  // ❌ Stop saving after submit
  if (localStorage.getItem("LOCKED")) {
    return; // Exit early - log not saved
  }
  // ... save log logic
};
```

---

## ✅ Feature 5: Clean and Structured React-based Implementation

### Architecture Overview:

```
src/
├── App.jsx                 # Main component, state management
├── components/
│   └── AuditPanel.jsx     # Display logs in real-time
├── logger/
│   ├── logger.js          # Logging orchestration
│   ├── eventSchema.js     # Event structure & validation
│   └── storage.js         # LocalStorage persistence
├── security/
│   ├── enforcer.js        # Security enforcement & violations
│   ├── focusTracker.js    # Tab/focus monitoring
│   └── fullscreen.js      # Fullscreen detection
└── services/
    └── syncService.js     # Log synchronization with server
```

### Design Patterns Used:

1. **Separation of Concerns**:
   - Logger handles event structure
   - Storage handles persistence
   - Security modules handle monitoring
   - AuditPanel handles presentation

2. **Module Pattern**:
   - Each module exports specific functions
   - Clean interfaces between modules
   - No global variables

3. **React Hooks**:
   - `useState` for component state
   - `useEffect` for side effects and subscriptions
   - Proper cleanup in useEffect return

4. **Event-Driven Architecture**:
   - Window and document events trigger logging
   - Real-time UI updates via state polling
   - Decoupled event handlers

### Code Quality Features:

- Clear function names (`createEvent`, `saveLog`, `trackFocus`)
- Consistent code formatting (Tailwind + inline styles)
- Comments explaining key logic
- Error handling in critical paths
- UUID generation for unique IDs

### Verification Steps:

1. Open `src/` folder and review structure
2. Each file has clear responsibility
3. Run: `npm run lint` to check code quality
4. All components render without errors
5. No console warnings during normal operation

---

## 🎯 How to Demo All Features Together

### Step-by-Step Demo Sequence:

1. **Start Fresh**:
   - Clear localStorage: `localStorage.clear()`
   - Refresh page
   - Note new attemptId generated

2. **Show Event Logging** (Feature 1):
   - Click "Show Logs"
   - Show timestamp and metadata in console

3. **Show Focus Tracking** (Feature 2):
   - Click outside browser → "Tab blur logged"
   - Click back → "Tab focus logged"
   - Minimize → "Tab hidden logged"

4. **Show Persistence** (Feature 3):
   - Open console: `localStorage.getItem('secure_test_logs')`
   - Show JSON array of events
   - Refresh page
   - Show same events still there

5. **Show Immutability** (Feature 4):
   - Note current log count
   - Click "Submit Test"
   - Show "LOCKED 🔒" status
   - Try clicking outside → No new logs added
   - Show `localStorage.getItem('LOCKED')` returns "true"

6. **Show Architecture** (Feature 5):
   - Open IDE and explore folder structure
   - Show how modules interconnect
   - Highlight clean separation of concerns

```

```
