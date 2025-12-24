import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const Post = pgTable("post", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Personality Profile Schema - Big 5 OCEAN + MBTI elements
export const PersonalityProfile = pgTable("personality_profile", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t.varchar({ length: 256 }).notNull(),

  // Big 5 OCEAN traits (0-100 scale)
  openness: t.integer().notNull(),
  conscientiousness: t.integer().notNull(),
  extraversion: t.integer().notNull(),
  agreeableness: t.integer().notNull(),
  neuroticism: t.integer().notNull(),

  // MBTI-inspired dimensions
  intuitionVsSensing: t.varchar({ length: 50 }), // "intuition" or "sensing"
  thinkingVsFeeling: t.varchar({ length: 50 }), // "thinking" or "feeling"

  // Life context
  pastExperiences: t.text(),
  currentChallenges: t.text(),
  hopesAndDreams: t.text(),
  fearsAndWorries: t.text(),

  // Spiritual preferences
  favoriteElements: t.text(), // JSON array of elements: earth, air, fire, water
  lifeArea: t.varchar({ length: 100 }), // career, love, health, spiritual, personal

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const CreatePersonalityProfileSchema = createInsertSchema(
  PersonalityProfile,
  {
    openness: z.number().min(0).max(100),
    conscientiousness: z.number().min(0).max(100),
    extraversion: z.number().min(0).max(100),
    agreeableness: z.number().min(0).max(100),
    neuroticism: z.number().min(0).max(100),
    intuitionVsSensing: z.enum(["intuition", "sensing"]).optional(),
    thinkingVsFeeling: z.enum(["thinking", "feeling"]).optional(),
    pastExperiences: z.string().optional(),
    currentChallenges: z.string().optional(),
    hopesAndDreams: z.string().optional(),
    fearsAndWorries: z.string().optional(),
    favoriteElements: z.string().optional(),
    lifeArea: z
      .enum(["career", "love", "health", "spiritual", "personal"])
      .optional(),
  },
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Spiritual Reading Schema
export const SpiritualReading = pgTable("spiritual_reading", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t.varchar({ length: 256 }).notNull(),
  profileId: t.uuid().notNull(),

  // Reading content
  readingType: t.varchar({ length: 50 }).notNull(), // "clarity", "guidance", "insight"
  cardDrawn: t.varchar({ length: 100 }), // symbolic card name
  interpretation: t.text().notNull(),
  guidanceMessage: t.text().notNull(),
  actionSteps: t.text(), // JSON array of action items
  affirmation: t.text(),

  // Metadata
  focusArea: t.varchar({ length: 100 }), // what user focused on
  mood: t.varchar({ length: 50 }), // user's mood during reading

  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const CreateSpiritualReadingSchema = createInsertSchema(
  SpiritualReading,
  {
    readingType: z.enum(["clarity", "guidance", "insight"]),
    cardDrawn: z.string().optional(),
    interpretation: z.string(),
    guidanceMessage: z.string(),
    actionSteps: z.string().optional(),
    affirmation: z.string().optional(),
    focusArea: z.string().optional(),
    mood: z.string().optional(),
  },
).omit({
  id: true,
  createdAt: true,
});

// Question Schema for storing questionnaire questions
export const Question = pgTable("question", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  text: t.text().notNull(),
  options: t.jsonb().$type<string[]>().notNull(),
  order: t.integer().notNull(),
  category: t.varchar({ length: 100 }), // e.g., "turning_of_year", "personality", "life_context"
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const CreateQuestionSchema = createInsertSchema(Question, {
  text: z.string().min(1),
  options: z.array(z.string()).min(2),
  order: z.number().int().min(0),
  category: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Question Response Schema for storing user answers
export const QuestionResponse = pgTable("question_response", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  questionId: t.uuid().notNull(),
  userId: t.varchar({ length: 256 }).notNull(),
  response: t.text().notNull(),
  responseLabel: t.text(), // Human-readable label for the response
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const CreateQuestionResponseSchema = createInsertSchema(
  QuestionResponse,
  {
    questionId: z.string().uuid(),
    response: z.string().min(1),
    responseLabel: z.string().optional(),
  },
).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Prompt templates for AI
export const Prompt = pgTable("prompt", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  key: t.varchar({ length: 120 }).notNull().unique(),
  content: t.text().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const CreatePromptSchema = createInsertSchema(Prompt, {
  key: z.string().min(1),
  content: z.string().min(1),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export * from "./auth-schema";
