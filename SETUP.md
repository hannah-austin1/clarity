# Spiritual Clarity App - Setup Guide

## 🌟 Overview
A personalized spiritual guidance app that uses AI to provide meaningful insights based on users' personalities (Big 5 + MBTI), past experiences, and aspirations - with a beautiful tarot-like interface.

## 🚀 Quick Start

### 1. Environment Variables
Create a `.env` file in the root directory:

```bash
# Hugging Face API (FREE - get from https://huggingface.co/settings/tokens)
HUGGING_FACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx

# Database (use Neon, Supabase, or local Postgres)
DATABASE_URL=postgresql://user:password@localhost:5432/spiritual_clarity

# Auth (Better Auth)
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Set up Database
```bash
cd packages/db
pnpm db:push
```

### 4. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` to see your app!

## 📁 Project Structure

```
spiritual-clarity/
├── apps/
│   └── nextjs/
│       └── src/
│           ├── app/
│           │   ├── page.tsx                    # Landing page
│           │   ├── api/
│           │   │   └── reading/
│           │   │       └── route.ts            # AI reading generation API
│           │   └── _components/
│           │       ├── personality-questionnaire.tsx  # 5-step questionnaire
│           │       └── reading-display.tsx     # Reading results
│           └── trpc/
│               └── react.tsx
├── packages/
│   ├── db/
│   │   └── src/
│   │       └── schema.ts                      # Database schema
│   ├── api/
│   │   └── src/
│   │       └── router/
│   └── auth/
└── SETUP.md                                    # This file
```

## 🎨 Features

### 1. Personality Assessment
- **Big 5 OCEAN Traits**: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
- **MBTI-inspired**: Intuition vs Sensing, Thinking vs Feeling
- **Life Context**: Past experiences, current challenges, hopes, fears

### 2. AI-Powered Readings
- Uses **Mistral-7B** via Hugging Face (FREE!)
- 12 mystical cards (inspired by tarot archetypes)
- Personalized interpretations based on personality
- Actionable guidance steps
- Empowering affirmations

### 3. Beautiful UI
- Tarot-themed dark mode design
- Purple/pink gradient aesthetics
- Smooth animations
- Responsive layout

## 🔮 Mystical Cards

1. **The Seeker** (Air) - Quest for truth
2. **The Phoenix** (Fire) - Transformation
3. **The River** (Water) - Emotional wisdom
4. **The Mountain** (Earth) - Stability
5. **The Star Guide** (Air) - Hope & inspiration
6. **The Mirror** (Water) - Self-reflection
7. **The Bridge** (Earth) - Connection
8. **The Flame** (Fire) - Passion & purpose
9. **The Garden** (Earth) - Growth
10. **The Compass** (Air) - Direction
11. **The Ocean** (Water) - Depth & mystery
12. **The Lighthouse** (Fire) - Illumination

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **AI**: Hugging Face Inference API (Mistral-7B-Instruct)
- **Type Safety**: TypeScript + Zod
- **Monorepo**: Turborepo + pnpm

## 🎯 Next Steps

### To Complete the App:

1. **Create the main page** that ties everything together
2. **Create the reading display component** to show results beautifully
3. **Add database integration** to save user profiles and readings
4. **Implement authentication** so users can track their journey
5. **Add reading history** page
6. **Deploy to Vercel**

### Optional Enhancements:

- Daily reading reminders
- Journal integration
- Share readings with friends
- Multiple reading types (past/present/future)
- Premium features with different AI models
- Mobile app with Expo

## 📝 Getting Your FREE Hugging Face API Key

1. Go to https://huggingface.co/
2. Sign up for a free account
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token (starts with `hf_`)
6. Add it to your `.env` file

**Note**: The free tier includes:
- Unlimited API calls
- May have rate limits during peak times
- Model may take a few seconds to "wake up" if unused

## 🎨 Color Palette

- Purple: `#8b5cf6` to `#7c3aed`
- Pink: `#ec4899` to `#db2777`
- Background: Deep purples and blacks
- Accents: Gold `#fbbf24` for special elements

## 📱 Screenshots

[Add screenshots here once the app is complete]

## 🤝 Contributing

This is a personal project, but feel free to fork and customize!

## 📄 License

MIT License - feel free to use this code for your own projects!

---

**Built with ✨ and 💜 for women seeking clarity and empowerment**
