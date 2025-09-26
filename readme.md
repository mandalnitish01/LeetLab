<!-- # LeetLab
### A Coding Practice Platform
#### Users can solve listed problems on this platform.

#### Users can view their leaderboard position, score, total solved questions, and rank.

## Technologies and Software Used to Build This Platform
### Backend
#### Node.js

#### Express.js – Used to create the server for the website.

#### Prisma – Used as an ORM to interact between the database and the server.

#### PostgreSQL – Used as the SQL-based database (Note: PostgreSQL is not a NoSQL database).

#### bcryptjs – Used to hash (encrypt) user passwords securely.

#### dotenv – Used to configure environment variables in the server using the .env file.


### installed
## install docker and docker compose also install judge0 for validation and check

npx prisma studio
- These four schema is used in User
Problem
Submission
TestCaseResult
ProblemSolved  this project

//Backend is completed for my leetlab project. -->


## Let'sCode
- "Let'sCode is a comprehensive LeetCode-inspired application developed by following the Software Development Life Cycle (SDLC). It leverages the Judge0 API and third-party integrations to enable seamless code execution on the platform, providing users with the ability to solve a wide range of Data Structures and Algorithms problems while systematically preparing for technical interviews."



## 🌟 Key Features
- Code Execution – Write, run, and validate code across supported languages using Judge0.
- Authentication & Roles – User login with support for secure role-switching between admin and user modes.
- Problem Management – Admins can create/edit problems; users can solve and organize them into custom playlists.
- Daily Challenges – Get a new random problem every day to stay sharp.
- Submission History – Access your past submissions via dropdown badges.
- Profile Settings – Edit profile information and update passwords securely.
- Responsive Design – Clean interface with modern design and structured footer for smooth navigation.


## Folder's and File Structure
├── backend
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    ├── prisma
    │   ├── migrations
    │   │   ├── 20250725034356_create_user_table
    │   │   │   └── migration.sql
    │   │   ├── 20250725045522_create_user_table
    │   │   │   └── migration.sql
    │   │   ├── 20250728153237_user_and_problem_table
    │   │   │   └── migration.sql
    │   │   ├── 20250809142613_create_models
    │   │   │   └── migration.sql
    │   │   ├── 20250811174945_change_on_entity_in_submission_and_testcase_table
    │   │   │   └── migration.sql
    │   │   ├── 20250812174051_playlist_schema_is_added
    │   │   │   └── migration.sql
    │   │   ├── 20250925035138_make_image_optional
    │   │   │   └── migration.sql
    │   │   └── migration_lock.toml
    │   └── schema.prisma
    └── src
    │   ├── controllers
    │       ├── auth.controllers.js
    │       ├── executeCode.controller.js
    │       ├── playlist.controller.js
    │       ├── problem.controller.js
    │       └── submission.controller.js
    │   ├── index.js
    │   ├── libs
    │       ├── db.js
    │       └── judge0.lib.js
    │   ├── middleware
    │       └── auth.middleware.js
    │   └── routes
    │       ├── auth.routes.js
    │       ├── executeCode.routes.js
    │       ├── playlist.routes.js
    │       ├── problem.routes.js
    │       └── submission.routes.js
├── frontend
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── leetlab.svg
    │   └── vite.svg
    ├── src
    │   ├── App.jsx
    │   ├── assets
    │   │   └── react.svg
    │   ├── components
    │   │   ├── AdminRoute.jsx
    │   │   ├── AuthImagePattern.jsx
    │   │   ├── CreateProblemForm.jsx
    │   │   ├── LogoutButton.jsx
    │   │   └── Navbar.jsx
    │   ├── index.css
    │   ├── layout
    │   │   └── Layout.jsx
    │   ├── lib
    │   │   └── axios.js
    │   ├── main.jsx
    │   ├── page
    │   │   ├── Addproblem.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── SignupPage.jsx
    │   └── store
    │   │   └── useAuthStore.js
    └── vite.config.js
└── readme.md




# 🧰 Tech Stack
Frontend: React.js, Tailwind CSS, Daisy UI
Backend: Node.js, Express.js
Database: PostgreSQL
Compiler Integration: Judge0 API


## 📜 Available Scripts

| Script              | Description                           |
|---------------------|---------------------------------------|
| `npm run dev`       | Start development server on port 8080 |
| `npm run build`     | Build for production                  |
| `npm run build:dev` | Build in development mode             |
| `npm run preview`   | Preview production build locally      |


# 🚀 Installation & Setup
To get started with LeetLab, follow these steps:

#### Prerequisites
- Node.js
- A modern browser (e.g., Chrome, Firefox)

#### Clone the repository and install dependencies:  
```bash
git clone https://github.com/kreeti1210/LeetLab.git
cd LeetLab
npm install
npm run dev


