"use client";

import { useEffect, useState } from "react";

interface Reading {
  cardDrawn: string;
  cardElement: string;
  cardMeaning: string;
  interpretation: string;
  guidanceMessage: string;
  actionSteps: string[];
  affirmation: string;
}

interface ReadingProfile {
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

interface ReadingDisplayProps {
  reading: Reading;
  profile?: ReadingProfile | null;
  onNewReading: () => void;
}

export function ReadingDisplay({
  reading,
  profile,
  onNewReading,
}: ReadingDisplayProps) {
  const fallbackProfile = {
    openness: 55,
    conscientiousness: 55,
    extraversion: 50,
    agreeableness: 65,
    neuroticism: 45,
  };
  const [phase, setPhase] = useState<"deck" | "location" | "spread">("deck");
  const [revealed, setRevealed] = useState({
    past: false,
    present: false,
    future: false,
  });
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "USA",
  });
  const [localRecommendations, setLocalRecommendations] = useState<{
    category: string;
    location: string;
    note: string;
    places: { name: string; type: string; address: string }[];
    aiCurated?: {
      summary: string;
      picks: { name: string; why: string; bestFor: string }[];
    } | null;
  } | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [locationRequested, setLocationRequested] = useState(false);

  const getElementEmoji = (element: string) => {
    switch (element.toLowerCase()) {
      case "fire":
        return "🔥";
      case "water":
        return "💧";
      case "air":
        return "🌬️";
      case "earth":
        return "🌿";
      default:
        return "✨";
    }
  };

  const getElementColor = (element: string) => {
    switch (element.toLowerCase()) {
      case "fire":
        return "from-amber-300 to-orange-500";
      case "water":
        return "from-sky-300 to-teal-400";
      case "air":
        return "from-slate-200 to-amber-200";
      case "earth":
        return "from-emerald-300 to-lime-400";
      default:
        return "from-amber-300 to-amber-500";
    }
  };

  const formatChoice = (value?: string) => {
    if (!value) return "Balanced";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const truncateText = (value: string, maxLength = 120) => {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, maxLength - 1).trim()}…`;
  };

  const rawFocus = profile?.lifeAreaLabel || profile?.lifeArea || "Open Focus";
  const focusLabel = rawFocus.includes("—")
    ? rawFocus.split("—")[0].trim()
    : rawFocus.replace(/_/g, " ");

  const pastThread = truncateText(
    profile?.yearStrugglesLabel ||
      profile?.yearStruggles ||
      profile?.pastExperiencesLabel ||
      profile?.pastExperiences ||
      "A past thread still shapes your present.",
  );
  const futureThread = truncateText(
    profile?.yearWantsLabel ||
      profile?.yearWants ||
      profile?.hopesAndDreamsLabel ||
      profile?.hopesAndDreams ||
      "A desire waits for your clear intention.",
  );

  const presentThread = truncateText(
    reading.interpretation || reading.cardMeaning,
  );

  const personalizationTokens = [
    `Focus: ${focusLabel}`,
    `Perception: ${profile?.intuitionVsSensingLabel ?? formatChoice(profile?.intuitionVsSensing)}`,
    `Decision Style: ${profile?.thinkingVsFeelingLabel ?? formatChoice(profile?.thinkingVsFeeling)}`,
  ];

  const handleReveal = (key: "past" | "present" | "future") => {
    setRevealed((prev) => ({ ...prev, [key]: true }));
  };

  const buildLocalMessage = () => {
    const focusId = (profile?.lifeArea ?? "").toLowerCase();
    const focusLabelText = focusLabel.toLowerCase();
    const gateId = (profile?.firstGateCard ?? "").toLowerCase();
    const categoryHint = gateId.includes("circle")
      ? "dating"
      : gateId.includes("body")
        ? "gym"
        : gateId.includes("skill")
          ? "job"
          : gateId.includes("mind")
            ? "wellness"
            : focusId.includes("love") || focusLabelText.includes("love")
              ? "dating"
              : focusId.includes("career") || focusLabelText.includes("career")
                ? "job"
                : focusId.includes("health") ||
                    focusLabelText.includes("health")
                  ? "gym wellness"
                  : focusId.includes("spiritual") ||
                      focusLabelText.includes("spiritual")
                    ? "wellness"
                    : "social";
    return `Find local ${categoryHint} recommendations aligned with my ${focusLabel} focus. Use my tarot reading for context.`;
  };

  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      setLocalError("Location is not available in this browser.");
      return;
    }
    setLocalError("");
    setLocalLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`,
          );
          if (!response.ok) {
            throw new Error("Unable to resolve location.");
          }
          const data = await response.json();
          const address = data.address ?? {};
          setLocation({
            city:
              address.city ||
              address.town ||
              address.village ||
              address.hamlet ||
              "",
            state: address.state || "",
            country: address.country || "",
          });
        } catch (error) {
          console.error(error);
          setLocalError("Unable to resolve your location. Enter it manually.");
        } finally {
          setLocalLoading(false);
        }
      },
      () => {
        setLocalLoading(false);
        setLocalError("Location access was blocked. Enter it manually.");
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  const handleLocalRecommendations = async () => {
    if (!location.city || !location.country) {
      setLocalError("Please enter a city and country.");
      return;
    }
    setLocalLoading(true);
    setLocalError("");

    try {
      const personalityProfile = profile ?? fallbackProfile;
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalityProfile,
          message: buildLocalMessage(),
          location,
          needsLocalRecommendations: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to fetch recommendations.");
      }

      const data = await response.json();
      setLocalRecommendations(data.localRecommendations ?? null);
    } catch (error) {
      console.error(error);
      setLocalError("Unable to fetch recommendations. Try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (
      phase !== "location" ||
      locationRequested ||
      location.city ||
      localLoading
    ) {
      return;
    }
    setLocationRequested(true);
    void handleUseLocation();
  }, [phase, location.city, locationRequested, localLoading]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f18] text-[#f8f4e9]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1c2534,transparent_55%)] opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(216,180,118,0.22),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_80%,rgba(94,234,212,0.18),transparent_55%)]" />
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl space-y-10">
          {phase === "deck" ? (
            <div className="flex min-h-[640px] flex-col items-center justify-center text-center">
              <div className="relative">
                <div className="h-80 w-56 rounded-[28px] border border-amber-200/40 bg-gradient-to-br from-[#121826] via-[#0d131f] to-[#0a0e17] shadow-2xl shadow-amber-300/30">
                  <div className="absolute inset-5 rounded-[20px] border border-amber-200/20">
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                      <span className="animate-[float_6s_ease-in-out_infinite] text-5xl">
                        🃏
                      </span>
                      <p className="font-ritual-display bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-xl font-semibold text-transparent">
                        Shuffle The Deck
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-amber-200/30 to-transparent blur-2xl" />
              </div>
              <p className="font-ritual-text mt-6 max-w-md text-amber-100/70">
                Breathe in, hold, and release. When you are ready, we will deal
                your spread.
              </p>
              <button
                onClick={() => setPhase("location")}
                className="mt-8 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-10 py-4 font-semibold text-[#15120b] shadow-lg shadow-amber-300/40 transition-all hover:scale-[1.02]"
              >
                Deal The Cards
              </button>
            </div>
          ) : phase === "location" ? (
            <div className="space-y-8">
              <header className="space-y-3 text-center">
                <p className="font-ritual-text text-sm tracking-[0.3em] text-amber-200/60 uppercase">
                  Step Two
                </p>
                <h1 className="font-ritual-display text-4xl font-semibold">
                  Set Your Location
                </h1>
                <p className="font-ritual-text text-amber-100/70">
                  Add your city so we can surface aligned local guidance after
                  your reading.
                </p>
              </header>

              <div className="rounded-3xl border border-amber-200/20 bg-black/40 p-8 shadow-2xl">
                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    value={location.city}
                    onChange={(event) =>
                      setLocation((prev) => ({
                        ...prev,
                        city: event.target.value,
                      }))
                    }
                    placeholder="City"
                    className="w-full rounded-xl border border-amber-200/20 bg-black/30 px-4 py-3 text-sm text-amber-50 placeholder-amber-200/40 focus:border-amber-200 focus:outline-none"
                  />
                  <input
                    value={location.state}
                    onChange={(event) =>
                      setLocation((prev) => ({
                        ...prev,
                        state: event.target.value,
                      }))
                    }
                    placeholder="State / Region"
                    className="w-full rounded-xl border border-amber-200/20 bg-black/30 px-4 py-3 text-sm text-amber-50 placeholder-amber-200/40 focus:border-amber-200 focus:outline-none"
                  />
                  <input
                    value={location.country}
                    onChange={(event) =>
                      setLocation((prev) => ({
                        ...prev,
                        country: event.target.value,
                      }))
                    }
                    placeholder="Country"
                    className="w-full rounded-xl border border-amber-200/20 bg-black/30 px-4 py-3 text-sm text-amber-50 placeholder-amber-200/40 focus:border-amber-200 focus:outline-none"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleUseLocation}
                    disabled={localLoading}
                    className="flex-1 rounded-xl border border-amber-200/30 px-5 py-3 text-sm font-semibold text-amber-100/80 transition-all hover:border-amber-200/60 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Use My Location
                  </button>
                  <button
                    onClick={handleLocalRecommendations}
                    disabled={localLoading}
                    className="flex-1 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-5 py-3 text-sm font-semibold text-[#15120b] shadow-lg shadow-amber-300/40 transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {localLoading ? "Finding..." : "Find Recommendations"}
                  </button>
                </div>

                {localError && (
                  <div className="mt-4 rounded-xl border border-red-400/40 bg-red-900/30 p-3 text-sm text-red-100">
                    {localError}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setPhase("spread")}
                    className="flex-1 rounded-xl border border-amber-200/30 px-5 py-3 text-sm font-semibold text-amber-100/80 transition-all hover:border-amber-200/60"
                  >
                    Continue To Reading
                  </button>
                  <button
                    onClick={() => setPhase("spread")}
                    className="flex-1 rounded-xl bg-black/30 px-5 py-3 text-sm font-semibold text-amber-100/60 transition-all hover:text-amber-100"
                  >
                    Skip For Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <header className="space-y-4 text-center">
                <p className="font-ritual-text text-sm tracking-[0.3em] text-amber-200/60 uppercase">
                  Your Personal Spread
                </p>
                <h1 className="font-ritual-display text-4xl font-semibold md:text-5xl">
                  The {focusLabel} Path
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {personalizationTokens.map((token) => (
                    <span
                      key={token}
                      className="rounded-full border border-amber-200/30 bg-black/40 px-4 py-2 text-xs tracking-[0.2em] text-amber-100/70 uppercase"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </header>

              <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-end">
                <TarotCard
                  title="The Echo"
                  subtitle="Past"
                  detail={pastThread}
                  revealed={revealed.past}
                  onReveal={() => handleReveal("past")}
                />
                <TarotCard
                  title={reading.cardDrawn}
                  subtitle="Present"
                  detail={presentThread}
                  revealed={revealed.present}
                  onReveal={() => handleReveal("present")}
                  badge={`${reading.cardElement} • ${reading.cardMeaning}`}
                  accent={getElementColor(reading.cardElement)}
                  icon={getElementEmoji(reading.cardElement)}
                  isPrimary
                />
                <TarotCard
                  title="The Beacon"
                  subtitle="Future"
                  detail={futureThread}
                  revealed={revealed.future}
                  onReveal={() => handleReveal("future")}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                <div className="rounded-3xl border border-amber-200/20 bg-black/40 p-8 shadow-2xl">
                  <h2 className="font-ritual-display mb-4 text-2xl">
                    The Reading
                  </h2>
                  <div className="space-y-6 text-amber-100/80">
                    <div>
                      <p className="text-sm tracking-[0.3em] text-amber-200/60 uppercase">
                        Interpretation
                      </p>
                      <p className="font-ritual-text mt-2 text-lg leading-relaxed">
                        {reading.interpretation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm tracking-[0.3em] text-amber-200/60 uppercase">
                        Guidance
                      </p>
                      <p className="font-ritual-text mt-2 text-lg leading-relaxed">
                        {reading.guidanceMessage}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-emerald-200/20 bg-black/40 p-6 shadow-2xl">
                    <h2 className="font-ritual-display mb-4 text-xl">
                      Ritual Actions
                    </h2>
                    <div className="space-y-3">
                      {reading.actionSteps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 rounded-2xl border border-emerald-200/20 bg-emerald-400/5 p-4"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-200 to-emerald-400 text-sm font-semibold text-[#142015]">
                            {index + 1}
                          </span>
                          <p className="font-ritual-text text-amber-100/80">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-amber-200/30 bg-gradient-to-br from-[#1b2231] to-[#0c1018] p-6 text-center shadow-2xl">
                    <h2 className="font-ritual-display text-xl">
                      Your Affirmation
                    </h2>
                    <p className="font-ritual-text mt-4 text-2xl text-amber-100 italic">
                      "{reading.affirmation}"
                    </p>
                    <p className="font-ritual-text mt-4 text-sm text-amber-100/60">
                      Whisper this daily to anchor your intention.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={onNewReading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-6 py-4 font-semibold text-[#15120b] shadow-lg shadow-amber-300/40 transition-all hover:scale-[1.02]"
                >
                  ✨ Draw Another Spread
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 rounded-xl border border-amber-200/30 bg-black/30 px-6 py-4 font-semibold text-amber-100/80 transition-all hover:border-amber-200/60"
                >
                  🖨️ Save Your Reading
                </button>
              </div>

              {localRecommendations ? (
                <div className="rounded-3xl border border-amber-200/20 bg-black/40 p-8 shadow-2xl">
                  <h2 className="font-ritual-display text-2xl">
                    Local Guidance
                  </h2>
                  <p className="font-ritual-text mt-2 text-amber-100/70">
                    Recommendations aligned with your reading.
                  </p>
                  <div className="mt-6 space-y-4 rounded-2xl border border-amber-200/20 bg-black/30 p-5">
                    <div className="space-y-1">
                      <p className="text-xs tracking-[0.3em] text-amber-200/60 uppercase">
                        Local Picks — {localRecommendations.category}
                      </p>
                      <p className="font-ritual-display text-lg text-amber-100">
                        {localRecommendations.location}
                      </p>
                      <p className="font-ritual-text text-amber-100/70">
                        {localRecommendations.note}
                      </p>
                    </div>

                    {localRecommendations.aiCurated?.picks?.length ? (
                      <div className="space-y-3">
                        <p className="font-ritual-text text-sm tracking-[0.3em] text-amber-200/60 uppercase">
                          Curated Highlights
                        </p>
                        <p className="font-ritual-text text-amber-100/70">
                          {localRecommendations.aiCurated.summary}
                        </p>
                        {localRecommendations.aiCurated.picks.map((pick) => (
                          <div
                            key={pick.name}
                            className="rounded-xl border border-amber-200/20 bg-black/20 p-4"
                          >
                            <p className="font-ritual-display text-base text-amber-100">
                              {pick.name}
                            </p>
                            <p className="font-ritual-text text-sm text-amber-100/70">
                              {pick.why}
                            </p>
                            <p className="font-ritual-text text-xs tracking-[0.2em] text-amber-200/60 uppercase">
                              Best for: {pick.bestFor}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {localRecommendations.places.map((place) => (
                          <div
                            key={`${place.name}-${place.address}`}
                            className="rounded-xl border border-amber-200/20 bg-black/20 p-4"
                          >
                            <p className="font-ritual-display text-base text-amber-100">
                              {place.name}
                            </p>
                            <p className="font-ritual-text text-sm text-amber-100/70">
                              {place.type} · {place.address}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-amber-200/20 bg-black/40 p-8 shadow-2xl">
                  <h2 className="font-ritual-display text-2xl">
                    Local Guidance
                  </h2>
                  <p className="font-ritual-text mt-2 text-amber-100/70">
                    Add your location to receive nearby recommendations.
                  </p>
                  <button
                    onClick={() => setPhase("location")}
                    className="mt-4 rounded-xl border border-amber-200/30 px-5 py-3 text-sm font-semibold text-amber-100/80 transition-all hover:border-amber-200/60"
                  >
                    Add Location
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TarotCard({
  title,
  subtitle,
  detail,
  revealed,
  onReveal,
  badge,
  accent,
  icon,
  isPrimary,
}: {
  title: string;
  subtitle: string;
  detail: string;
  revealed: boolean;
  onReveal: () => void;
  badge?: string;
  accent?: string;
  icon?: string;
  isPrimary?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative h-72 w-44 ${isPrimary ? "md:h-96 md:w-64" : ""}`}
        style={{ perspective: "1200px" }}
      >
        <button
          onClick={onReveal}
          className="h-full w-full rounded-[26px] focus:outline-none"
        >
          <div
            className="relative h-full w-full transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <div
              className="absolute inset-0 rounded-[26px] border border-amber-200/40 bg-gradient-to-br from-[#151b25] via-[#0c111a] to-[#090b12] shadow-2xl shadow-black/40"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="absolute inset-4 rounded-[20px] border border-amber-200/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <span className="text-3xl">✶</span>
                <span className="font-ritual-display text-sm tracking-[0.4em] text-amber-200/60 uppercase">
                  Tap To Reveal
                </span>
              </div>
            </div>
            <div
              className={`absolute inset-0 rounded-[26px] border border-amber-200/40 bg-gradient-to-br ${
                accent || "from-[#22293a] to-[#0f131d]"
              } shadow-2xl shadow-black/50`}
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center ${
                  isPrimary ? "text-[#17140f]" : "text-amber-100/90"
                }`}
              >
                {icon && <span className="text-4xl">{icon}</span>}
                <p className="font-ritual-display text-lg">{title}</p>
                <p className="text-xs tracking-[0.3em] uppercase">{subtitle}</p>
                {badge && (
                  <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] tracking-[0.3em] text-amber-100/70 uppercase">
                    {badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        </button>
      </div>
      <div className="min-h-[72px] max-w-[220px] text-center">
        <p className="font-ritual-display text-sm tracking-[0.4em] text-amber-200/60 uppercase">
          {subtitle}
        </p>
        <p className="font-ritual-text mt-2 text-sm text-amber-100/70">
          {revealed ? detail : "Reveal to see the message."}
        </p>
      </div>
    </div>
  );
}
