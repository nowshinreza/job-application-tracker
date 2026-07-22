# Job Application Tracker

A full-stack job application management platform built with Next.js that helps users organize and track their job search through an interactive Kanban board. Users can manage applications across different hiring stages with authentication, database integration, and drag-and-drop functionality.

## Features

- User authentication and session management
- Interactive Kanban board with drag-and-drop support
- Create, update, and delete job applications
- Track applications through different hiring stages
- MongoDB database integration using Mongoose
- Responsive and modern user interface
- Server-side data handling with Next.js App Router

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- React 19
- Tailwind CSS 4
- MongoDB
- Mongoose
- Better Auth
- dnd-kit
- Radix UI
- Lucide React

## Application Workflow

```
Wishlist → Applied → Interviewing → Offer → Rejected
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- npm, yarn, pnpm, or bun

### Installation

Clone the repository:

```bash
git clone https://github.com/nowshinreza/job-application-tracker.git
```

Navigate to the project directory:

```bash
cd job-application-tracker
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
```

Start the development server:

```bash
npm run dev
```

Open your browser:

```
http://localhost:3000
```

## Project Structure

```
job-application-tracker/
├── app/              # Next.js App Router pages and routes
├── components/       # Reusable React components
├── lib/              # Database, authentication, actions, utilities
├── models/           # Mongoose database models
├── public/           # Static assets
└── scripts/          # Database utility scripts
```

## Future Improvements

- Application analytics dashboard
- Interview scheduling system
- Email notifications
- Resume and cover letter management
- Advanced search and filtering
- Application status history

