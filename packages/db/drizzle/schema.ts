import { pgTable, uuid, varchar, integer, text, timestamp, jsonb, foreignKey, unique, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const personalityProfile = pgTable("personality_profile", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: varchar("user_id", { length: 256 }).notNull(),
	openness: integer().notNull(),
	conscientiousness: integer().notNull(),
	extraversion: integer().notNull(),
	agreeableness: integer().notNull(),
	neuroticism: integer().notNull(),
	intuitionVsSensing: varchar("intuition_vs_sensing", { length: 50 }),
	thinkingVsFeeling: varchar("thinking_vs_feeling", { length: 50 }),
	pastExperiences: text("past_experiences"),
	currentChallenges: text("current_challenges"),
	hopesAndDreams: text("hopes_and_dreams"),
	fearsAndWorries: text("fears_and_worries"),
	favoriteElements: text("favorite_elements"),
	lifeArea: varchar("life_area", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const question = pgTable("question", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	text: text().notNull(),
	options: jsonb().notNull(),
	order: integer().notNull(),
	category: varchar({ length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const questionResponse = pgTable("question_response", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	questionId: uuid("question_id").notNull(),
	userId: varchar("user_id", { length: 256 }).notNull(),
	response: text().notNull(),
	responseLabel: text("response_label"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const spiritualReading = pgTable("spiritual_reading", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: varchar("user_id", { length: 256 }).notNull(),
	profileId: uuid("profile_id").notNull(),
	readingType: varchar("reading_type", { length: 50 }).notNull(),
	cardDrawn: varchar("card_drawn", { length: 100 }),
	interpretation: text().notNull(),
	guidanceMessage: text("guidance_message").notNull(),
	actionSteps: text("action_steps"),
	affirmation: text(),
	focusArea: varchar("focus_area", { length: 100 }),
	mood: varchar({ length: 50 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const prompt = pgTable("prompt", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	key: varchar({ length: 120 }).notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("prompt_key_unique").on(table.key),
]);

export const post = pgTable("post", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 256 }).notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});
