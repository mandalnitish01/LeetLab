


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
```bash
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
```


## 🧰 Tech Stack
Frontend: React.js, Tailwind CSS, Daisy UI
Backend: Node.js, Express.js
Database: PostgreSQL
Compiler Integration: Judge0 API

## 📡 API Endpoints
```bash
| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| POST   | `/api/v1/auth/`       | Register a new user        |
| POST   | `/api/v1/problems`    | User login                 |
| GET    | `/api/v1/execute-code`| Get all problems           |
| POST   | `/api/v1/submission`  | Run code using Judge0 API  |
| GET    | `/api/v1/playlist`    | Fetch user submissions     |
```

## 📜 Available Scripts
```bash
| Script              | Description                           |
|---------------------|---------------------------------------|
| `npm run dev`       | Start development server on port 8080 |
| `npm run build`     | Build for production                  |
| `npm run build:dev` | Build in development mode             |
| `npm run preview`   | Preview production build locally      |
```

## 🚀 Installation & Setup
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
```


## Future Improvements / Roadmap
#### 🛠 Future Enhancements
- Add support for more programming languages  
- Implement code discussion forums  
- Add mock interview sessions  
- Introduce AI-based problem hints  

##  🙏 Acknowledgements
This journey would not have been possible without the exceptional mentorship and unwavering support from the team at Chai Code — Hitesh Choudhary, Piyush Garg, and Suraj Sir. Their structured approach to learning and emphasis on problem-solving played a pivotal role in shaping my skills and bringing this project to life.

