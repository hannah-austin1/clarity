import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const AgentRequestSchema = z.object({
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
  message: z.string(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional(),
  location: z
    .object({
      city: z.string(),
      state: z.string().optional(),
      country: z.string(),
    })
    .optional(),
  needsLocalRecommendations: z.boolean().optional(),
});

/**
 * AI Agent that combines spiritual guidance with practical local recommendations
 */
async function callAIAgent(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = [],
) {
  const { env } = await import("~/env");

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

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
            "X-Title": "Spiritual Clarity Agent",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.8,
            max_tokens: 800,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        return data.choices[0]?.message?.content || "";
      }

      lastError = new Error(`AI API error: ${response.statusText}`);
    }

    throw lastError ?? new Error("AI API error: No models available");
  } catch (error) {
    console.error("Error calling AI agent:", error);
    throw error;
  }
}

async function callLocalGuideAI(args: {
  category: string;
  location: string;
  places: { name: string; type: string; address: string }[];
  profile: any;
}) {
  const { env } = await import("~/env");

  const profileSummary = [
    `Openness: ${args.profile.openness}/100`,
    `Conscientiousness: ${args.profile.conscientiousness}/100`,
    `Extraversion: ${args.profile.extraversion}/100`,
    args.profile.lifeAreaLabel || args.profile.lifeArea
      ? `Focus: ${args.profile.lifeAreaLabel || args.profile.lifeArea}`
      : null,
    args.profile.yearWantsLabel || args.profile.yearWants
      ? `Goals: ${args.profile.yearWantsLabel || args.profile.yearWants}`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  const placesList = args.places
    .map(
      (place, index) =>
        `${index + 1}. ${place.name} (${place.type}) — ${place.address}`,
    )
    .join("\n");

  const systemPrompt =
    "You are a local guide helping someone pick the best places near them. Respond in JSON only.";
  const userPrompt = `
Location: ${args.location}
Category: ${args.category}
Profile: ${profileSummary}

Places:
${placesList}

Return JSON with:
{
  "summary": string,
  "picks": [{ "name": string, "why": string, "bestFor": string }]
}
Pick up to 3 places from the list. Be concise.`;

  try {
    const models = [
      "tngtech/deepseek-r1t2-chimera:free",
      "deepseek/deepseek-chat:free",
    ];
    let content: string | null = null;

    for (const model of models) {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://spiritual-clarity.app",
            "X-Title": "Spiritual Clarity Agent",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.4,
            max_tokens: 400,
          }),
        },
      );

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      content = data.choices[0]?.message?.content ?? null;
      if (content) {
        break;
      }
    }

    if (!content) return null;

    const cleaned = content
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "");
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Error calling local guide AI:", error);
    return null;
  }
}

/**
 * Get local recommendations using free OpenStreetMap services
 */
async function getLocalRecommendations(
  location: { city: string; state?: string; country: string },
  category: "dating" | "gym" | "jobs" | "wellness" | "social",
  personalityProfile: any,
) {
  try {
    const locationQuery = [location.city, location.state, location.country]
      .filter(Boolean)
      .join(", ");

    // Free geocoding with Nominatim
    const geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "SpiritualClarityApp/1.0",
        },
      },
    );

    const geocodeData = await geocodeResponse.json();
    if (!geocodeData || geocodeData.length === 0) {
      return {
        success: false,
        message: "Location not found",
      };
    }

    const { lat, lon } = geocodeData[0];

    // Map categories to OSM amenity types
    const categoryTags: Record<string, string> = {
      dating: "cafe|bar|restaurant",
      gym: "fitness_centre|sports_centre",
      jobs: "coworking_space|library",
      wellness: "spa|yoga|meditation",
      social: "community_centre|club",
    };

    const tags = categoryTags[category] || "cafe";

    // Query Overpass API for nearby places
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"~"${tags}"](around:5000,${lat},${lon});
        way["amenity"~"${tags}"](around:5000,${lat},${lon});
        node["leisure"~"fitness_centre|sports_centre"](around:5000,${lat},${lon});
      );
      out center 10;
    `;

    const overpassResponse = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: overpassQuery,
      },
    );

    const overpassData = await overpassResponse.json();
    const places = overpassData.elements || [];

    const recommendations = places.slice(0, 5).map((place: any) => ({
      name: place.tags?.name || "Local venue",
      type: place.tags?.amenity || place.tags?.leisure || category,
      address: place.tags?.["addr:street"]
        ? `${place.tags["addr:housenumber"] || ""} ${place.tags["addr:street"]}`
        : "Address unavailable",
    }));

    const baseRecommendations = {
      success: true,
      category,
      location: locationQuery,
      recommendations,
      personalizedNote: generatePersonalizedNote(category, personalityProfile),
    };
    return baseRecommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return {
      success: false,
      message: "Unable to fetch local recommendations",
    };
  }
}

function generatePersonalizedNote(category: string, profile: any): string {
  const { extraversion, conscientiousness } = profile;

  const notes: Record<string, string> = {
    dating:
      extraversion > 60
        ? "Your outgoing nature will shine in these social settings!"
        : "These spots are perfect for meaningful one-on-one connections.",
    gym:
      conscientiousness > 60
        ? "Your disciplined approach will help you build a strong routine!"
        : "Start small - consistency matters more than intensity!",
    jobs: "These spaces offer great networking and growth opportunities.",
    wellness: "These wellness spots align with your needs for self-care.",
    social:
      extraversion > 60
        ? "Your social energy will flourish here!"
        : "These offer welcoming environments for connections.",
  };

  return notes[category] || "Here are personalized recommendations for you!";
}

function buildAgentSystemPrompt(profile: any): string {
  const focus = profile.lifeAreaLabel || profile.lifeArea;
  const yearStruggles = profile.yearStrugglesLabel || profile.yearStruggles;
  const yearWants = profile.yearWantsLabel || profile.yearWants;

  return `You are a wise, empathetic AI agent combining spiritual guidance with practical advice.

USER PERSONALITY:
- Openness: ${profile.openness}/100
- Conscientiousness: ${profile.conscientiousness}/100
- Extraversion: ${profile.extraversion}/100
- Agreeableness: ${profile.agreeableness}/100

CONTEXT:
${yearStruggles ? `Struggles: ${yearStruggles}` : ""}
${yearWants ? `Goals: ${yearWants}` : ""}
${focus ? `Focus: ${focus}` : ""}

Be warm, supportive, and practical. Tailor advice to their personality. Keep responses 2-3 paragraphs.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = AgentRequestSchema.parse(body);

    const systemPrompt = buildAgentSystemPrompt(validated.personalityProfile);

    const needsLocal =
      validated.needsLocalRecommendations ||
      /\b(gym|fitness|dating|date|job|work|wellness|yoga|local|near me)\b/i.test(
        validated.message,
      );

    let localRecommendations = null;

    if (needsLocal && validated.location) {
      let category: "dating" | "gym" | "jobs" | "wellness" | "social" =
        "social";

      if (/\b(gym|fitness)\b/i.test(validated.message)) category = "gym";
      else if (/\b(dating|date)\b/i.test(validated.message))
        category = "dating";
      else if (/\b(job|work)\b/i.test(validated.message)) category = "jobs";
      else if (/\b(wellness|yoga|spa)\b/i.test(validated.message))
        category = "wellness";

      localRecommendations = await getLocalRecommendations(
        validated.location,
        category,
        validated.personalityProfile,
      );
    }

    const agentResponse = await callAIAgent(
      systemPrompt,
      validated.message,
      validated.conversationHistory || [],
    );

    const aiCurated =
      localRecommendations?.success &&
      localRecommendations.recommendations.length
        ? await callLocalGuideAI({
            category: localRecommendations.category,
            location: localRecommendations.location,
            places: localRecommendations.recommendations,
            profile: validated.personalityProfile,
          })
        : null;

    return NextResponse.json({
      success: true,
      response: agentResponse,
      localRecommendations: localRecommendations?.success
        ? {
            category: localRecommendations.category,
            location: localRecommendations.location,
            places: localRecommendations.recommendations,
            note: localRecommendations.personalizedNote,
            aiCurated,
          }
        : null,
      needsLocation: needsLocal && !validated.location,
    });
  } catch (error) {
    console.error("Error in agent:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Agent failed" },
      { status: 500 },
    );
  }
}
