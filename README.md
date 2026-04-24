# BFHL: Tree & Hierarchy Visualiser

A production-ready full-stack application built for the SRM Engineering Challenge. This platform processes complex node relationships (trees, cycles, diamonds) via a Node.js REST API and visualises them through a premium React frontend.

## 🔗 Live Links
- **Frontend (UI):** [https://bajaj-challenge-bfhl.vercel.app/](https://bajaj-challenge-bfhl.vercel.app/)
- **Backend (API):** [https://bfhl-api-wfsp.onrender.com/bfhl](https://bfhl-api-wfsp.onrender.com/bfhl)

---

## ✨ Features

- **Robust Processing:** Handles multiple independent trees, diamond relationships (first-parent-wins), and complex cycles.
- **Cycle Detection:** DFS-based detection that identifies cyclic groups and provides specific UI feedback.
- **Automated Summary:** Instantly calculates total trees, cycles, and identifies the largest tree by depth.
- **Premium UI:** Dark-mode interface with glassmorphism, recursive tree components, and responsive design.
- **Data Integrity:** Filters invalid node formats and tracks duplicated edges.

---

## 🚀 Tech Stack

- **Frontend:** React, Vite, Vanilla CSS (Glassmorphism)
- **Backend:** Node.js, Express
- **Testing:** Jest (100% logic coverage)
- **Tooling:** Union-Find (for connectivity), DFS (for cycles)

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Installation
Clone the repository and install dependencies in both directories:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
USER_FULL_NAME=John Doe
USER_DOB=17091999
USER_EMAIL=john.doe@college.edu
USER_ROLL_NUMBER=RAXXXXXXXXXXXX
PORT=3001
```

### 4. Running Locally
Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Specification

### `POST /bfhl`
Processes an array of node relationship strings.

**Request Body:**
```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

**Response Schema:**
| Field | Type | Description |
| :--- | :--- | :--- |
| `user_id` | string | Fullname_ddmmyyyy (normalized) |
| `hierarchies` | array | List of root/tree objects or cycle flags |
| `invalid_entries` | string[] | Inputs not matching "X->Y" format |
| `duplicate_edges` | string[] | Repeated edges after first occurrence |
| `summary` | object | totals and largest root |

---

## 📁 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── services/processor.js   # Core hierarchy algorithm
│   │   ├── routes/bfhl.js          # Express route handlers
│   │   └── app.js                  # App configuration
│   └── tests/                      # Jest test suite (28 tests)
├── frontend/
│   ├── src/
│   │   ├── components/             # Recursive TreeView, Summary, etc.
│   │   ├── App.jsx                 # Main layout
│   │   └── index.css               # Global glassmorphism styles
└── README.md
```

---

## 🧪 Testing
The backend includes a comprehensive test suite covering all edge cases.
```bash
cd backend
npm test
```
