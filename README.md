# 🔮 Spiritual Clarity

**AI-Powered Personalized Spiritual Guidance for Women**

A modern spiritual guidance app that combines personality psychology (Big 5 + MBTI), AI technology, and beautiful tarot-inspired design to provide deeply personalized insights, actionable guidance, and empowering affirmations.

## ✨ Features

### 🧠 Personality-Based Readings
- **Big 5 OCEAN Assessment**: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
- **MBTI-Inspired Dimensions**: Intuition vs Sensing, Thinking vs Feeling
- **Life Context Integration**: Past experiences, current challenges, hopes, and fears

### 🤖 AI-Powered Insights
- Uses **Mistral-7B-Instruct** via Hugging Face's FREE API
- Generates personalized interpretations based on your unique profile
- 12 mystical cards inspired by tarot archetypes
- Concrete action steps tailored to your personality

### 🎨 Beautiful Tarot-Like Interface
- Gorgeous purple/pink gradient design
- Smooth animations and transitions
- Responsive mobile-first layout
- Interactive card reveal experience

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (you have v24.6.0 ✓)
- pnpm (you have v10.19.0 ✓)
- PostgreSQL database (local or cloud)
- Hugging Face account (free)

### 1. Clone & Install

```bash
cd ~/Dev/spiritual-clarity
pnpm install
```

### 2. Get Your FREE Hugging Face API Key

1. Go to [huggingface.co](https://huggingface.co)
2. Sign up for a free account
3. Navigate to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token (starts with `hf_`)

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```bash
# Required: Get from https://huggingface.co/settings/tokens
HUGGING_FACE_API_KEY=hf_your_actual_token_here

# Database (use Neon.tech for free PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/spiritual_clarity

# Auth (generate a random 32+ character string)
BETTER_AUTH_SECRET=your-random-secret-here
BETTER_AUTH_URL=http://localhost:3000

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Database

```bash
cd packages/db
pnpm db:push
```

### 5. Run Development Server

```bash
# From root directory
pnpm dev
```

Visit **http://localhost:3000** 🎉

## 📁 Project Structure

```
spiritual-clarity/
├── apps/
│   └── nextjs/              # Main Next.js application
│       └── src/
│           ├── app/
│           │   ├── page.tsx                    # Landing page & app logic
│           │   ├── api/
│           │   │   └── reading/
│           │   │       └── route.ts            # AI reading generation
│           │   └── _components/
│           │       ├── personality-questionnaire.tsx
│           │       └── reading-display.tsx
│           └── env.ts       # Environment validation
├── packages/
│   ├── db/                  # Database schema & client
│   │   └── src/
│   │       └── schema.ts    # PersonalityProfile & SpiritualReading tables
│   ├── api/                 # tRPC API routes
│   ├── auth/                # Better Auth configuration
│   └── ui/                  # Shared UI components
└── README.md                # This file
```

## 🔮 The 12 Mystical Cards

Each card is automatically selected based on your personality profile:

| Card | Element | Meaning |
|------|---------|---------|
| The Seeker | Air | Quest for truth and knowledge |
| The Phoenix | Fire | Transformation and renewal |
| The River | Water | Flow and emotional wisdom |
| The Mountain | Earth | Stability and grounding |
| The Star Guide | Air | Hope and inspiration |
| The Mirror | Water | Self-reflection and clarity |
| The Bridge | Earth | Connection and transition |
| The Flame | Fire | Passion and purpose |
| The Garden | Earth | Growth and nurturing |
| The Compass | Air | Direction and guidance |
| The Ocean | Water | Depth and mystery |
| The Lighthouse | Fire | Illumination and hope |

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth
- **AI**: Hugging Face Inference API (Mistral-7B)
- **Monorepo**: Turborepo + pnpm workspaces
- **Validation**: Zod
- **Deployment**: Vercel-ready

## 🎯 How It Works

1. **User Journey Begins**: Beautiful landing page explains the experience
2. **5-Step Questionnaire**: 
   - Personality traits (Big 5)
   - Cognitive style (MBTI-inspired)
   - Life context (experiences, challenges, hopes, fears)
3. **AI Processing**:
   - Selects appropriate mystical card based on personality
   - Generates personalized interpretation using Mistral-7B
   - Creates actionable guidance and affirmation
4. **Reading Display**: 
   - Interactive card reveal
   - Detailed interpretation
   - Practical action steps
   - Empowering affirmation
5. **Save & Reflect**: Users can print or start a new reading

## 🎨 Design System

### Color Palette
- **Primary Purple**: `#8b5cf6` to `#7c3aed`
- **Primary Pink**: `#ec4899` to `#db2777`
- **Background**: Deep purples (`#581c87`) to black
- **Accents**: Various element colors (fire, water, earth, air)

### Typography
- **Headers**: Bold, gradient text
- **Body**: Purple-tinted whites for readability
- **Affirmations**: Serif font, italic for emphasis

## 📝 Database Schema

### PersonalityProfile
```typescript
{
  id: uuid
  userId: string
  openness: number (0-100)
  conscientiousness: number (0-100)
  extraversion: number (0-100)
  agreeableness: number (0-100)
  neuroticism: number (0-100)
  intuitionVsSensing?: string
  thinkingVsFeeling?: string
  pastExperiences?: text
  currentChallenges?: text
  hopesAndDreams?: text
  fearsAndWorries?: text
  lifeArea?: string
  createdAt: timestamp
}
```

### SpiritualReading
```typescript
{
  id: uuid
  userId: string
  profileId: uuid
  readingType: string
  cardDrawn: string
  interpretation: text
  guidanceMessage: text
  actionSteps: text (JSON array)
  affirmation: text
  focusArea?: string
  mood?: string
  createdAt: timestamp
}
```

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Environment Variables for Production

In Vercel dashboard, add:
- `HUGGING_FACE_API_KEY`
- `DATABASE_URL` (use Neon, Supabase, or Railway)
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL` (your production URL)
- `NEXT_PUBLIC_APP_URL`

## 🔒 Privacy & Security

- User data is stored securely in PostgreSQL
- No data is shared with third parties
- Hugging Face API doesn't store prompts
- All connections use HTTPS in production
- Auth tokens are properly hashed

## 🎓 Personality Science

### Big 5 (OCEAN)
The most scientifically validated personality framework:
- **O**penness: Creativity, curiosity, openness to experience
- **C**onscientiousness: Organization, discipline, reliability
- **E**xtraversion: Social energy, assertiveness, enthusiasm
- **A**greeableness: Compassion, cooperation, trust
- **N**euroticism: Emotional stability (inverted in our UI)

### MBTI-Inspired
Additional dimensions for richer insights:
- **Intuition vs Sensing**: Abstract patterns vs concrete details
- **Thinking vs Feeling**: Logic-based vs values-based decisions

## 🤝 Contributing

This is a personal project, but you're welcome to:
- Fork it for your own use
- Submit bug reports
- Suggest features
- Share improvements

## 📜 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- Built with Create T3 Turbo
- AI powered by Hugging Face
- Inspired by tarot and personality psychology
- Created for women seeking clarity and empowerment

## 💡 Future Enhancements

- [ ] User authentication & reading history
- [ ] Daily reading reminders
- [ ] Journal integration
- [ ] Share readings with friends
- [ ] Multiple reading types (past/present/future, relationship, career)
- [ ] Premium features with GPT-4
- [ ] Mobile app with Expo
- [ ] Reading analytics & insights over time

## 📞 Support

Having issues? Check:
1. Node version (need 18+)
2. Environment variables are set correctly
3. Database is running and accessible
4. Hugging Face API key is valid
5. Check console for errors

## ⭐ Show Your Support

If this project helped you gain clarity, consider:
- Starring the repo ⭐
- Sharing with friends who might benefit
- Contributing improvements
- Providing feedback

---

**Built with ✨ and 💜 for women seeking clarity and empowerment**

*Using AI and proven personality science to illuminate your path forward*
