import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { eq } from "@acme/db";
import { db } from "@acme/db/client";
import { Prompt } from "@acme/db/schema";

const ReadingRequestSchema = z.object({
  personalityProfile: z.object({
    burdenCard: z.string().optional(),
    burdenCardLabel: z.string().optional(),
    leakCard: z.string().optional(),
    leakCardLabel: z.string().optional(),
    survivalSkillCard: z.string().optional(),
    survivalSkillCardLabel: z.string().optional(),
    shadowCostCard: z.string().optional(),
    shadowCostCardLabel: z.string().optional(),
    missingMedicineCard: z.string().optional(),
    missingMedicineCardLabel: z.string().optional(),
    helpWorksCard: z.string().optional(),
    helpWorksCardLabel: z.string().optional(),
    boundarySpellCard: z.string().optional(),
    boundarySpellCardLabel: z.string().optional(),
    northStarCard: z.string().optional(),
    northStarCardLabel: z.string().optional(),
    firstGateCard: z.string().optional(),
    firstGateCardLabel: z.string().optional(),
    emergingArchetypeCard: z.string().optional(),
    emergingArchetypeCardLabel: z.string().optional(),
    yearStruggles: z.string().optional(),
    yearStrugglesLabel: z.string().optional(),
    yearWants: z.string().optional(),
    yearWantsLabel: z.string().optional(),
    openness: z.number().min(0).max(100),
    conscientiousness: z.number().min(0).max(100),
    extraversion: z.number().min(0).max(100),
    agreeableness: z.number().min(0).max(100),
    neuroticism: z.number().min(0).max(100),
    intuitionVsSensing: z.string().optional(),
    intuitionVsSensingLabel: z.string().optional(),
    thinkingVsFeeling: z.string().optional(),
    thinkingVsFeelingLabel: z.string().optional(),
    pastExperiences: z.string().optional(),
    pastExperiencesLabel: z.string().optional(),
    currentChallenges: z.string().optional(),
    currentChallengesLabel: z.string().optional(),
    hopesAndDreams: z.string().optional(),
    hopesAndDreamsLabel: z.string().optional(),
    fearsAndWorries: z.string().optional(),
    fearsAndWorriesLabel: z.string().optional(),
    lifeArea: z.string().optional(),
    lifeAreaLabel: z.string().optional(),
  }),
  focusArea: z.string().optional(),
  mood: z.string().optional(),
});

// Mystical cards inspired by tarot archetypes
const MYSTICAL_CARDS = [
  { name: "The Seeker", element: "air", meaning: "quest for truth and knowledge" },
  { name: "The Phoenix", element: "fire", meaning: "transformation and renewal" },
  { name: "The River", element: "water", meaning: "flow and emotional wisdom" },
  { name: "The Mountain", element: "earth", meaning: "stability and grounding" },
  { name: "The Star Guide", element: "air", meaning: "hope and inspiration" },
  { name: "The Mirror", element: "water", meaning: "self-reflection and clarity" },
  { name: "The Bridge", element: "earth", meaning: "connection and transition" },
  { name: "The Flame", element: "fire", meaning: "passion and purpose" },
  { name: "The Garden", element: "earth", meaning: "growth and nurturing" },
  { name: "The Compass", element: "air", meaning: "direction and guidance" },
  { name: "The Ocean", element: "water", meaning: "depth and mystery" },
  { name: "The Lighthouse", element: "fire", meaning: "illumination and hope" },
];

function selectCard(profile: any) {
  // Select card based on personality traits
  const { openness, extraversion, neuroticism } = profile;
  const lifeArea = (profile.lifeAreaLabel || profile.lifeArea || "").toLowerCase();
  
  let cardIndex = 0;
  
  if (openness > 70) {
    cardIndex = extraversion > 60 ? 0 : 4; // Seeker or Star Guide
  } else if (neuroticism > 60) {
    cardIndex = 1; // Phoenix (transformation)
  } else if (lifeArea.includes("love") || lifeArea.includes("spiritual")) {
    cardIndex = 5; // Mirror (reflection)
  } else if (lifeArea.includes("career")) {
    cardIndex = 9; // Compass (direction)
  } else {
    // Random selection with personality seed
    cardIndex = Math.floor((openness + extraversion) / 20) % MYSTICAL_CARDS.length;
  }
  
  return MYSTICAL_CARDS[cardIndex]!;
}

async function generateReadingWithAI(prompt: string) {
  const { env } = await import("~/env");
  
  try {
    const models = [
      "tngtech/deepseek-r1t2-chimera:free",
      "deepseek/deepseek-chat:free",
    ];

    let lastError: Error | null = null;

    for (const model of models) {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://spiritual-clarity.app",
            "X-Title": "Spiritual Clarity",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "You are a wise, empathetic spiritual guide providing personalized insights based on personality psychology and tarot-inspired wisdom.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.8,
            max_tokens: 600,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.choices[0]?.message?.content || "";
      }

      const error = await response.text();
      lastError = new Error(
        `OpenRouter API error: ${response.statusText} - ${error}`
      );
    }

    throw lastError ?? new Error("OpenRouter API error: No models available");
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
}

const DEFAULT_PROMPT_TEMPLATE = `You are giving a tarot-style reading for the turning of the year.
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

async function getPromptTemplate() {
  try {
    const prompt = await db.query.Prompt.findFirst({
      where: eq(Prompt.key, "turning_of_year_reading"),
    });
    return prompt?.content || DEFAULT_PROMPT_TEMPLATE;
  } catch (error) {
    console.error("Error loading prompt template:", error);
    return DEFAULT_PROMPT_TEMPLATE;
  }
}

function renderPromptTemplate(template: string, data: Record<string, string>) {
  return Object.entries(data).reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), () => value),
    template,
  );
}

function buildPrompt(
  template: string,
  profile: any,
  card: any,
  focusArea?: string,
  mood?: string,
) {
  const perception = profile.intuitionVsSensingLabel || profile.intuitionVsSensing;
  const decision = profile.thinkingVsFeelingLabel || profile.thinkingVsFeeling;
  const lifeArea = profile.lifeAreaLabel || profile.lifeArea;
  const yearStruggles = profile.yearStrugglesLabel || profile.yearStruggles;
  const yearWants = profile.yearWantsLabel || profile.yearWants;
  const pastExperiences = profile.pastExperiencesLabel || profile.pastExperiences;
  const currentChallenges = profile.currentChallengesLabel || profile.currentChallenges;
  const hopesAndDreams = profile.hopesAndDreamsLabel || profile.hopesAndDreams;
  const fearsAndWorries = profile.fearsAndWorriesLabel || profile.fearsAndWorries;
  const burdenCard = profile.burdenCardLabel || profile.burdenCard || "Unrevealed";
  const leakCard = profile.leakCardLabel || profile.leakCard || "Unrevealed";
  const survivalSkillCard =
    profile.survivalSkillCardLabel || profile.survivalSkillCard || "Unrevealed";
  const shadowCostCard =
    profile.shadowCostCardLabel || profile.shadowCostCard || "Unrevealed";
  const missingMedicineCard =
    profile.missingMedicineCardLabel || profile.missingMedicineCard || "Unrevealed";
  const helpWorksCard =
    profile.helpWorksCardLabel || profile.helpWorksCard || "Unrevealed";
  const boundarySpellCard =
    profile.boundarySpellCardLabel || profile.boundarySpellCard || "Unrevealed";
  const northStarCard =
    profile.northStarCardLabel || profile.northStarCard || "Unrevealed";
  const firstGateCard =
    profile.firstGateCardLabel || profile.firstGateCard || "Unrevealed";
  const emergingArchetypeCard =
    profile.emergingArchetypeCardLabel || profile.emergingArchetypeCard || "Unrevealed";

  const personalityDesc = `
Personality Traits (Big 5 OCEAN):
- Openness: ${profile.openness}/100 (${profile.openness > 70 ? "highly creative and curious" : profile.openness > 40 ? "balanced" : "practical and traditional"})
- Conscientiousness: ${profile.conscientiousness}/100 (${profile.conscientiousness > 70 ? "organized and disciplined" : profile.conscientiousness > 40 ? "flexible" : "spontaneous"})
- Extraversion: ${profile.extraversion}/100 (${profile.extraversion > 70 ? "outgoing and energetic" : profile.extraversion > 40 ? "balanced" : "introspective"})
- Agreeableness: ${profile.agreeableness}/100 (${profile.agreeableness > 70 ? "compassionate and cooperative" : profile.agreeableness > 40 ? "balanced" : "assertive"})
- Emotional Stability: ${100 - profile.neuroticism}/100

Cognitive Style: ${perception || "balanced"}
Decision Making: ${decision || "balanced"}
`;

  const contextDesc = `
Life Context:
${yearStruggles ? `This Year's Struggles: ${yearStruggles}` : ""}
${yearWants ? `This Year's Desire: ${yearWants}` : ""}
${pastExperiences ? `Past: ${pastExperiences}` : ""}
${currentChallenges ? `Current Challenges: ${currentChallenges}` : ""}
${hopesAndDreams ? `Hopes & Dreams: ${hopesAndDreams}` : ""}
${fearsAndWorries ? `Fears & Concerns: ${fearsAndWorries}` : ""}
${lifeArea ? `Focus Area: ${lifeArea}` : ""}
${focusArea ? `Today's Focus: ${focusArea}` : ""}
${mood ? `Current Mood: ${mood}` : ""}
`;

  return renderPromptTemplate(template, {
    burdenCard,
    leakCard,
    survivalSkillCard,
    shadowCostCard,
    missingMedicineCard,
    helpWorksCard,
    boundarySpellCard,
    northStarCard,
    firstGateCard,
    emergingArchetypeCard,
    cardName: card.name,
    cardElement: card.element,
    cardMeaning: card.meaning,
    personalityDesc,
    contextDesc,
  });
}

function parseAIResponse(text: string) {
  const normalized = text.replace(/\r\n/g, "\n").trim();

  const extractSection = (start: RegExp, end?: RegExp) => {
    const startMatch = normalized.match(start);
    if (!startMatch || startMatch.index === undefined) return "";
    const startIndex = startMatch.index + startMatch[0].length;
    const rest = normalized.slice(startIndex);
    if (!end) return rest.trim();
    const endIndex = rest.search(end);
    return (endIndex === -1 ? rest : rest.slice(0, endIndex)).trim();
  };

  const sectionI = extractSection(
    /SECTION I[^\n]*The Reading[^\n]*\n?/i,
    /SECTION II[^\n]*The Path Opens/i,
  );
  const sectionII = extractSection(/SECTION II[^\n]*The Path Opens[^\n]*\n?/i);

  const extractBullets = (section: string) => {
    const lines = section.split("\n");
    const bodyLines: string[] = [];
    const bullets: string[] = [];
    let current: string | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      const bulletMatch = trimmed.match(/^[-*•]\s+(.*)/);
      if (bulletMatch) {
        if (current) bullets.push(current.trim());
        current = bulletMatch[1].trim();
        continue;
      }
      if (current && trimmed) {
        current = `${current} ${trimmed}`;
        continue;
      }
      if (!current && trimmed) {
        bodyLines.push(trimmed);
      }
    }
    if (current) bullets.push(current.trim());
    return {
      body: bodyLines.join("\n").trim(),
      bullets,
    };
  };

  const { body, bullets } = extractBullets(sectionII);
  const interpretation =
    sectionI || "The cards reveal a quiet story of growth and resilience.";
  const guidance =
    body || "The path opens through gentler containers and steady support.";
  const actions =
    bullets.length > 0
      ? bullets
      : [
          "Choose one supportive container that makes the next step feel lighter.",
        ];

  const lastSentenceMatch = normalized.match(/[^.!?]*[.!?](?=\s*$)/);
  const affirmation =
    lastSentenceMatch?.[0]?.trim() ||
    "The first gate is already open; you are simply walking through.";

  return { interpretation, guidance, actions, affirmation };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ReadingRequestSchema.parse(body);
    
    // Select mystical card based on personality
    const card = selectCard(validated.personalityProfile);
    
    // Build prompt for AI
    const promptTemplate = await getPromptTemplate();
    const prompt = buildPrompt(
      promptTemplate,
      validated.personalityProfile,
      card,
      validated.focusArea,
      validated.mood
    );
    
    // Generate reading with AI
    const aiResponse = await generateReadingWithAI(prompt);
    
    // Parse the AI response
    const { interpretation, guidance, actions, affirmation } = parseAIResponse(aiResponse);
    
    return NextResponse.json({
      success: true,
      reading: {
        cardDrawn: card.name,
        cardElement: card.element,
        cardMeaning: card.meaning,
        interpretation,
        guidanceMessage: guidance,
        actionSteps: actions,
        affirmation,
      },
    });
  } catch (error) {
    console.error("Error generating reading:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to generate reading" },
      { status: 500 }
    );
  }
}
