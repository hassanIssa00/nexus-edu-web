# Million EdTech Platform

**A comprehensive school management platform for Saudi Arabia**  
Built with Next.js 16, TypeScript, Tailwind CSS, and Shadcn UI

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Features

### Multi-Role Dashboards
- **👨‍🎓 Student Dashboard:** Assignments, grades, attendance tracking, schedule
- **👨‍🏫 Teacher Dashboard:** Class management, grading, attendance marking, lesson planning
- **👪 Parent Dashboard:** Child monitoring, payment tracking, notifications
- **👨‍💼 Admin Dashboard:** User management, analytics, system configuration

### Core Capabilities
- ✅ Full RTL/LTR support (Arabic & English)
- ✅ Role-based authentication & authorization
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Real-time notifications
- ✅ Payment system simulation
- ✅ Premium feature locking
- ✅ Data visualization with charts

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **Animations:** Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Internationalization:** next-intl
- **Deployment:** Vercel

---

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier)
- Vercel account (optional, for deployment)

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/million-edtech.git
cd million-edtech/apps/web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env.local` in `apps/web/`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional (for NestJS backend)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**🔑 Get Supabase Credentials:**
1. Go to [app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy `Project URL` and `anon public` key

### 4. Database Setup

```bash
# Navigate to supabase directory
cd ../..
cd supabase

# Run migrations
npx supabase db push

# Seed demo data
npx supabase db seed
```

**Demo Accounts:**
- **Admin:** `admin@school.sa` / `password123`
- **Teacher:** `teacher@school.sa` / `password123`
- **Student:** `student@school.sa` / `password123`
- **Parent:** `parent@school.sa` / `password123`

### 5. Start Development Server

```bash
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚢 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/million-edtech)

**Manual Deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel
```

**Environment Variables on Vercel:**
1. Go to Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy

---

## 📂 Project Structure

```
apps/web/
├── app/                # Next.js App Router
│   ├── [locale]/       # Internationalized routes
│   │   ├── admin/      # Admin dashboard
│   │   ├── teacher/    # Teacher dashboard
│   │   ├── student/    # Student dashboard
│   │   ├── parent/     # Parent dashboard
│   │   └── pricing/    # Pricing page
│   ├── login/          # Authentication
│   └── layout.tsx      # Root layout
├── components/
│   ├── ui/             # Shadcn UI primitives
│   ├── layout/         # Sidebar, Header
│   ├── dashboard/      # Dashboard widgets
│   └── pricing/        # Payment components
├── contexts/           # React contexts (Auth)
├── lib/                # Utilities, Supabase client
├── messages/           # i18n translations (ar, en)
└── public/             # Static assets
```

---

## 🔐 Security

- Row Level Security (RLS) enabled on all Supabase tables
- Role-based route protection
- Auth guards on dashboard routes
- Environment variables for sensitive data

---

## 🌍 Internationalization

Supports Arabic (RTL) and English (LTR):

```tsx
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations('dashboard');
  return <h1>{t('welcome')}</h1>;
}
```

---

## 🎨 UI Components

Built with [Shadcn UI](https://ui.shadcn.com/):

```bash
# Add new component
npx shadcn@latest add <component-name>
```

---

## 🧪 Testing

```bash
# Type check
npm run check-types

# Lint
npm run lint

# Build check
npm run build
```

---

## 🚀 Features Roadmap

- [ ] Real-time chat between teachers & parents
- [ ] Video lessons integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered grading assistance
- [ ] Integration with Saudi MoE systems
- [ ] Parent-teacher conference scheduling
- [ ] Homework auto-grading
- [ ] Student performance predictions

---

## 📸 Screenshots

> **Note:** Add screenshots after deployment

### Landing Page
![Landing Page](./docs/screenshots/landing.png)

### Student Dashboard
![Student Dashboard](./docs/screenshots/student-dashboard.png)

### Admin Panel
![Admin Panel](./docs/screenshots/admin-panel.png)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🆘 Support

For issues and questions:
- **GitHub Issues:** [Report a bug](https://github.com/yourusername/million-edtech/issues)
- **Email:** support@yourdomain.com
- **Documentation:** [Wiki](https://github.com/yourusername/million-edtech/wiki)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)

Made with ❤️ for Saudi Education
