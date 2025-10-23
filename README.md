# Digital Notice Board

A modern digital notice board system for educational institutions, built with React and Supabase.

## Features

- User Authentication (Faculty/Student roles)
- Create and manage notices (Faculty)
- View notices filtered by department and year (Students)
- Real-time updates
- Responsive design
- Dark mode support

## Tech Stack

- React with TypeScript
- Supabase (Auth & Database)
- Shadcn/ui Components
- TailwindCSS
- Vite

## Getting Started

1. Clone the repository
2. Install dependencies:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Project Structure

- `/src`
  - `/components` - Reusable components
  - `/contexts` - React contexts (Auth)
  - `/hooks` - Custom hooks
  - `/integrations` - External service integrations (Supabase)
  - `/lib` - Utility functions
  - `/pages` - Route components

## Building for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm start
```
