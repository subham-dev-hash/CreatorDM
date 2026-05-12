# CreatorDM

A production-ready SaaS application for Instagram comment-to-DM automation, drip campaigns, lead management, and analytics. Built with a modern Node.js backend and a React/Vite frontend.

## Features

- **Instagram Automation**: Trigger DMs automatically when users comment on your posts based on keywords.
- **Drip Campaigns**: Enroll leads into multi-step messaging sequences with customizable delays.
- **Lead Management**: Track and score leads generated from comments and DMs.
- **Analytics Dashboard**: Monitor automation performance, campaign conversions, and message volumes.
- **Subscription Billing**: Cashfree integration for tiered SaaS billing plans.
- **Scalable Architecture**: BullMQ & Redis for reliable background processing.

## Tech Stack

### Frontend
- Vite + React 18
- TailwindCSS v3 (Glassmorphism design)
- React Router v6
- React Query & Axios
- Lucide Icons

### Backend
- Node.js + Express.js
- MongoDB & Mongoose
- Redis & BullMQ
- JWT Authentication
- Instagram Graph API (Webhooks)
- Cashfree API

## Local Development Setup

### Prerequisites
- Node.js v20+
- MongoDB running locally or a MongoDB Atlas URI
- Redis server running locally on port 6379

### 1. Backend Setup

```bash
cd backend
npm install
```

Copy the `.env.example` file to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Start the backend development server:
```bash
npm run dev
```
The server will run on `http://localhost:3333`.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5170`.

## Architecture Note

The system uses three BullMQ queues to handle high-volume operations:
1. **DM Queue**: Processes outgoing Instagram messages with rate limiting.
2. **Comment Reply Queue**: Processes public comment replies.
3. **Campaign Step Queue**: Schedules and processes delayed drip campaign messages.

Make sure Redis is running for these features to work properly.
