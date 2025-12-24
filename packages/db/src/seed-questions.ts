/**
 * Seed script to populate the questions table with the Turning of the Year questionnaire
 * Run this after pushing the database schema: pnpm tsx src/seed-questions.ts
 */

import { resolve } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { eq } from "drizzle-orm";

import { Prompt, Question } from "./schema";

// Load .env from root
const envPath = resolve(fileURLToPath(new URL("../../../.env", import.meta.url)));
config({ path: envPath });

// Use postgres.js which works with pooled connections
const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("Missing POSTGRES_URL");
}

const client = postgres(connectionString);
const db = drizzle(client, { casing: "snake_case" });

const promptTemplate = `You are giving a tarot-style reading for the turning of the year.
Tone: symbolic, warm, intuitive, lightly playful.
Not predictive. Not clinical. No "you should." No diagnosis.

Use the card names as archetypes and speak as if the cards are revealing patterns.

Here is the spread:
1. The Burden: {{burdenCard}}
2. The Leak: {{leakCard}}
3. The Survival Skill: {{survivalSkillCard}}
4. The Shadow Cost: {{shadowCostCard}}
5. The Missing Medicine: {{missingMedicineCard}}
6. The Way Help Works: {{helpWorksCard}}
7. The Boundary Spell: {{boundarySpellCard}}
8. The North Star: {{northStarCard}}
9. The First Gate: {{firstGateCard}}
10. The Emerging Archetype: {{emergingArchetypeCard}}

The seeker has drawn "{{cardName}}" ({{cardElement}} element - symbolizing {{cardMeaning}}).

{{personalityDesc}}

{{contextDesc}}

TASK:
Create TWO sections.

SECTION I — The Reading
- 3–4 paragraphs telling the story of the year:
  - what weighed on them
  - how they adapted
  - why it makes sense
- Then describe next year as a rebalancing, not a reinvention.

SECTION II — The Path Opens
List 3–5 types of supportive next steps (not specific businesses), such as:
- "A beginner-friendly gym or movement practice with consistent times"
- "Low-pressure, activity-based dating or social spaces"
- "Weekly class or group with a stable cohort"
- "Routine-building spaces like studios, coworking, or scheduled programs"

For each:
- Name which cards it supports
- Explain why it reduces friction
- Include one thing to avoid based on the Boundary Spell

Constraints:
- 600–800 words max.
- Keep the magic gentle and grounded.
- Emphasize that change comes from choosing better containers, not pushing harder.
- End with reassurance that the first gate is already open.`;

const questions = [
  {
    text: "I — The Burden: What was your main plot twist this year?",
    options: [
      "burden_atlas|The Atlas|Booked, responsible, carrying everyone",
      "burden_fog|The Fog|So many tabs, no clear next step",
      "burden_treadmill|The Treadmill|Busy but not forward",
      "burden_knots|The Knots|Entanglements and obligations",
      "burden_empty_cup|The Empty Cup|Pouring out with no refill",
      "burden_split_path|The Split Path|Too many options, no obvious yes",
    ],
    order: 1,
    category: "turning_of_year",
  },
  {
    text: "II — The Leak: Where did your energy disappear?",
    options: [
      "leak_cracked_vessel|The Cracked Vessel|Rest didn't really land",
      "leak_frayed_rope|The Frayed Rope|Motivation kept ghosting",
      "leak_dim_mirror|The Dim Mirror|Confidence dipped on repeat",
      "leak_closed_door|The Closed Door|Connection felt weirdly far",
      "leak_stolen_hours|The Stolen Hours|Time vanished into errands",
      "leak_loose_structure|The Loose Structure|Routines fell apart by Wednesday",
    ],
    order: 2,
    category: "turning_of_year",
  },
  {
    text: "III — The Survival Skill: Your go-to coping mode?",
    options: [
      "survival_endurer|The Endurer|Grit, even when it wasn't cute",
      "survival_hermit|The Hermit|Hide, recover, regroup",
      "survival_mask|The Mask|Look fine, feel not-fine",
      "survival_juggler|The Juggler|Busy as a coping skill",
      "survival_thinker|The Thinker|Overthinking for safety",
      "survival_anchor|The Anchor|One steady thing held you up",
    ],
    order: 3,
    category: "turning_of_year",
  },
  {
    text: "IV — The Shadow Cost: What did it quietly cost?",
    options: [
      "shadow_lead_limbs|The Lead Limbs|The fatigue is real",
      "shadow_still_water|The Still Water|Stuck in a loop",
      "shadow_empty_room|The Empty Room|Lonely even with people",
      "shadow_doubting_voice|The Doubting Voice|Second-guessing everything",
      "shadow_tight_chest|The Tight Chest|Pressure lived in your body",
      "shadow_itch|The Itch|Restless, but unsure what next",
    ],
    order: 4,
    category: "turning_of_year",
  },
  {
    text: "V — The Missing Medicine: What would've changed the game?",
    options: [
      "medicine_guide|The Guide|Accountability + a plan",
      "medicine_feather|The Feather|Less pressure, more ease",
      "medicine_wheel|The Wheel|Momentum that sticks",
      "medicine_hearth|The Hearth|Warmth and belonging",
      "medicine_lantern|The Lantern|Clear, simple direction",
      "medicine_stone|The Stone|Stability you can count on",
    ],
    order: 5,
    category: "turning_of_year",
  },
  {
    text: "VI — The Way Help Works: What format actually helps?",
    options: [
      "help_schedule|The Schedule|Set times, no guessing",
      "help_open_door|The Open Door|Drop in, low-pressure",
      "help_table|The Table|Doing it with others",
      "help_thread|The Thread|1:1 support",
      "help_teacher|The Teacher|A coach or class",
      "help_solo_path|The Solo Path|Self-paced, no pressure",
    ],
    order: 6,
    category: "turning_of_year",
  },
  {
    text: "VII — The Boundary Spell: What are we not doing in 2026?",
    options: [
      "boundary_overfull_cup|The Overfull Cup|Overgiving on autopilot",
      "boundary_lone_wolf|The Lone Wolf|Doing everything alone",
      "boundary_someday_scroll|The Someday Scroll|Waiting to feel ready",
      "boundary_firestorm|The Firestorm|Reactive chaos",
      "boundary_people_pleaser|The People-Pleaser|Smoothing everything for everyone",
      "boundary_all_or_nothing|The All-or-Nothing Blade|Perfection or silence",
    ],
    order: 7,
    category: "turning_of_year",
  },
  {
    text: "VIII — The North Star: What do you want 2026 to feel like?",
    options: [
      "north_star_strong_body|The Strong Body|Vital, strong, steady",
      "north_star_open_heart|The Open Heart|Warm, connected, seen",
      "north_star_true_line|The True Line|Clear, aligned direction",
      "north_star_playful_spirit|The Playful Spirit|Fun that refills you",
      "north_star_steady_ground|The Steady Ground|Stable, reliable routines",
      "north_star_speaking_voice|The Speaking Voice|Expressive and visible",
    ],
    order: 8,
    category: "turning_of_year",
  },
  {
    text: "IX — The First Gate: Where should momentum start?",
    options: [
      "first_gate_body|The Body Gate|Movement, health, energy",
      "first_gate_time|The Time Gate|Routines and calendar",
      "first_gate_circle|The Circle Gate|Dating, social, connection",
      "first_gate_skill|The Skill Gate|Skills and confidence",
      "first_gate_space|The Space Gate|Your environment shapes you",
      "first_gate_mind|The Mind Gate|Mindset + clarity",
    ],
    order: 9,
    category: "turning_of_year",
  },
  {
    text: "X — The Emerging Archetype: Who are you becoming?",
    options: [
      "archetype_rebuilder|The Rebuilder|Repair, renew, rebuild",
      "archetype_steady_flame|The Steady Flame|Consistency over chaos",
      "archetype_connector|The Connector|Community and bonds",
      "archetype_explorer|The Explorer|New paths, new stories",
      "archetype_self_leader|The Self-Leader|Agency and boundaries",
      "archetype_beginner|The Beginner (Again)|Fresh starts, kinder rules",
    ],
    order: 10,
    category: "turning_of_year",
  },
];

async function seed() {
  console.log("🌱 Seeding questions...");
  const now = new Date();

  try {
    await db
      .delete(Prompt)
      .where(eq(Prompt.key, "turning_of_year_reading"));
    await db.insert(Prompt).values({
      key: "turning_of_year_reading",
      content: promptTemplate,
      createdAt: now,
      updatedAt: now,
    });
    console.log("✓ Added: turning_of_year_reading prompt");

    // Insert all questions
    await db
      .delete(Question)
      .where(eq(Question.category, "turning_of_year"));
    for (const question of questions) {
      await db.insert(Question).values({
        ...question,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`✓ Added: ${question.text.substring(0, 50)}...`);
    }

    console.log("✨ Seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
    throw error;
  } finally {
    // Close the connection
    await client.end();
  }
}

export { seed };

// Run if executed directly (ES module check)
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
