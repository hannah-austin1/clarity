# Drizzle + Supabase Integration for Questions

This document outlines the integration of Drizzle ORM with Supabase to store questionnaire questions and responses.

## ✅ What's Been Completed

1. **Database Schema** (`packages/db/src/schema.ts`)
   - ✅ Added `Question` table for storing questionnaire questions
   - ✅ Added `QuestionResponse` table for storing user answers
   - ✅ Created Zod validation schemas

2. **Database Migration**
   - ✅ Generated migration file: `packages/db/drizzle/0000_chubby_spirit.sql`
   - ⏳ Ready to push to database (pending correct connection string)

3. **API Router** (`packages/api/src/router/question.ts`)
   - ✅ Created full CRUD operations for questions
   - ✅ Added endpoints for submitting responses
   - ✅ Added endpoints for fetching user responses
   - ✅ Integrated with tRPC router

4. **Seed Script** (`packages/db/src/seed-questions.ts`)
   - ✅ Created seed data for all 18 questionnaire questions
   - ✅ Organized by categories: turning_of_year, personality, life_area

## 🔧 Next Steps to Complete Setup

### Step 1: Fix Database Connection

You need to update your `.env` file with the correct Supabase connection string.

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Project Settings** → **Database**
4. Under **Connection string** section, select **"Transaction"** mode (NOT Session mode)
5. Copy the URI - it should use **port 6543** and look like this:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xxxxx.pooler.supabase.com:6543/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual database password
7. Update `.env` file:
   ```bash
   POSTGRES_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xxxxx.pooler.supabase.com:6543/postgres
   ```

**Important:** Use **Transaction pooler (port 6543)** not Session pooler. Transaction mode is required for Drizzle ORM to work correctly with migrations.

### Step 2: Push Database Schema

Once you have the correct connection string, run:

```bash
# From the root directory
export POSTGRES_URL="your-actual-connection-string"
cd packages/db
pnpm drizzle-kit push
```

This will create the `question` and `question_response` tables in your Supabase database.

### Step 3: Seed Questions

After the schema is pushed, populate the questions:

```bash
# From packages/db directory
export POSTGRES_URL="your-actual-connection-string"
pnpm tsx src/seed-questions.ts
```

This will add all 18 questionnaire questions to your database.

### Step 4: Update Environment Variables

Make sure all apps can access the database. Add to your main `.env`:

```bash
# Supabase Database Connection
POSTGRES_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xxxxx.pooler.supabase.com:6543/postgres
```

## 📊 Database Schema

### Question Table

| Column     | Type         | Description                                                   |
| ---------- | ------------ | ------------------------------------------------------------- |
| id         | uuid         | Primary key                                                   |
| text       | text         | Question text                                                 |
| options    | jsonb        | Array of option strings (format: "value\|title\|description") |
| order      | integer      | Display order                                                 |
| category   | varchar(100) | Category: turning_of_year, personality, life_area             |
| created_at | timestamp    | Creation timestamp                                            |
| updated_at | timestamp    | Last update timestamp                                         |

### QuestionResponse Table

| Column         | Type         | Description                       |
| -------------- | ------------ | --------------------------------- |
| id             | uuid         | Primary key                       |
| question_id    | uuid         | Foreign key to Question           |
| user_id        | varchar(256) | User identifier from auth         |
| response       | text         | User's selected response value    |
| response_label | text         | Human-readable label for response |
| created_at     | timestamp    | Response timestamp                |

## 🔌 API Endpoints (via tRPC)

### Public Endpoints

- `question.all` - Get all questions
- `question.byId` - Get question by ID
- `question.byCategory` - Get questions by category

### Protected Endpoints (require authentication)

- `question.create` - Create a new question
- `question.update` - Update a question
- `question.delete` - Delete a question
- `question.submitResponse` - Submit a response to a question
- `question.myResponses` - Get user's responses
- `question.myResponsesWithQuestions` - Get user's responses with question details

## 💻 Usage Examples

### Fetching Questions in React

```typescript
import { api } from "~/trpc/react";

function QuestionnairePage() {
  const {  questions } = api.question.byCategory.useQuery({
    category: "turning_of_year"
  });

  return (
    <div>
      {questions?.map(q => (
        <div key={q.id}>
          <h3>{q.text}</h3>
          {/* Render options */}
        </div>
      ))}
    </div>
  );
}
```

### Submitting a Response

```typescript
const submitResponse = api.question.submitResponse.useMutation();

function handleAnswer(questionId: string, response: string, label: string) {
  submitResponse.mutate({
    questionId,
    response,
    responseLabel: label,
  });
}
```

### Fetching User Responses

```typescript
const { responses } = api.question.myResponsesWithQuestions.useQuery();

// responses will include both the response and the question details
```

## 🎨 Option Format

Questions store options in a pipe-delimited format:

```
value|title|description
```

Examples:

- `"burden_atlas|The Atlas|You held too much, too often"`
- `"20|The Familiar|I prefer what I already know"`

When displaying, parse each option:

```typescript
const [value, title, description] = option.split("|");
```

## 🚀 Integration with Current Questionnaire

The current questionnaire component (`personality-questionnaire.tsx`) can be updated to:

1. Fetch questions from the database instead of hardcoding them
2. Submit responses to the database as users progress
3. Load previous responses for returning users
4. Support dynamic questionnaire updates without code changes

## 📝 Notes

- The migration file includes all existing tables (personality_profile, spiritual_reading, auth tables)
- Questions are ordered by the `order` field (ascending)
- Responses are linked to users via `userId` from the auth system
- The seed script uses the same question structure as the current React component

## 🔐 Security

- Question responses are protected and only accessible to the authenticated user
- Admin functions (create/update/delete questions) require authentication
- Consider adding role-based access control for admin functions

## 🐛 Troubleshooting

If you encounter connection issues:

1. Verify your Supabase project is active
2. Check that the connection string includes `:6543` port for connection pooling
3. Ensure your IP is whitelisted in Supabase (or disable IP restrictions for development)
4. Try the direct connection (port 5432) if pooling doesn't work

Need help? Check the Supabase docs: https://supabase.com/docs/guides/database
