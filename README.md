# Eventora – AI-Powered Event Management Platform

> Create **extraordinary events in seconds** with AI-powered event management.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)

## ✨ Features

- 🤖 **AI-Powered Event Creation** - Generate complete event details from a simple text prompt
- 🎨 **Futuristic UI/UX** - Glass morphism, gradient animations, and smooth transitions
- 🔐 **Secure Authentication** - Email/password and OAuth (GitHub, Google) via Supabase
- 📊 **Real-Time Analytics** - Track registrations, attendance, and revenue
- 🎫 **Digital Ticketing** - QR code generation and check-in system
- 🔍 **Smart Discovery** - AI-powered event recommendations

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Auth**: Supabase Auth

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Validation**: Zod

### AI & Services
- **AI**: Grok/Gemini API (coming soon)
- **Images**: Unsplash API (coming soon)

## 📦 Project Structure

```
eventora/
├── frontend/          # Next.js frontend application
├── backend/           # Express backend API
├── shared/            # Shared TypeScript types
└── package.json       # Monorepo workspace config
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/saiteja7065/Eventora---AI-Powered-Event-Management-Platform.git
cd eventora
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env` files in both `frontend` and `backend` directories:

**frontend/.env.local**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**backend/.env**
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
DATABASE_URL=your_database_url
DIRECT_URL=your_database_url
```

4. **Set up Supabase**
- Create a new Supabase project
- Run the SQL schema from `backend/prisma/schema.sql`
- Enable Email authentication in Supabase Dashboard

5. **Run the development servers**
```bash
npm run dev
```

Visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎨 Design Philosophy

Eventora features a **"Futuristic & Alive"** design aesthetic:
- Dark mode default with vibrant gradient palettes
- Glass morphism effects throughout
- Animated mesh backgrounds
- Smooth micro-interactions
- Premium, modern feel

## 📖 Documentation

- [Database Setup Guide](DATABASE_SETUP.md)
- [Authentication Setup](AUTH_SETUP.md)

## 🚧 Development Status

- ✅ Landing page with animations
- ✅ Authentication system (Email + OAuth)
- ✅ Database schema
- ✅ Protected routes
- 🚧 AI Event Creation (Coming Soon)
- 🚧 Dashboard (Coming Soon)
- 🚧 Event Discovery (Coming Soon)
- 🚧 Ticketing System (Coming Soon)

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

## 📄 License

MIT License - feel free to use this project for learning purposes.

## 👨‍💻 Author

**Saiteja**
- GitHub: [@saiteja7065](https://github.com/saiteja7065)

---

**Built with ❤️ using Next.js, Supabase, and AI**
