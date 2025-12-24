"use client";

import { useState } from "react";

import { PersonalityQuestionnaire } from "./personality-questionnaire";
import { ReadingDisplay } from "./reading-display";

type AppState = "landing" | "questionnaire" | "loading" | "reading";

interface QuestionnaireData {
  burdenCard?: string;
  burdenCardLabel?: string;
  leakCard?: string;
  leakCardLabel?: string;
  survivalSkillCard?: string;
  survivalSkillCardLabel?: string;
  shadowCostCard?: string;
  shadowCostCardLabel?: string;
  missingMedicineCard?: string;
  missingMedicineCardLabel?: string;
  helpWorksCard?: string;
  helpWorksCardLabel?: string;
  boundarySpellCard?: string;
  boundarySpellCardLabel?: string;
  northStarCard?: string;
  northStarCardLabel?: string;
  firstGateCard?: string;
  firstGateCardLabel?: string;
  emergingArchetypeCard?: string;
  emergingArchetypeCardLabel?: string;
  yearStruggles?: string;
  yearStrugglesLabel?: string;
  yearWants?: string;
  yearWantsLabel?: string;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  intuitionVsSensing?: string;
  intuitionVsSensingLabel?: string;
  thinkingVsFeeling?: string;
  thinkingVsFeelingLabel?: string;
  pastExperiences?: string;
  pastExperiencesLabel?: string;
  currentChallenges?: string;
  currentChallengesLabel?: string;
  hopesAndDreams?: string;
  hopesAndDreamsLabel?: string;
  fearsAndWorries?: string;
  fearsAndWorriesLabel?: string;
  lifeArea?: string;
  lifeAreaLabel?: string;
}

interface Reading {
  cardDrawn: string;
  cardElement: string;
  cardMeaning: string;
  interpretation: string;
  guidanceMessage: string;
  actionSteps: string[];
  affirmation: string;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  order: number;
  category: string | null;
}

interface HomePageClientProps {
  questions: Question[];
}

export function HomePageClient({ questions }: HomePageClientProps) {
  const [state, setState] = useState<AppState>("landing");
  const [reading, setReading] = useState<Reading | null>(null);
  const [profile, setProfile] = useState<QuestionnaireData | null>(null);
  const [error, setError] = useState<string>("");

  const handleStartJourney = () => {
    setState("questionnaire");
  };

  const handleQuestionnaireComplete = async (data: QuestionnaireData) => {
    setState("loading");
    setError("");
    setProfile(data);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "spiritualClarity.profile",
        JSON.stringify(data),
      );
    }

    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalityProfile: data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reading");
      }

      const result = (await response.json()) as {
        success: boolean;
        reading?: Reading;
        error?: string;
      };

      if (result.success && result.reading) {
        setReading(result.reading);
        setState("reading");
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error generating reading:", err);
      setError("Unable to generate your reading. Please try again.");
      setState("questionnaire");
    }
  };

  const handleNewReading = () => {
    setReading(null);
    setState("landing");
  };

  if (state === "questionnaire") {
    return (
      <PersonalityQuestionnaire
        onComplete={handleQuestionnaireComplete}
        questions={questions}
      />
    );
  }

  if (state === "loading") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0f18] text-[#f8f4e9]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2b3c,transparent_55%)] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(216,180,118,0.18),transparent_45%)]" />
        <div className="relative z-10 space-y-6 text-center">
          <div className="relative">
            <div className="mx-auto h-32 w-32">
              <div className="absolute inset-0 rounded-full border-4 border-amber-200/20" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-amber-300" />
              <div className="absolute inset-0 flex animate-pulse items-center justify-center text-5xl">
                🔮
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-ritual-display bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text text-2xl font-semibold text-transparent">
              Shuffling the Deck...
            </h2>
            <p className="font-ritual-text text-amber-100/70">
              The table is set for a personalized reveal
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "reading" && reading) {
    return (
      <ReadingDisplay
        reading={reading}
        profile={profile}
        onNewReading={handleNewReading}
      />
    );
  }

  // Landing page
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f18] text-[#f8f4e9]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1c2534,transparent_55%)] opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(216,180,118,0.2),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(94,234,212,0.12),transparent_40%)]" />
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="space-y-8 py-12 text-center">
            <div className="inline-block">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-amber-200/40 bg-gradient-to-br from-[#1b2433] to-[#0c1018] shadow-2xl shadow-amber-300/20">
                <span className="animate-[float_6s_ease-in-out_infinite] text-6xl">
                  🜂
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="font-ritual-display bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-6xl leading-tight font-bold text-transparent md:text-7xl">
                Spiritual Clarity Tarot
              </h1>
              <p className="font-ritual-text text-2xl text-amber-100/80">
                A ritualized tarot experience shaped by your story
              </p>
            </div>

            <p className="font-ritual-text mx-auto max-w-2xl text-lg leading-relaxed text-amber-100/70">
              Draw a spread, reveal your cards, and receive guidance tuned to
              your personality, experiences, and deepest intentions.
            </p>

            {error && (
              <div className="mx-auto max-w-md rounded-xl border border-red-400/40 bg-red-900/40 p-4">
                <p className="text-red-100">{error}</p>
              </div>
            )}

            <button
              onClick={handleStartJourney}
              className="group relative rounded-2xl bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 px-12 py-5 text-xl font-semibold text-[#17140f] shadow-2xl shadow-amber-300/40 transition-all hover:scale-105 hover:shadow-amber-300/70"
            >
              <span className="relative z-10">Begin Your Journey ✨</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-200 to-amber-400 opacity-0 blur transition-opacity group-hover:opacity-20" />
            </button>

            {/* Show question count from database */}
            <p className="text-sm text-amber-100/50">
              {questions.length} personalized questions ready
            </p>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="space-y-3 rounded-2xl border border-amber-200/20 bg-black/40 p-6 text-center backdrop-blur-lg transition-all hover:border-amber-200/50">
              <div className="text-4xl">🧠</div>
              <h3 className="font-ritual-display text-xl font-semibold text-amber-100">
                Personality-Based
              </h3>
              <p className="font-ritual-text text-sm text-amber-100/70">
                Uses proven Big 5 and MBTI frameworks to understand your unique
                traits
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-emerald-200/20 bg-black/40 p-6 text-center backdrop-blur-lg transition-all hover:border-emerald-200/50">
              <div className="text-4xl">🗝️</div>
              <h3 className="font-ritual-display text-xl font-semibold text-emerald-100">
                AI-Powered
              </h3>
              <p className="font-ritual-text text-sm text-amber-100/70">
                Insightful language shaped to your story and intentions
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-amber-200/20 bg-black/40 p-6 text-center backdrop-blur-lg transition-all hover:border-amber-200/50">
              <div className="text-4xl">🪄</div>
              <h3 className="font-ritual-display text-xl font-semibold text-amber-100">
                Ritualized Experience
              </h3>
              <p className="font-ritual-text text-sm text-amber-100/70">
                A guided spread with clear actions to carry your reading forward
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-16 space-y-8">
            <h2 className="font-ritual-display bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-center text-3xl font-bold text-transparent">
              How The Spread Unfolds
            </h2>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Share Your Story",
                  description:
                    "Answer questions about your personality, experiences, hopes, and fears",
                  icon: "📝",
                },
                {
                  step: 2,
                  title: "AI Analysis",
                  description:
                    "Our AI analyzes your unique profile to select the perfect guidance card",
                  icon: "🔮",
                },
                {
                  step: 3,
                  title: "Receive Guidance",
                  description:
                    "Get personalized interpretation, actionable steps, and an empowering affirmation",
                  icon: "✨",
                },
                {
                  step: 4,
                  title: "Take Action",
                  description:
                    "Use your insights to make decisions and move forward with confidence",
                  icon: "🚀",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-4 rounded-xl border border-amber-200/20 bg-black/40 p-6 backdrop-blur-lg transition-all hover:border-amber-200/40"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-amber-400 text-2xl text-[#15120b]">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-ritual-display mb-1 text-lg font-semibold text-amber-100">
                      Step {item.step}: {item.title}
                    </h3>
                    <p className="font-ritual-text text-sm text-amber-100/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl border border-amber-200/30 bg-gradient-to-r from-[#151b25]/80 to-[#101623]/80 p-12 text-center">
            <h2 className="font-ritual-display mb-4 text-3xl font-bold text-amber-100">
              Ready To Draw Your Cards?
            </h2>
            <p className="font-ritual-text mx-auto mb-8 max-w-2xl text-amber-100/70">
              Your personalized spread awaits. Reveal the message meant for you
              and step forward with clarity.
            </p>
            <button
              onClick={handleStartJourney}
              className="rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-10 py-4 text-lg font-semibold text-[#15120b] shadow-lg shadow-amber-300/50 transition-all hover:scale-105"
            >
              Start Your Reading →
            </button>
          </div>

          {/* Footer */}
          <div className="font-ritual-text mt-12 text-center text-sm text-amber-100/60">
            <p>Crafted as a ritual for seekers of clarity and self-trust</p>
            <p className="mt-2">Powered by AI and personality insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}
