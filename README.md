# FletNix

FletNix is a complete search and filter portal for Netflix content designed to help users browse, search, filter, and view details of movies and TV shows. It enforces basic age restrictions to prevent underage users from viewing mature content (rated "R").

This application is built with:
- **Frontend**: Angular 12+ styled with Tailwind CSS
- **Backend**: Node.js & Express
- **Database**: MongoDB & Mongoose
- **Testing**: Playwright for End-to-End API and UI testing

---

## Features

1. **Authentication**: Users can register and login using their email, password, and age. Passwords are encrypted using `bcryptjs` before storage.
2. **Paginated Media Grid**: Displays all TV shows and movies in a clean grid showing 15 items per page.
3. **Advanced Search**: Search for content by Title or Cast members.
4. **Age Restriction Filter**: Users registered with an age under 18 years are automatically restricted from seeing any titles rated "R".
5. **Content Filtering**: Toggle results between Movies, TV Shows, or all content.
6. **Detailed Overlay**: Clicking "View Details" displays all database fields (director, cast, country, full description, listed genres, rating, year, duration, etc.) in a styled modal dialog.
7. **End-to-End Testing**: Includes Playwright E2E suites for verifying backend endpoints and full UI user flows.

---

## Local Setup Instructions

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js**: v18+ (tested on v24)
- **MongoDB**: Running locally on `mongodb://127.0.0.1:27017`

---

### Step 1: Database Setup & Seeding
Seeding imports the `netflix_titles.csv` dataset into your local MongoDB.

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the database seed script:
   ```bash
   npm run seed
   ```
   *This will clear the `shows` collection and import all 8,807 rows from the CSV file.*

---

### Step 2: Start the Backend API Server
The backend handles routing, auth hashing, and data queries.

1. Ensure you are in the `backend` folder:
   ```bash
   cd backend
   ```
2. Start the server:
   ```bash
   npm start
   ```
   *The server runs on http://localhost:3000.*

---

### Step 3: Start the Frontend Angular Dev Server
The frontend displays the Netflix interface.

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular application:
   ```bash
   npm start
   ```
   *The app runs on http://localhost:4200. Open this URL in your browser.*

---

## Running E2E Tests (Playwright)

End-to-End tests verify API request logic and UI interactive flows.

1. Open a new terminal and navigate to the `e2e` folder:
   ```bash
   cd e2e
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the E2E tests:
   ```bash
   npm test
   ```
   *Note: Make sure both the backend (port 3000) and frontend (port 4200) servers are running locally before launching the tests.*
